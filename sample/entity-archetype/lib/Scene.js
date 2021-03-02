"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = void 0;
const ActiveRecord_1 = require("./ActiveRecord");
// 同时每个异步执行流程会创建一个独立的 scene，用来跟踪异步操作与I/O的订阅关系
// 后端 handle 一个 http 请求，后端不开启订阅
// 前端计算每个 future 的值（读操作），捕捉订阅关系
// 前端处理一次鼠标点击（写操作），触发订阅者
class Scene {
    constructor(options) {
        this.notifyChange = (tableName) => { };
        this.subscribers = new Set();
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
        this.serviceProtocol = options.serviceProtocol;
        this.operation = {
            traceId: '',
            traceOp: '',
            baggage: {},
            props: {},
            ...options.operation,
        };
    }
    useServices(project) {
        return this.serviceProtocol.useServices(this, project);
    }
    insert(activeRecordClass, props) {
        return this.database.insert(this, activeRecordClass, props);
    }
    query(arg1, arg2) {
        if (arg1.IS_ACTIVE_RECORD) {
            return this.database.queryByExample(this, arg1, arg2);
        }
        return arg1(this, arg2);
    }
    async load(activeRecordClass, props) {
        const records = await this.query(activeRecordClass, props);
        if (records.length === 0) {
            throw new Error(`${ActiveRecord_1.getTableName(activeRecordClass)} is empty, can not find ${JSON.stringify(props)}`);
        }
        if (records.length !== 1) {
            throw new Error(`${ActiveRecord_1.getTableName(activeRecordClass)} find more than 1 match of ${JSON.stringify(props)}`);
        }
        return records[0];
    }
    async get(activeRecordClass, id) {
        return await this.load(activeRecordClass, id ? { id } : {});
    }
    toJSON() {
        return undefined;
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map