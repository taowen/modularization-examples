import { Operation, Scene, SceneConf } from '../Scene';

// apiGateway => handleBatchCall => handleCall => services
export function handleCall(
    options: { sceneConf: SceneConf },
    handler: Function,
    operation: Operation,
    ...args: any[]
) {
    if (!handler) {
        throw new Error('handler not bind');
    }
    const scene = new Scene({ ...options.sceneConf, operation });
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
    const data = handler.call(undefined, scene, ...args);
    return { data: data, subscribed, changed };
}
