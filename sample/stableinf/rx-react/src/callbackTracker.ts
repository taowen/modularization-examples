import { Scene } from '@stableinf/io';
import { Ref } from './reactive';
import { Widget } from './Widget';

export function callbackTracker(widget: Widget): { value: boolean, track: <T>(cb: T) => T} {
    const isExecuting = new Ref(false);
    const track = <T extends Function>(cb: T): T => {
        return (async function (this: any, scene: Scene, ...args: any[]) {
            isExecuting.set(true, scene);
            await scene.sleep(0);
            try {
               return await cb.call(this, scene, ...args);
            } finally {
                isExecuting.set(false, scene);
            }
        }) as any;
    };
    const future = widget.subscribe(async (scene) => {
        return { value: isExecuting.get(scene), track };
    }) as any;
    future.track = track;
    return future;
}