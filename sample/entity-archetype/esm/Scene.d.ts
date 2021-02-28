import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";
export interface Scene {
    insert<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>, props: ConstructorType<T>): Promise<T>;
    query<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>, props: Partial<T>): Promise<T[]>;
    update<T extends ActiveRecord>(activeRecord: T, props: Partial<T>): Promise<void>;
    delete<T extends ActiveRecord>(activeRecord: T): Promise<void>;
    executeSql(sql: string, sqlVars: Record<string, any>): Promise<any[]>;
}
