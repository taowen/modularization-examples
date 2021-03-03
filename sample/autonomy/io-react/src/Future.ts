import { Operation, Scene } from '@autonomy/io';
import { runInOperation } from './Operation';
import { Widget } from './Widget';

// 对表的订阅关系是全局变量，整个浏览器只有一份
let tables: Map<string, Table> | undefined;

// Future 是一个 async 计算流程，通过 scene 访问 I/O，从而对所访问的 table 进行订阅
export class Future<T = any> {
    private subscriptions = new Set<Table>();
    private loading?: Promise<any>;
    private cache: any;

    constructor(
        private readonly compute: (scene: Scene) => Promise<T>,
        private readonly widget?: Widget,
    ) {}

    public async get(scene: Scene): Promise<T> {
        if (this.cache) {
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
            for (const subscription of this.subscriptions) {
                subscriber.subscribe(subscription.name);
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

    public subscribe(tableName: string) {
        if (!tables) {
            return;
        }
        let table = tables.get(tableName);
        if (!table) {
            tables.set(tableName, (table = new Table(tableName)));
        }
        this.subscriptions.add(table);
        table.subscribers.add(this);
    }

    public dispose() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe(this);
        }
        this.subscriptions.clear();
        this.cache = undefined;
        this.loading = undefined;
    }
}

// 浏览器进入时设置一次
// @internal
export function enableDependencyTracking() {
    tables = new Map();
}

// 对每个写操作的 scene 都打开改动通知
// @internal
export function enableChangeNotification(scene: Scene) {
    scene.operation.onError = (e) => {
        Widget.onUnhanledCallbackError(scene, e);
    };
    scene.notifyChange = (tableName) => {
        const table = tables && tables.get(tableName);
        if (table) {
            table.notifyChange(scene.operation);
        }
    };
    return scene;
}

// 读操作应该是只读的
// @internal
export function ensureReadonly(scene: Scene) {
    scene.notifyChange = (tableName) => {
        throw new Error(`detected readonly scene ${scene} changed ${tableName}`);
    };
    return scene;
}

class Table {
    public readonly subscribers = new Set<Future>();
    constructor(public readonly name: string) {}

    public notifyChange(op: Operation) {
        const subscribers = [...this.subscribers];
        this.subscribers.clear();
        for (const subscriber of subscribers) {
            subscriber.notifyChange(op);
        }
    }

    public unsubscribe(subscriber: Future) {
        this.subscribers.delete(subscriber);
    }
}
