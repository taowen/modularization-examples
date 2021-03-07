import { Atom, Operation, Scene, SceneConf } from '../Scene';

// apiGateway => handleBatchCall => handleCall => services
export async function handleCall(
    options: { sceneConf: SceneConf },
    handler: Function,
    operation: Operation,
    ...args: any[]
) {
    if (!handler) {
        throw new Error('handler not bind');
    }
    const scene = new Scene({ ...options.sceneConf, operation });
    const subscribed: Atom[] = [];
    const changed: Atom[] = [];
    scene.notifyChange = (atom) => {
        if (!changed.includes(atom)) {
            changed.push(atom);
        }
    };
    scene.subscribers.add({
        subscribe(atom) {
            if (!subscribed.includes(atom)) {
                subscribed.push(atom);
            }
        },
    });
    const data = await handler.call(undefined, scene, ...args);
    return { data: data, subscribed, changed };
}
