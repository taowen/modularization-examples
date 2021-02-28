import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";
import type { MethodsOf } from "./MethodsOf";
import type { Gateway } from "./Gateway";
declare type Await<T> = T extends Promise<infer U> ? U : T;
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export interface Database {
    insert<T extends ActiveRecord>(scene: Scene, activeRecordClass: ActiveRecordClass<T>, props: ConstructorType<T>): Promise<T>;
    update<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
    delete<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
    queryByExample<T extends ActiveRecord>(scene: Scene, activeRecordClass: ActiveRecordClass<T>, props: Partial<T>): Promise<T[]>;
    executeSql(scene: Scene, sql: string, sqlVars: Record<string, any>): Promise<any[]>;
}
export interface RemoteService {
    useGateway(scene: Scene, project?: string): any;
}
export interface Operation {
    traceId: string;
    traceOp: string;
    baggage: Record<string, any>;
    props: Record<string, any>;
}
export declare class Scene {
    readonly operation: Operation;
    readonly database: Database;
    readonly remoteService: RemoteService;
    constructor(options: {
        database: Database;
        remoteService: RemoteService;
        operation: Partial<Operation>;
    });
    useSync<T extends Gateway>(project?: string): {
        [P in MethodsOf<T>]: (...a: Parameters<OmitFirstArg<T[P]>>) => Await<ReturnType<T[P]>>;
    };
    insert: OmitFirstArg<Database["insert"]>;
    update: OmitFirstArg<Database["update"]>;
    delete: OmitFirstArg<Database["delete"]>;
    executeSql: OmitFirstArg<Database["executeSql"]>;
    query<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>, props: Partial<T>): Promise<T[]>;
    query<T extends ActiveRecord, P>(sqlView: (scene: Scene, sqlVars: P) => Promise<T[]>, sqlVars: P): Promise<T[]>;
    query<T extends ActiveRecord>(sqlView: (scene: Scene, sqlVars: {}) => Promise<T[]>): Promise<T[]>;
    toJSON(): undefined;
}
export declare const DUMMY_DATABASE: Database;
export {};
