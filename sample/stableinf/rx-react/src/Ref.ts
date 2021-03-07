import { Scene, SimpleAtom } from '@stableinf/io';

// 和 vue3 的 Ref 类似，是响应式的单个值
// @internal
export class Ref<T = any> extends SimpleAtom {
    constructor(private value: T) {
        super();
    }

    public set(scene: Scene, newVal: T) {
        this.value = newVal;
        scene.notifyChange(this);
    }
    public get(scene: Scene) {
        scene.subscribe(this);
        return this.value;
    }
}
