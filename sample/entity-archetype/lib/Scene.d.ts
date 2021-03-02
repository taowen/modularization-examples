import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";
import type { MethodsOf } from "./MethodsOf";
import type { GatewayClass } from "./Gateway";
declare type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
export interface Database {
    insert<T extends ActiveRecord>(scene: Scene, activeRecordClass: ActiveRecordClass<T>, props: ConstructorType<T>): Promise<T>;
    update<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
    delete<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
    queryByExample<T extends ActiveRecord>(scene: Scene, activeRecordClass: ActiveRecordClass<T>, props: Partial<T>): Promise<T[]>;
    executeSql(scene: Scene, sql: string, sqlVars: Record<string, any>, optoins?: {
        read?: ActiveRecordClass[];
        write?: ActiveRecordClass[];
    }): Promise<any[]>;
}
export interface ServiceProtocol {
    useServices(scene: Scene, project?: string): any;
}
export interface Operation {
    traceId: string;
    traceOp: string;
    baggage: Record<string, any>;
    props: Record<string, any>;
}
export declare class Scene {
    notifyChange: (tableName: string) => void;
    readonly operation: Operation;
    readonly database: Database;
    readonly serviceProtocol: ServiceProtocol;
    readonly subscribers: Set<{
        subscribe(tableName: string): void;
    }>;
    constructor(options: {
        database: Database;
        serviceProtocol: ServiceProtocol;
        operation: Partial<Operation>;
    });
    useServices<T extends GatewayClass | ActiveRecordClass>(project?: string): {
        [P in MethodsOf<T>]: (...a: Parameters<OmitFirstArg<T[P]>>) => ReturnType<T[P]>;
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
export {};
