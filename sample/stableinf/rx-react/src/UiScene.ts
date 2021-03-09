import { Scene, Database, ServiceProtocol, newOperation, Operation } from "@stableinf/io";

export class UiScene {
    // onUnhandledCallbackError, database, serviceProtocol 是整个浏览器级别的配置
    // 可以覆盖这个回调来实现全局写操作的异常处理，读操作的异常用 ErrorBoundary 去抓
    public static onUnhandledCallbackError = (scene: Scene, e: any) => {
        console.error(`unhandled callback error: ${scene}`, e);
    };
    public static database: Database;
    public static serviceProtocol: ServiceProtocol;
    public static createRW(op: string | Operation) {
        return enableChangeNotification(this.create(op));
    }
    public static createRO(op: string | Operation) {
        return ensureReadonly(this.create(op));
    }
    private static create(op: string | Operation) {
        return new Scene({
            database: UiScene.database,
            serviceProtocol: UiScene.serviceProtocol,
            operation: typeof op === 'string' ? newOperation(op) : op,
        });
    }
}

// 对每个写操作的 scene 都打开改动通知
function enableChangeNotification(scene: Scene) {
    scene.operation.onError = (e) => {
        UiScene.onUnhandledCallbackError(scene, e);
    };
    scene.notifyChange = (atom) => {
        atom.notifyChange(scene.operation);
    };
    return scene;
}

// 读操作应该是只读的
function ensureReadonly(scene: Scene) {
    scene.notifyChange = (tableName) => {
        throw new Error(`detected readonly scene ${scene} changed ${tableName}`);
    };
    return scene;
}