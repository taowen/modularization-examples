import { uuid } from '../uuid';
import { Operation, Scene, ServiceProtocol } from '../Scene';

// 通过 serverless 内部协议进行互相调用
export class ServerlessClient implements ServiceProtocol {
    constructor(private readonly options: { functions: Record<string, Function> }) {}
    public async callService(scene: Scene, project: string, service: string, args: any[]) {
        const func = this.options.functions[service];
        if (!func) {
            throw new Error(`service ${service} not defined`);
        }
        const newOperation: Operation = {
            ...scene.operation,
            parentSpanId: scene.operation.spanId,
            spanId: uuid(),
        };
        const { data, subscribed, changed } = await func.call(undefined, newOperation, ...args);
        for (const atom of subscribed) {
            scene.subscribe(atom);
        }
        for (const atom of changed) {
            scene.notifyChange(atom);
        }
        return data;
    }
}
