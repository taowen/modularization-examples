import { call, Command } from "./Command";
import type { ConstructorType } from "./ConstructorType";
import type { MethodsOf } from "./MethodsOf";
import type { Scene } from "./Scene";

// 数据库表
export class ActiveRecord {
  constructor(public readonly scene: Scene) {}
  public beforeInsert?: () => Promise<void>;
  public beforeDelete?: () => Promise<void>;

  public static getTableName<T extends ActiveRecord>(
    activeRecordClass: ActiveRecordClass<T>
  ): string {
    return activeRecordClass.tableName || activeRecordClass.name;
  }

  protected async update() {
    await this.scene.update(this);
  }

  protected call<C extends Command>(
    commandClass: new (scene: Scene, props: Record<string, any>) => C,
    props: {} extends ConstructorType<C> ? void : ConstructorType<C>
  ): ReturnType<C["run"]> {
    return call(this.scene, commandClass, props);
  }
}

export type ActiveRecordClass<T extends ActiveRecord = any> = {
  new (scene: Scene): T;
  tableName?: string;
};

export function toInsert<T extends ActiveRecord>(
  activeRecordClass: ActiveRecordClass<T>
) {
  return (scene: Scene, props: ConstructorType<T>) => {
    return scene.insert(activeRecordClass, props);
  };
}

export function toQuery<T extends ActiveRecord>(
  activeRecordClass: ActiveRecordClass<T>
) {
  return (scene: Scene, props: Partial<T>) => {
    return scene.query(activeRecordClass, props);
  };
}

export function toGet<T extends ActiveRecord & { id: any }>(
  activeRecordClass: ActiveRecordClass<T>
) {
  return async (scene: Scene, id: T["id"]) => {
    return (await scene.query(activeRecordClass, { id } as any))[0];
  };
}

export function toRunMethod<
  T extends ActiveRecord & { id: any },
  M extends MethodsOf<T>
>(activeRecordClass: ActiveRecordClass<T>, method: M) {
  return async (scene: Scene, id: T["id"], ...args: Parameters<T[M]>) => {
    const entity = (await scene.query(activeRecordClass, { id } as any))[0];
    return await Reflect.get(entity, method)(...args);
  };
}

export function subsetOf<T extends ActiveRecord>(
  activeRecordClass: ActiveRecordClass<T>
) {
  return <P = void>(sqlWhere: TemplateStringsArray, ...args: any[]) => {
    return (scene: Scene, sqlVars: P): Promise<T[]> => {
      return scene.executeSql(
        `SELECT * FROM ${ActiveRecord.getTableName(activeRecordClass)} WHERE ${
          sqlWhere[0]
        }`,
        sqlVars as any
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
      merged.push(ActiveRecord.getTableName(activeRecordClass));
    }
  }
  const sql = merged.join("");
  return (scene: Scene, sqlVars: P): Promise<T[]> => {
    return scene.executeSql(sql, sqlVars as any);
  };
}
