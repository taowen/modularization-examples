import { Command } from './Command';
import type { ConstructorType } from './ConstructorType';
import type { MethodsOf } from './MethodsOf';
import type { Scene } from './Scene';
export declare class ActiveRecord {
    readonly scene: Scene;
    static IS_ACTIVE_RECORD: true;
    constructor(scene: Scene);
    protected update(): Promise<void>;
    protected call<C extends Command>(commandClass: new (scene: Scene, props: Record<string, any>) => C, props: {} extends ConstructorType<C> ? void : ConstructorType<C>): ReturnType<C['run']>;
    get class(): ActiveRecordClass<this>;
}
export declare function getTableName<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>): string;
export declare type ActiveRecordClass<T extends ActiveRecord = any> = {
    new (scene: Scene): T;
    IS_ACTIVE_RECORD: true;
    tableName?: string;
};
export declare function toInsert<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, props: Partial<T>) => Promise<T>;
export declare function toQuery<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, props?: Partial<T> | undefined) => Promise<T[]>;
export declare function toLoad<T extends ActiveRecord & {
    id: any;
}>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, props: Partial<T>) => Promise<T>;
export declare function toGet<T extends ActiveRecord & {
    id: any;
}>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, id: T['id']) => Promise<T>;
export declare function toRunMethod<T extends ActiveRecord & {
    id: any;
}, M extends MethodsOf<T>>(activeRecordClass: ActiveRecordClass<T>, method: M): (scene: Scene, id: T['id'], ...args: Parameters<T[M]>) => Promise<any>;
export declare function subsetOf<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>): <P = void>(sqlWhere: TemplateStringsArray, ...args: any[]) => (scene: Scene, sqlVars: P) => Promise<T[]>;
export declare function sqlView<T, P = void>(sqlFragments: TemplateStringsArray, ...activeRecordClasses: ActiveRecordClass[]): (scene: Scene, sqlVars: P) => Promise<T[]>;
