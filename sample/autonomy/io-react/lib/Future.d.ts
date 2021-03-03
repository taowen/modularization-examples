import { Operation, Scene } from '@autonomy/io';
import { Widget } from './Widget';
export declare class Future<T = any> {
    private readonly compute;
    private readonly widget?;
    private subscriptions;
    private loading?;
    private cache;
    constructor(compute: (scene: Scene) => Promise<T>, widget?: Widget | undefined);
    get(scene: Scene): Promise<T>;
    private copySubscriptions;
    private awaitLoading;
    notifyChange(op: Operation): void;
    subscribe(tableName: string): void;
    dispose(): void;
}
export declare function enableDependencyTracking(): void;
export declare function enableChangeNotification(scene: Scene): Scene;
export declare function ensureReadonly(scene: Scene): Scene;
