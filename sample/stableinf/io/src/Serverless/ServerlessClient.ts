import { uuid } from '../uuid';
import { Operation, Scene, ServiceProtocol } from '../Scene';

// 通过 serverless 内部协议进行互相调用
export class ServerlessClient implements ServiceProtocol {
    constructor(private readonly functions: Record<string, Function>) {}
    public async call(scene: Scene, project: string, service: string, args: any[]) {
        const func = this.functions[service];
        if (!func) {
            throw new Error(`service ${service} not defined`);
        }
        const newOperation: Operation = {
            ...scene.operation,
            parentSpanId: scene.operation.spanId,
            spanId: uuid(),
        };
        const { data, subscribed, changed } = func.call(undefined, newOperation, ...args);
        for (const table of subscribed) {
            scene.subscribe(table);
        }
        for (const table of changed) {
            scene.notifyChange(table);
        }
        return data;
    }
}
