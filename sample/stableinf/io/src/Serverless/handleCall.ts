import { Operation, Scene, SceneConf } from '../Scene';

// apiGateway => handleBatchCall => handleCall => services
export function handleCall(
    sceneConf: SceneConf,
    handler: Function,
    operation: Operation,
    ...args: any[]
) {
    const scene = new Scene({ ...sceneConf, operation });
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
