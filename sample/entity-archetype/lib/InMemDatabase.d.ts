import { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import { ConstructorType } from "./ConstructorType";
import { Database, Scene } from "./Scene";
export declare class InMemDatabase implements Database {
    private tables;
    insert<T extends ActiveRecord>(scene: Scene, activeRecordClass: ActiveRecordClass<T>, props: ConstructorType<T>): Promise<T>;
    update<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
    delete<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void>;
    queryByExample<T extends ActiveRecord>(scene: Scene, activeRecordClass: ActiveRecordClass<T>, criteria: Partial<T>): Promise<T[]>;
    executeSql(scene: Scene, sql: string, sqlVars: Record<string, any>): Promise<any[]>;
    private getTable;
}
