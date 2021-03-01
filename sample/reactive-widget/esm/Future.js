let tables;
export class Future {
    constructor(compute, widget) {
        this.compute = compute;
        this.widget = widget;
        this.subscriptions = new Set();
    }
    async get(scene) {
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
        }
        finally {
            this.loading = undefined;
            scene.subscribers.delete(this);
        }
    }
    copySubscriptions(scene) {
        for (const subscriber of scene.subscribers) {
            for (const subscription of this.subscriptions) {
                subscriber.subscribe(subscription.name);
            }
        }
    }
    async awaitLoading(existingPromise) {
        const result = await existingPromise;
        if (this.loading === existingPromise) {
            this.cache = result;
        }
        else {
            this.dispose();
        }
        return result;
    }
    // 标记 widget 需要重新渲染，下次渲染的时候会重新读取 get
    notifyChange() {
        this.subscriptions.clear();
        this.cache = undefined;
        if (this.widget) {
            this.widget.notifyChange();
        }
    }
    subscribe(tableName) {
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
    dispose() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe(this);
        }
        this.subscriptions.clear();
        this.cache = undefined;
        this.loading = undefined;
    }
}
// 浏览器进入时设置一次
export function enableDependencyTracking() {
    tables = new Map();
}
// 对每个写操作的 scene 都打开改动通知
export function enableChangeNotification(scene) {
    scene.notifyChange = (tableName) => {
        const table = tables && tables.get(tableName);
        if (table) {
            table.notifyChange();
        }
    };
}
class Table {
    constructor(name) {
        this.name = name;
        this.subscribers = new Set();
    }
    notifyChange() {
        const subscribers = [...this.subscribers];
        this.subscribers.clear();
        for (const subscriber of subscribers) {
            subscriber.notifyChange();
        }
    }
    unsubscribe(subscriber) {
        this.subscribers.delete(subscriber);
    }
}
//# sourceMappingURL=Future.js.map