import { Database, HttpX, newOperation, Operation, Scene, ServiceProtocol } from '@autonomy/io';
import * as http from 'http';

type ServiceClass = new () => any;

export class HttpXServer {
    constructor(
        private readonly options: {
            database: Database;
            serviceProtocol: ServiceProtocol;
            services: Map<string, ServiceClass>;
            middleware?: (scene: Scene, handler: Function, args: any[]) => Promise<any>;
        },
    ) {}

    public listen(...args: Parameters<http.Server['listen']>) {
        return http.createServer(this.handleRequest.bind(this)).listen(...args);
    }

    private handleRequest(req: http.IncomingMessage, resp: http.ServerResponse) {
        let reqBody = '';
        req.on('data', (chunk) => {
            reqBody += chunk;
        });
        req.on('end', async () => {
            resp.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff',
            });
            const jobs: HttpX.Job[] = JSON.parse(reqBody) || [];
            const operation =
                createOperationFromHeaders(req.headers) || newOperation('handle /call');
            const promises = jobs.map((job, i) => this.execute(i, job, operation, resp));
            await Promise.all(promises);
            resp.end();
        });
    }

    private async execute(
        index: number,
        job: HttpX.Job,
        operation: Operation,
        resp: http.ServerResponse,
    ) {
        const { service, args } = job;
        const serviceClass = this.options.services.get(service);
        if (!serviceClass) {
            console.error('can not find handler', job.service);
            resp.write(
                JSON.stringify({ index, error: `handler not found: ${job.service}` }) + '\n',
            );
            return;
        }
        const subscribed: string[] = [];
        const changed: string[] = [];
        const scene = new Scene({ ...this.options, operation });
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
            const handler = Reflect.get(serviceClass, service);
            const result = await this.runService(scene, handler, args);
            resp.write(JSON.stringify({ index, data: result, subscribed, changed }) + '\n');
        } catch (e) {
            console.error(`failed to handle: ${JSON.stringify(job)}\n`, e);
            resp.write(JSON.stringify({ index, error: new String(e) }) + '\n');
            resp.flushHeaders();
        }
    }

    private async runService(scene: Scene, handler: Function, args: any[]) {
        if (this.options.middleware) {
            return await this.options.middleware(scene, handler, args);
        }
        return await handler.call(undefined, scene, ...args);
    }
}

function createOperationFromHeaders(
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
