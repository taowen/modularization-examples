"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpXClient = void 0;
const BatchExecutor_1 = require("../BatchExecutor");
const proto_1 = require("./proto");
class HttpXClient {
    useServices(scene, project) {
        return new Proxy({}, {
            get: (target, propertyKey, receiver) => {
                project = project || HttpXClient.project;
                return callViaHttp.bind(undefined, scene, project, propertyKey);
            },
        });
    }
}
exports.HttpXClient = HttpXClient;
async function callViaHttp(scene, project, service, ...args) {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    enqueue({
        scene,
        job: { project, service, args },
        resolve: resolve,
        reject: reject,
    });
    return await promise;
}
const projects = new Map();
function enqueue(job) {
    const project = job.job.project;
    let batchExecutor = projects.get(project);
    if (!batchExecutor) {
        batchExecutor = new BatchExecutor_1.BatchExecutor(32, batchExecute.bind(undefined, project));
        projects.set(project, batchExecutor);
    }
    batchExecutor.enqueue(job);
}
async function batchExecute(project, batch) {
    const resp = await fetch('/call', {
        method: 'POST',
        headers: {
            'X-Project': project,
        },
        body: JSON.stringify(batch.map((job) => job.job)),
    });
    const results = (await resp.json());
    for (const [i, result] of results.entries()) {
        const job = batch[i];
        if (proto_1.isJobError(result)) {
            job.reject(result.error);
        }
        else {
            for (const table of result.subscribed) {
                for (const subscriber of job.scene.subscribers) {
                    subscriber.subscribe(table);
                }
            }
            for (const table of result.changed) {
                job.scene.notifyChange(table);
            }
            job.resolve(result.data);
        }
    }
}
//# sourceMappingURL=HttpXClient.js.map