"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
// 同时每个异步执行流程会创建一个独立的 scene，用来跟踪异步操作与I/O的订阅关系
// 后端 handle 一个 http 请求，后端不开启订阅
// 前端计算每个 future 的值（读操作），捕捉订阅关系
// 前端处理一次鼠标点击（写操作），触发订阅者
class Scene {
    constructor(options) {
        this.notifyChange = (tableName) => { };
        this.subscribers = new Set();
        this.insert = (activeRecordClass, props) => {
            return this.database.insert(this, activeRecordClass, props);
        };
        this.update = (activeRecord) => {
            return this.database.update(this, activeRecord);
        };
        this.delete = (activeRecord) => {
            return this.database.delete(this, activeRecord);
        };
        this.executeSql = (sql, sqlVars) => {
            return this.database.executeSql(this, sql, sqlVars);
        };
        this.database = options.database;
        this.remoteService = options.remoteService;
        this.operation = {
            traceId: "",
            traceOp: "",
            baggage: {},
            props: {},
            ...options.operation,
        };
    }
    useGateway(project) {
        return this.remoteService.useGateway(this, project);
    }
    query(arg1, arg2) {
        if (arg1.IS_ACTIVE_RECORD) {
            return this.database.queryByExample(this, arg1, arg2);
        }
        return arg1(this, arg2);
    }
    toJSON() {
        return undefined;
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map