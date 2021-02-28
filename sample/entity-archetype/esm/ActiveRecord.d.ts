import type { ConstructorType } from "./ConstructorType";
import type { Scene } from "./Scene";
export declare class ActiveRecord {
    readonly scene: Scene;
    constructor(scene: Scene);
    beforeInsert?: () => Promise<void>;
    beforeDelete?: () => Promise<void>;
    static toInsert<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, props: ConstructorType<T>) => Promise<T>;
    static toQuery<T extends ActiveRecord>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, props: Partial<T>) => Promise<T[]>;
    static toGet<T extends (ActiveRecord & {
        id: any;
    })>(activeRecordClass: ActiveRecordClass<T>): (scene: Scene, id: T['id']) => Promise<T>;
}
export declare type ActiveRecordClass<T extends ActiveRecord = any> = {
    new (scene: Scene): T;
};
