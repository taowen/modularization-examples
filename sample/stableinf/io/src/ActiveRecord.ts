import { call, Command } from './Command';
import type { ConstructorType } from './ConstructorType';
import type { MethodsOf } from './MethodsOf';
import { AtomSubscriber, Operation, Scene, Table } from './Scene';

// 数据库表
export class ActiveRecord {
    public static IS_ACTIVE_RECORD = true as true;
    public static tableName: string;

    constructor(public readonly scene: Scene) {}

    protected update: (scene: Scene) => Promise<void>;
    protected delete: (scene: Scene) => Promise<void>;

    protected call<C extends Command>(
        commandClass: new (scene: Scene, props: Record<string, any>) => C,
        props: {} extends ConstructorType<C> ? void : ConstructorType<C>,
    ): ReturnType<C['run']> {
        return call(this.scene, commandClass, props);
    }

    public get class() {
        return this.constructor as typeof ActiveRecord;
    }

    public static addSubscriber(subscriber: AtomSubscriber) {
        this.subscribers().add(subscriber);
    }
    public static deleteSubscriber(subscriber: AtomSubscriber) {
        this.subscribers().delete(subscriber);
    }
    public static notifyChange(operation: Operation) {
        const subscribers = (this as any)['_subscribers'];
        if (subscribers) {
            for (const subscriber of subscribers) {
                subscriber.notifyChange(operation);
            }
        }
    }

    private static subscribers(): Set<AtomSubscriber> {
        let subscribers = (this as any)['_subscribers'];
        if (!subscribers) {
            (this as any)['_subscribers'] = subscribers = new Set();
        }
        return subscribers;
    }
}

export type ActiveRecordClass<T extends ActiveRecord = any> = Table<T>;

export function toInsert<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>) {
    return (scene: Scene, props: Partial<T>) => {
        return scene.insert(activeRecordClass, props);
    };
}

export function toQuery<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>) {
    return (scene: Scene, props?: Partial<T>) => {
        return scene.query(activeRecordClass, props || {});
    };
}

export function toLoad<T extends ActiveRecord & { id: any }>(
    activeRecordClass: ActiveRecordClass<T>,
) {
    return async (scene: Scene, props: Partial<T>) => {
        return await scene.load(activeRecordClass, props);
    };
}

export function toGet<T extends ActiveRecord & { id: any }>(
    activeRecordClass: ActiveRecordClass<T>,
) {
    return async (scene: Scene, id: T['id']) => {
        return await scene.get(activeRecordClass, id);
    };
}

export function toRunMethod<T extends ActiveRecord & { id: any }, M extends MethodsOf<T>>(
    activeRecordClass: ActiveRecordClass<T>,
    method: M,
) {
    return async (scene: Scene, id: T['id'], ...args: Parameters<T[M]>) => {
        const entity = (await scene.query(activeRecordClass, { id } as any))[0];
        return await Reflect.get(entity, method).apply(entity, args);
    };
}

export function subsetOf<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>) {
    return <P = void>(sqlWhere: TemplateStringsArray, ...args: any[]) => {
        return (scene: Scene, sqlVars: P): Promise<T[]> => {
            return scene.executeSql(
                `SELECT * FROM ${activeRecordClass.tableName} WHERE ${sqlWhere[0]}`,
                sqlVars as any,
            );
        };
    };
}

export function sqlView<T, P = void>(
    sqlFragments: TemplateStringsArray,
    ...activeRecordClasses: ActiveRecordClass[]
) {
    const merged = [];
    for (const [i, sqlFragment] of sqlFragments.entries()) {
        merged.push(sqlFragment);
        const activeRecordClass = activeRecordClasses[i];
        if (activeRecordClass) {
            merged.push(activeRecordClass.tableName);
        }
    }
    const sql = merged.join('');
    return (scene: Scene, sqlVars: P): Promise<T[]> => {
        return scene.executeSql(sql, sqlVars as any);
    };
}
