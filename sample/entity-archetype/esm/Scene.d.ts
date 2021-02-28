import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";
export interface Scene {
    insert<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>, props: ConstructorType<T>): Promise<T>;
    query<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>, props: Partial<T>): Promise<T[]>;
    query<T extends ActiveRecord, P>(sqlView: (scene: Scene, sqlVars: P) => Promise<T[]>, sqlVars: P): Promise<T[]>;
    query<T extends ActiveRecord>(sqlView: (scene: Scene, sqlVars: {}) => Promise<T[]>): Promise<T[]>;
    update<T extends ActiveRecord>(activeRecord: T): Promise<void>;
    delete<T extends ActiveRecord>(activeRecord: T): Promise<void>;
    executeSql(sql: string, sqlVars: Record<string, any>): Promise<any[]>;
}
