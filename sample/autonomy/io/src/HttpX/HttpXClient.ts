import { BatchExecutor } from '../BatchExecutor';
import { Scene, ServiceProtocol } from '../Scene';
import { isJobError, Job, JobResult } from './proto';

export class HttpXClient implements ServiceProtocol {
    public static project: string;
    public useServices(scene: Scene, project?: string) {
        return new Proxy(
            {},
            {
                get: (target: object, propertyKey: string, receiver?: any) => {
                    project = project || HttpXClient.project;
                    return callViaHttp.bind(undefined, scene, project!, propertyKey);
                },
            },
        ) as any;
    }
}

async function callViaHttp(scene: Scene, project: string, service: string, ...args: any[]) {
    let resolve: (result: any) => void;
    let reject: (reason: any) => void;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    enqueue({
        scene,
        job: { project, service, args },
        resolve: resolve!,
        reject: reject!,
    });
    return await promise;
}

interface RpcJob {
    scene: Scene;
    job: Job;
    resolve: (result: any) => void;
    reject: (reason: any) => void;
}

const projects = new Map<string, BatchExecutor<RpcJob>>();

function enqueue(job: RpcJob) {
    const project = job.job.project;
    let batchExecutor = projects.get(project);
    if (!batchExecutor) {
        batchExecutor = new BatchExecutor<RpcJob>(32, batchExecute.bind(undefined, project));
        projects.set(project, batchExecutor);
    }
    batchExecutor.enqueue(job);
}

async function batchExecute(project: string, batch: RpcJob[]) {
    const resp = await fetch('/call', {
        method: 'POST',
        headers: {
            'X-Project': project,
        },
        body: JSON.stringify(batch.map((job) => job.job)),
    });
    const results = (await resp.json()) as JobResult[];
    for (const [i, result] of results.entries()) {
        const job = batch[i];
        if (isJobError(result)) {
            job.reject(result.error);
        } else {
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
