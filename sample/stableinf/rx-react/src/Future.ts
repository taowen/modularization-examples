import type { Atom, Operation, Scene } from '@stableinf/io';
import type { Widget } from './Widget';

// Future 是一个 async 计算流程，通过 scene 访问 I/O，从而对所访问的 table 进行订阅
export class Future<T = any> {
    private subscriptions = new Set<Atom>();
    private loading?: Promise<any>;
    private cache: any;

    constructor(
        private readonly compute: (scene: Scene) => Promise<T>,
        private readonly widget?: Widget,
    ) {}

    public async get(scene: Scene): Promise<T> {
        if (this.cache !== undefined) {
            this.copySubscriptions(scene);
            return this.cache;
        }
        if (this.loading) {
            const result = await this.awaitLoading(this.loading);
            this.copySubscriptions(scene);
            return result;
        }
        scene.subscribers.add(this);
        this.loading = this.compute(scene);
        try {
            return await this.awaitLoading(this.loading);
        } finally {
            this.loading = undefined;
            scene.subscribers.delete(this);
        }
    }

    private copySubscriptions(scene: Scene) {
        for (const subscriber of scene.subscribers) {
            for (const atom of this.subscriptions) {
                subscriber.subscribe(atom);
            }
        }
    }

    private async awaitLoading(existingPromise: Promise<any>) {
        const result = await existingPromise;
        if (this.loading === existingPromise) {
            this.cache = result;
        } else {
            this.dispose();
        }
        return result;
    }

    // 数据变化了，需要重新计算
    public notifyChange(op: Operation) {
        this.subscriptions.clear();
        this.cache = undefined;
        if (this.widget) {
            this.widget.notifyChange(op);
        }
    }

    public subscribe(atom: Atom) {
        this.subscriptions.add(atom);
        atom.addSubscriber(this);
    }

    public dispose() {
        for (const subscription of this.subscriptions) {
            subscription.deleteSubscriber(this);
        }
        this.subscriptions.clear();
        this.cache = undefined;
        this.loading = undefined;
    }
}
