import { Database, Scene, ServiceProtocol } from '../Scene';
import type { IncomingMessage, ServerResponse } from 'http';
import { Job } from './proto';
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

    public handleRequest(req: IncomingMessage, resp: ServerResponse) {
        let reqBody = '';
        req.on('data', (chunk) => {
            reqBody += chunk;
        });
        req.on('end', async () => {
            const jobs: Job[] = JSON.parse(reqBody) || [];
            const promises = jobs.map(job => this.execute(job));
            const results = [];
            for (const promise of promises) {
                results.push(await promise);
            }
            resp.end(JSON.stringify(results));
        });
    }

    private async execute(job: Job) {
        const { service, args } = job;
        const serviceClass = this.options.services.get(service);
        if (!serviceClass) {
            console.error('can not find handler', job.service);
            return { error: 'handler not found' };
        }
        const subscribed: string[] = [];
        const changed: string[] = [];
        const scene = this.createScene();
        scene.notifyChange = (table) => {
            if (!changed.includes(table)) {
                changed.push(table);
            }
        }
        scene.subscribers.add({ subscribe(table) {
            if (!subscribed.includes(table)) {
                subscribed.push(table);
            }
        }})
        try {
            const handler = Reflect.get(serviceClass, service);
            const result = await this.runService(scene, handler, args);
            return { data: result, subscribed, changed };
        } catch (e) {
            console.error(`failed to handle: ${JSON.stringify(job)}\n`, e);
            return { error: new String(e) };
        }
    }

    private createScene() {
        return new Scene({
            ...this.options,
            operation: {
                traceId: '',
                traceOp: '',
                baggage: {},
                props: {},
            },
        });
    }

    private async runService(scene: Scene, handler: Function, args: any[]) {
        if (this.options.middleware) {
            return await this.options.middleware(scene, handler, args);
        }
        return await handler.call(undefined, scene, ...args);
    }
}
