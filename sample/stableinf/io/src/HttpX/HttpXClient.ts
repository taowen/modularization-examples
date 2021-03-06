import { uuid } from '../uuid';
import { BatchExecutor } from '../BatchExecutor';
import { Atom, AtomSubscriber, Operation, Scene, ServiceProtocol, SimpleAtom } from '../Scene';
import { isJobError, Job, JobResult } from './HttpX';

// 前端通过互联网调用 api gateway 后面的 serverless
export class HttpXClient implements ServiceProtocol {
    public async callService(scene: Scene, project: string, service: string, args: any[]) {
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
    const operationJobs = new Map<Operation, RpcJob[]>();
    for (const job of batch) {
        let jobs = operationJobs.get(job.scene.operation);
        if (!jobs) {
            operationJobs.set(job.scene.operation, (jobs = []));
        }
        jobs.push(job);
    }
    const promises = [];
    for (const [operation, jobs] of operationJobs.entries()) {
        promises.push(batchExecuteOneOperationJobs(project, operation, jobs));
    }
    await Promise.all(promises);
}

async function batchExecuteOneOperationJobs(project: string, operation: Operation, jobs: RpcJob[]) {
    const headers: Record<string, string> = {
        'x-project': project,
        'x-b3-traceid': operation.traceId,
        'x-b3-parentspanid': operation.spanId,
        'x-b3-spanid': uuid(),
        'baggage-op': operation.traceOp,
    };
    for (const [k, v] of Object.entries(operation.baggage)) {
        headers[`baggage-${k}`] = v;
    }
    const resp = await fetch('http://localhost:3000/batchCall', {
        method: 'POST',
        headers,
        body: JSON.stringify(jobs.map((job) => job.job)),
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
            const job = jobs[result.index];
            if (isJobError(result)) {
                job.reject(result.error);
            } else {
                for (const tableName of result.subscribed) {
                    job.scene.subscribe(remoteTable(tableName));
                }
                for (const tableName of result.changed) {
                    job.scene.notifyChange(remoteTable(tableName));
                }
                job.resolve(result.data);
            }
        }
    }
}

const remoteTables = new Map<string, RemoteTable>();

function remoteTable(tableName: string) {
    let atom = remoteTables.get(tableName);
    if (!atom) {
        remoteTables.set(tableName, atom = new RemoteTable(tableName));
    }
    return atom;
}

class RemoteTable extends SimpleAtom {
    constructor(public readonly tableName: string) {
        super();
    }
}
