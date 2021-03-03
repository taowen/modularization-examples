"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpXServer = void 0;
const Scene_1 = require("../Scene");
class HttpXServer {
    constructor(options) {
        this.options = options;
    }
    handleRequest(req, resp) {
        let reqBody = '';
        req.on('data', (chunk) => {
            reqBody += chunk;
        });
        req.on('end', async () => {
            const jobs = JSON.parse(reqBody) || [];
            const promises = jobs.map(job => this.execute(job));
            const results = [];
            for (const promise of promises) {
                results.push(await promise);
            }
            resp.end(JSON.stringify(results));
        });
    }
    async execute(job) {
        const { service, args } = job;
        const serviceClass = this.options.services.get(service);
        if (!serviceClass) {
            console.error('can not find handler', job.service);
            return { error: 'handler not found' };
        }
        const subscribed = [];
        const changed = [];
        const scene = this.createScene();
        scene.notifyChange = (table) => {
            if (!changed.includes(table)) {
                changed.push(table);
            }
        };
        scene.subscribers.add({ subscribe(table) {
                if (!subscribed.includes(table)) {
                    subscribed.push(table);
                }
            } });
        try {
            const handler = Reflect.get(serviceClass, service);
            const result = await this.runService(scene, handler, args);
            return { data: result, subscribed, changed };
        }
        catch (e) {
            console.error(`failed to handle: ${JSON.stringify(job)}\n`, e);
            return { error: new String(e) };
        }
    }
    createScene() {
        return new Scene_1.Scene({
            ...this.options,
            operation: {
                traceId: '',
                traceOp: '',
                baggage: {},
                props: {},
            },
        });
    }
    async runService(scene, handler, args) {
        if (this.options.middleware) {
            return await this.options.middleware(scene, handler, args);
        }
        return await handler.call(undefined, scene, ...args);
    }
}
exports.HttpXServer = HttpXServer;
//# sourceMappingURL=HttpXServer.js.map