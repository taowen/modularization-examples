import { Operation, Scene } from '@autonomy/entity-archetype';
import { Widget } from './Widget';
export declare class Future<T = any> {
    private readonly compute;
    private readonly widget?;
    private subscriptions;
    private loading?;
    private cache;
    constructor(compute: (scene: Scene) => Promise<T>, widget?: Widget | undefined);
    get(scene: Scene): Promise<any>;
    copySubscriptions(scene: Scene): void;
    awaitLoading(existingPromise: Promise<any>): Promise<any>;
    notifyChange(op: Operation): void;
    subscribe(tableName: string): void;
    dispose(): void;
}
export declare function enableDependencyTracking(): void;
export declare function enableChangeNotification(scene: Scene): Scene;
