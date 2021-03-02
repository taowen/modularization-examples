import { Database, Scene, ServiceProtocol } from '../Scene';
import type { IncomingMessage, ServerResponse } from 'http';
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
            const { service, args } = JSON.parse(reqBody) || {};
            const serviceClass = this.options.services.get(service);
            if (!serviceClass) {
                console.error('can not find handler', reqBody);
                resp.end(JSON.stringify({ error: 'handler not found' }));
                return;
            }
            const scene = new Scene({
                ...this.options,
                operation: {
                    traceId: '',
                    traceOp: '',
                    baggage: {},
                    props: {},
                },
            });
            try {
                const handler = Reflect.get(serviceClass, service);
                const result = await this.runService(scene, handler, args);
                resp.end(JSON.stringify({ data: result }));
            } catch (e) {
                console.error(`failed to handle: ${reqBody}\n`, e);
                resp.end(JSON.stringify({ error: new String(e) }));
            }
        });
    }

    private async runService(scene: Scene, handler: Function, args: any[]) {
        if (this.options.middleware) {
            return await this.options.middleware(scene, handler, args);
        }
        return await handler.call(undefined, scene, args);
    }
}
