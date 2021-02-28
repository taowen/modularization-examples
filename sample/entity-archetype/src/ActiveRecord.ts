import type { ConstructorType } from "./ConstructorType";
import type { Scene } from "./Scene";

// 数据库表
export class ActiveRecord {
  constructor(public readonly scene: Scene) {}
  public beforeInsert?: () => Promise<void>;
  public beforeDelete?: () => Promise<void>;

  public static toInsert<T extends ActiveRecord>(
    activeRecordClass: ActiveRecordClass<T>
  ) {
    return (scene: Scene, props: ConstructorType<T>) => {
      return scene.insert(activeRecordClass, props);
    };
  }

  public static toQuery<T extends ActiveRecord>(
    activeRecordClass: ActiveRecordClass<T>
  ) {
    return (scene: Scene, props: Partial<T>) => {
      return scene.query(activeRecordClass, props);
    };
  }

  public static toGet<T extends (ActiveRecord & { id: any })>(
    activeRecordClass: ActiveRecordClass<T>
  ) {
    return async (scene: Scene, id: T['id']) => {
      return (await scene.query(activeRecordClass, { id } as any))[0];
    };
  }
}

export type ActiveRecordClass<T extends ActiveRecord = any> = {
  new (scene: Scene): T;
};
