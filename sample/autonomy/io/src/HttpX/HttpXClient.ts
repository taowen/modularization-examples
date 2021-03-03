import { BatchExecutor } from '../BatchExecutor';
import { Scene, ServiceProtocol } from '../Scene';
import { isJobError, Job, JobResult } from './HttpX';

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
        project,
        job: { service, args },
        resolve: resolve!,
        reject: reject!,
    });
    return await promise;
}

interface RpcJob {
    scene: Scene;
    project: string;
    job: Job;
    resolve: (result: any) => void;
    reject: (reason: any) => void;
}

const projects = new Map<string, BatchExecutor<RpcJob>>();

function enqueue(job: RpcJob) {
    const project = job.project;
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
    const reader = resp.body!.getReader();
    const decoder = new TextDecoder('utf-8');
    let buf = '';
    while (true) {
        const chunk = await reader.read();
        if (chunk.done) {
            break;
        }
        buf += decoder.decode(chunk.value!, { stream: true });
        const lines = buf.split('\n');
        buf = lines[lines.length - 1];
        lines.length = lines.length - 1;
        for (const line of lines) {
            const result = JSON.parse(line) as JobResult;
            const job = batch[result.index];
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
}
