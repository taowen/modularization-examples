import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";

// 提供对各种 ActiveRecord 的增删改查，适配各种类型的关系数据库
// 代表了当前所处理的 request context
export interface Scene {
  insert<T extends ActiveRecord>(
    activeRecordClass: ActiveRecordClass<T>,
    props: ConstructorType<T>
  ): Promise<T>;
  // 只支持 = 和 AND
  query<T extends ActiveRecord>(
    activeRecordClass: ActiveRecordClass<T>,
    props: Partial<T>
  ): Promise<T[]>;
  query<T extends ActiveRecord, P>(
    sqlView: (scene: Scene, sqlVars: P) => Promise<T[]>,
    sqlVars: P
  ): Promise<T[]>;
  query<T extends ActiveRecord>(
    sqlView: (scene: Scene, sqlVars: {}) => Promise<T[]>
  ): Promise<T[]>;
  update<T extends ActiveRecord>(activeRecord: T): Promise<void>;
  delete<T extends ActiveRecord>(activeRecord: T): Promise<void>;
  // 执行任意 SQL
  executeSql(sql: string, sqlVars: Record<string, any>): Promise<any[]>;
}
