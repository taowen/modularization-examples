import { ApiGateway, Serverless } from '@stableinf/cloud';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

let payload = {
    sharedLayer: '',
    routes: {} as Record<string, any>,
};
let worker: childProcess.ChildProcess | undefined;
const pidPath = '/tmp/apiGateway_worker.pid';
const jsPath = '/tmp/apiGateway_worker.js';
const jsTemplate = fs.readFileSync(path.join(__dirname, 'apiGateway_worker.tpl.js')).toString();

export const apiGateway: ApiGateway & Serverless = {
    createSharedLayer: async (layerCode) => {
        payload.sharedLayer = layerCode;
    },
    createFunction: async () => {},
    createRoute: async (options) => {
        payload.routes[options.path] = options;
        if (worker) {
            fs.existsSync(pidPath) && fs.unlinkSync(pidPath);
            worker.kill();
        } else {
            startWorker();
        }
    },
};

function startWorker() {
    try {
        const pid = Number.parseInt(fs.readFileSync(pidPath).toString());
        process.kill(pid);
        fs.unlinkSync(pidPath);
    } catch (e) {
        // pid file might not present
    }
    const workerCode = jsTemplate
        .replace('$sharedLayer', payload.sharedLayer)
        .replace('$routes', JSON.stringify(payload.routes, undefined, '  '));
    fs.writeFileSync(jsPath, workerCode);
    worker = childProcess.spawn(process.argv0, [jsPath]);
    fs.writeFileSync(pidPath, `${worker.pid}`);
    worker.stdout!.pipe(process.stdout);
    worker.stderr!.pipe(process.stderr);
    worker.on('exit', async (code) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        worker = undefined;
        fs.existsSync(pidPath) && fs.unlinkSync(pidPath);
        startWorker();
    });
}
