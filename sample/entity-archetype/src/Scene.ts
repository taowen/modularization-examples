import type { ActiveRecord, ActiveRecordClass } from "./ActiveRecord";
import type { ConstructorType } from "./ConstructorType";

// 提供对各种 ActiveRecord 的增删改查，适配各种类型的关系数据库
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
  update<T extends ActiveRecord>(
    activeRecord: T,
    props: Partial<T>
  ): Promise<void>;
  delete<T extends ActiveRecord>(activeRecord: T): Promise<void>;
  // 执行任意 SQL
  executeSql(sql: string, sqlVars: Record<string, any>): Promise<any[]>;
}
