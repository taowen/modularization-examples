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
            const { service, args } = JSON.parse(reqBody) || {};
            const serviceClass = this.options.services.get(service);
            if (!serviceClass) {
                console.error('can not find handler', reqBody);
                resp.end(JSON.stringify({ error: 'handler not found' }));
                return;
            }
            const scene = new Scene_1.Scene({
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
            }
            catch (e) {
                console.error(`failed to handle: ${reqBody}\n`, e);
                resp.end(JSON.stringify({ error: new String(e) }));
            }
        });
    }
    async runService(scene, handler, args) {
        if (this.options.middleware) {
            return await this.options.middleware(scene, handler, args);
        }
        return await handler.call(undefined, scene, args);
    }
}
exports.HttpXServer = HttpXServer;
//# sourceMappingURL=HttpXServer.js.map