import { Scene } from "@autonomy/entity-archetype";
import { Widget } from "./Widget";

let tables: Map<string, Table> | undefined;

export class Future<T = any> {
  private subscriptions = new Set<Table>();
  private loading?: Promise<any>;
  private cache: any;

  constructor(
    private readonly compute: (scene: Scene) => Promise<T>,
    private readonly widget?: Widget
  ) {}

  public async get(scene: Scene) {
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

  public copySubscriptions(scene: Scene) {
    for (const subscriber of scene.subscribers) {
      for (const subscription of this.subscriptions) {
        subscriber.subscribe(subscription.name);
      }
    }
  }

  public async awaitLoading(existingPromise: Promise<any>) {
    const result = await existingPromise;
    if (this.loading === existingPromise) {
      this.cache = result;
    } else {
      this.dispose();
    }
    return result;
  }

  // 标记 widget 需要重新渲染，下次渲染的时候会重新读取 get
  public notifyChange() {
    this.subscriptions.clear();
    this.cache = undefined;
    if (this.widget) {
      this.widget.notifyChange();
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
export function enableDependencyTracking() {
  tables = new Map();
}

// 对每个写操作的 scene 都打开改动通知
export function enableChangeNotification(scene: Scene) {
  scene.notifyChange = (tableName) => {
    const table = tables && tables.get(tableName);
    if (table) {
      table.notifyChange();
    }
  };
}

class Table {
  public readonly subscribers = new Set<Future>();
  constructor(public readonly name: string) {}

  public notifyChange() {
    const subscribers = [...this.subscribers];
    this.subscribers.clear();
    for (const subscriber of subscribers) {
      subscriber.notifyChange();
    }
  }

  public unsubscribe(subscriber: Future) {
    this.subscribers.delete(subscriber);
  }
}
