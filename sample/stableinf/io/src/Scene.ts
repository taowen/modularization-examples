import { ActiveRecord, ActiveRecordClass } from './ActiveRecord';
import type { MethodsOf } from './MethodsOf';
import type { GatewayClass } from './Gateway';
import { uuid } from './uuid';

// trace -> operation -> scene
// 一个 trace 会有多个进程被多次执行，每次执行是一个 operation（或者叫span）
// 一个 operation 会包含一个或者多个 scene
// 浏览器进入首次渲染，是一个 operation
// 每次鼠标点击，触发重渲染，也是一个 operation。此时因为可能触发多处重渲染，所以会触发多个 scene
// 后端 handle 一个 http 请求也是一个 operation（但是和前端的 operation 共享 trace 信息）
export interface Operation {
    // traceId, traceOp, baggage 会 RPC 透传
    traceId: string;
    parentSpanId?: string;
    spanId: string;
    traceOp: string;
    baggage: Record<string, any>;
    // 以下字段仅在进程内，不会 RPC 透传
    props: Record<string, any>;
    onError?: (e: any) => void;
    onSceneExecuting?: (scene: Scene) => Promise<any>;
}

export function newOperation(traceOp: string): Operation {
    // 分布式追踪的 traceId 是在前端浏览器这里分配的，一直会往后传递
    return {
        traceId: uuid(),
        spanId: uuid(),
        traceOp,
        baggage: {},
        props: {},
    };
}

export interface AtomSubscriber {
    notifyChange(operation: Operation): void;
}

export interface Atom {
    tableName?: string;
    addSubscriber(subscriber: AtomSubscriber): void;
    deleteSubscriber(subscriber: AtomSubscriber): void;
    notifyChange(operation: Operation): void;
}

export class SimpleAtom {
    private readonly subscribers = new Set<AtomSubscriber>();

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

export interface Table<T = any> extends Atom {
    new (...args: any[]): T;
    tableName: string;
}

// 提供对各种 ActiveRecord 的增删改查，适配各种类型的关系数据库
export interface Database {
    insert(scene: Scene, table: Table, props: Record<string, any>): Promise<ActiveRecord>;
    // 只支持 = 和 AND
    query<T extends ActiveRecord>(scene: Scene, table: Table, props: Partial<T>): Promise<T[]>;
    // 执行任意 SQL
    executeSql(scene: Scene, sql: string, sqlVars: Record<string, any>): Promise<any[]>;
}

// 提供远程方法调用
export interface ServiceProtocol {
    callService(scene: Scene, project: string, service: string, args: any[]): Promise<any>;
}

export interface SceneConf {
    serviceProtocol: ServiceProtocol;
    database: Database;
}

const STATUS_INIT = 0;
const STATUS_EXECUTING = 1;
const STATUS_FINISHED = 2;

// 同时每个异步执行流程会创建一个独立的 scene，用来跟踪异步操作与I/O的订阅关系
// 后端 handle 一个 http 请求，后端不开启订阅
// 前端计算每个 future 的值（读操作），捕捉订阅关系
// 前端处理一次鼠标点击（写操作），触发订阅者
export class Scene {
    public static currentProject = '';
    public notifyChange = (atom: Atom) => {};
    // operation 在 scene 的整个声明周期内是不变的
    public readonly operation: Operation;
    public readonly database: Database;
    public readonly serviceProtocol: ServiceProtocol;
    public readonly subscribers = new Set<{
        subscribe(atom: Atom): void;
    }>();
    private status: 0 | 1 | 2 = STATUS_INIT;
    public executing?: Promise<any>;

    constructor(options: {
        database: Database;
        serviceProtocol: ServiceProtocol;
        operation: Operation;
    }) {
        Object.assign(this, options);
    }

    public execute<T extends (...args: any[]) => any>(
        theThis: any,
        task: T,
        ...args: Parameters<OmitFirstArg<T>>
    ): ReturnType<T> {
        this.executing = (async () => {
            this.status = STATUS_EXECUTING;
            try {
                return await task.call(theThis, this, ...args);
            } finally {
                this.executing = undefined;
                this.status = STATUS_FINISHED;
            }
        })();
        if (this.operation.onSceneExecuting) {
            this.operation.onSceneExecuting(this);
        }
        return this.executing as any;
    }

    private assertExecuting() {
        if (this.status === STATUS_EXECUTING) {
            return;
        }
        if (this.status === STATUS_INIT) {
            throw new Error('should call scene.execute to enter executing status');
        } else if (this.status === STATUS_FINISHED) {
            throw new Error('scene can not be reused, do not save it persistenly');
        } else {
            throw new Error('scene is not executing');
        }
    }

    public subscribe(atom: Atom) {
        this.assertExecuting();
        for (const subscriber of this.subscribers) {
            subscriber.subscribe(atom);
        }
    }

    public useServices<T extends GatewayClass | ActiveRecordClass>(
        project?: string,
    ): {
        [P in MethodsOf<T>]: (...a: Parameters<OmitFirstArg<T[P]>>) => ReturnType<T[P]>;
    } {
        this.assertExecuting();
        const scene = this;
        // proxy intercept property get, returns rpc stub
        const get = (target: object, propertyKey: string, receiver?: any) => {
            return (...args: any[]) => {
                return scene.serviceProtocol.callService(
                    scene,
                    project || Scene.currentProject,
                    propertyKey,
                    args,
                );
            };
        };
        return new Proxy({}, { get }) as any;
    }

    public insert<T>(table: Table<T>, props: Partial<T>): Promise<T> {
        this.assertExecuting();
        return this.database.insert(this, table, props) as any;
    }
    public executeSql(sql: string, sqlVars: Record<string, any>): Promise<any[]> {
        this.assertExecuting();
        return this.database.executeSql(this, sql, sqlVars);
    }
    public query<T>(table: Table<T>, props: Partial<T>): Promise<T[]>;
    public query<T, P>(
        sqlView: (scene: Scene, sqlVars: P) => Promise<T[]>,
        sqlVars: P,
    ): Promise<T[]>;
    public query<T>(sqlView: (scene: Scene, sqlVars: {}) => Promise<T[]>): Promise<T[]>;
    public query(arg1: any, arg2?: any) {
        this.assertExecuting();
        if (arg1.IS_ACTIVE_RECORD) {
            return this.database.query(this, arg1, arg2);
        }
        return arg1(this, arg2);
    }
    public async load<T>(table: Table<T>, props: Partial<T>): Promise<T> {
        this.assertExecuting();
        const records = await this.query(table, props);
        if (records.length === 0) {
            const msg = `${table.tableName} is empty, can not find ${JSON.stringify(props)}`;
            throw new Error(msg);
        }
        if (records.length !== 1) {
            const msg = `${table.tableName} find more than 1 match of ${JSON.stringify(props)}`;
            throw new Error(msg);
        }
        return records[0];
    }
    public async get<T>(table: Table<T>, id?: any): Promise<T> {
        this.assertExecuting();
        return await this.load(table, id ? { id } : ({} as any));
    }
    public async sleep(millis: number) {
        this.assertExecuting();
        return new Promise((resolve) => setTimeout(resolve, millis));
    }
    public toJSON() {
        return undefined;
    }
    get [Symbol.toStringTag]() {
        return `[OP]${this.operation.traceId} ${this.operation.traceOp}`;
    }
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
