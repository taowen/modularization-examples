import { newOperation, Operation, Scene, SceneConf } from '../Scene';
import { Job } from './HttpX';
import type { ServerResponse, IncomingMessage } from 'http';

// apiGateway => handleBatchCall => handleCall => services
export async function handleBatchCall(sceneConf: SceneConf, req: IncomingMessage, resp: ServerResponse) {
    let reqBody = '';
    req.on('data', (chunk) => {
        reqBody += chunk;
    });
    await new Promise((resolve) => req.on('end', resolve));
    resp.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Content-Type-Options': 'nosniff',
    });
    const jobs: Job[] = JSON.parse(reqBody) || [];
    const operation = createOperationFromHeaders(req.headers) || newOperation('handle /call');
    const promises = jobs.map((job, i) => execute(i, job, sceneConf, operation, resp));
    await Promise.all(promises);
    resp.end();
}

async function execute(
    index: number,
    job: Job,
    conf: SceneConf,
    operation: Operation,
    resp: ServerResponse,
) {
    const { service, args } = job;
    const scene = new Scene({ ...conf, operation });
    const subscribed: string[] = [];
    const changed: string[] = [];
    scene.notifyChange = (table) => {
        if (!changed.includes(table)) {
            changed.push(table);
        }
    };
    scene.subscribers.add({
        subscribe(table) {
            if (!subscribed.includes(table)) {
                subscribed.push(table);
            }
        },
    });
    try {
        const result = await scene.useServices<any>()[service](...args);
        resp.write(JSON.stringify({ index, data: result, subscribed, changed }) + '\n');
    } catch (e) {
        console.error(`failed to handle: ${JSON.stringify(job)}\n`, e);
        resp.write(JSON.stringify({ index, error: new String(e) }) + '\n');
    }
}

export function createOperationFromHeaders(
    headers: Record<string, string> | NodeJS.Dict<string | string[]>,
): Operation | undefined {
    if (!headers) {
        return undefined;
    }
    const traceId = headers['x-b3-traceid'] as string;
    if (!traceId) {
        return undefined;
    }
    const baggage: Record<string, string> = {};
    for (const [k, v] of Object.entries(headers)) {
        if (k.startsWith('baggage-') && typeof v === 'string') {
            baggage[k.substr('baggage-'.length)] = v;
        }
    }
    const spanId = headers['x-b3-spanid'] as string;
    const parentSpanId = headers['x-b3-parentspanid'] as string;
    return {
        traceId,
        parentSpanId,
        spanId,
        baggage: baggage,
        traceOp: baggage['op'],
        props: {},
    };
}
