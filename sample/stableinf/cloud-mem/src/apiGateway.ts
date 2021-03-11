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
const jsPath = path.join(__dirname, 'apiGateway_worker.js');

export const apiGateway: ApiGateway & Serverless = {
    createSharedLayer: async (layerCode) => {
        payload.sharedLayer = layerCode;
    },
    createFunction: async () => {},
    createRoute: async (options) => {
        payload.routes[options.path] = options;
        const tmpPath = `/tmp/${options.projectPackageName.replace('/', '-')}`;
        const sharedLayerJsPath = `${tmpPath}.js`;
        fs.writeFileSync(sharedLayerJsPath, payload.sharedLayer);
        const routesJsonPath = `${tmpPath}.json`;
        fs.writeFileSync(routesJsonPath, JSON.stringify(payload.routes));
        if (worker) {
            fs.existsSync(pidPath) && fs.unlinkSync(pidPath);
            worker.kill();
        } else {
            startWorker([sharedLayerJsPath, routesJsonPath]);
        }
    },
};

function startWorker(args: string[]) {
    try {
        const pid = Number.parseInt(fs.readFileSync(pidPath).toString());
        process.kill(pid);
        fs.unlinkSync(pidPath);
    } catch (e) {
        // pid file might not present
    }
    worker = childProcess.spawn(process.argv0, ['-r', 'source-map-support/register', jsPath, ...args]);
    fs.writeFileSync(pidPath, `${worker.pid}`);
    worker.stdout!.pipe(process.stdout);
    worker.stderr!.pipe(process.stderr);
    worker.on('exit', async (code) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        worker = undefined;
        fs.existsSync(pidPath) && fs.unlinkSync(pidPath);
        startWorker(args);
    });
}
