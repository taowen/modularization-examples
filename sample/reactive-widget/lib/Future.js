"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureReadonly = exports.enableChangeNotification = exports.enableDependencyTracking = exports.Future = void 0;
const Operation_1 = require("./Operation");
let tables;
// Future 是一个 async 计算流程，通过 scene 访问 I/O，从而对所访问的 table 进行订阅
class Future {
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
    // 数据变化了，需要重新计算
    notifyChange(op) {
        this.subscriptions.clear();
        this.cache = undefined;
        if (this.widget) {
            Operation_1.runInOperation(op, this.widget.notifyChange.bind(this));
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
exports.Future = Future;
// 浏览器进入时设置一次
// @internal
function enableDependencyTracking() {
    tables = new Map();
}
exports.enableDependencyTracking = enableDependencyTracking;
// 对每个写操作的 scene 都打开改动通知
// @internal
function enableChangeNotification(scene) {
    scene.notifyChange = (tableName) => {
        const table = tables && tables.get(tableName);
        if (table) {
            table.notifyChange(scene.operation);
        }
    };
    return scene;
}
exports.enableChangeNotification = enableChangeNotification;
// 读操作应该是只读的
// @internal
function ensureReadonly(scene) {
    scene.notifyChange = (tableName) => {
        throw new Error(`detected readonly scene ${scene} changed ${tableName}`);
    };
    return scene;
}
exports.ensureReadonly = ensureReadonly;
class Table {
    constructor(name) {
        this.name = name;
        this.subscribers = new Set();
    }
    notifyChange(op) {
        const subscribers = [...this.subscribers];
        this.subscribers.clear();
        for (const subscriber of subscribers) {
            subscriber.notifyChange(op);
        }
    }
    unsubscribe(subscriber) {
        this.subscribers.delete(subscriber);
    }
}
//# sourceMappingURL=Future.js.map