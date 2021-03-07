import { Atom, AtomSubscriber, Operation, Scene } from '@stableinf/io';

// 和 vue3 的 Ref 类似，是响应式的单个值
export class Ref<T = any> implements Atom {
    private readonly subscribers = new Set<AtomSubscriber>();
    constructor(private value: T) {}

    public set(scene: Scene, newVal: T) {
        this.value = newVal;
        scene.notifyChange(this);
    }
    public get(scene: Scene) {
        scene.subscribe(this);
        return this.value;
    }
    public addSubscriber(subscriber: AtomSubscriber) {
        this.subscribers.add(subscriber);
    }
    public deleteSubscriber(subscriber: AtomSubscriber) {
        this.subscribers.delete(subscriber);
    }
    public notifyChange(operation: Operation) {
        for (const subscriber of this.subscribers) {
            subscriber.notifyChange(operation);
        }
    }
}
