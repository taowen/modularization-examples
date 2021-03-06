import { Scene } from '@stableinf/io';
import { Widget } from './Widget';

export function callbackTracker(widget: Widget): { value: boolean, track: <T>(cb: T) => T} {
    const callbackId = `cb-${nextCallbackId()}`;
    let isExecuting = false;
    const track = <T extends Function>(cb: T): T => {
        return (async function (this: any, scene: Scene, ...args: any[]) {
            isExecuting = true;
            scene.notifyChange(callbackId);
            await scene.sleep(0);
            try {
               return await cb.call(this, scene, ...args);
            } finally {
                isExecuting = false;
                scene.notifyChange(callbackId);
            }
        }) as any;
    };
    const future = widget.subscribe(async (scene) => {
        scene.subscribe(callbackId);
        return { value: isExecuting, track };
    }) as any;
    future.track = track;
    return future;
}

let counter = 1;
function nextCallbackId() {
    return counter++;
}
