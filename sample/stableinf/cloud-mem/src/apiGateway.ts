import { ApiGateway, Serverless } from '@stableinf/cloud';
import * as childProcess from 'child_process';
import * as path from 'path';

let payload = {
    sharedLayer: '',
    routes: {} as Record<string, any>
};
let worker: childProcess.ChildProcess | undefined;

export const apiGateway: ApiGateway & Serverless = {
    createSharedLayer: async (layerCode) => {
        payload.sharedLayer = layerCode;
    },
    createFunction: async () => {},
    createRoute: async (options) => {
        payload.routes[options.path] = options;
        if (worker) {
            worker.kill();
        } else {
            startWorker();
        }
    },
};

function startWorker() {
    worker = childProcess.fork(path.join(__dirname, 'apiGateway_worker.js'), {});
    worker.send(JSON.stringify(payload));
    worker.on('exit', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        worker = undefined;
        startWorker();
    });
}
