// 同时每个异步执行流程会创建一个独立的 scene，例如 handle 一个 http 请求，处理一次鼠标点击
export class Scene {
    constructor(options) {
        this.useGateway = (project) => {
            return this.remoteService.useGateway(this, project);
        };
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
// 前端浏览器等场景里没有数据库
export const DUMMY_DATABASE = {
    insert: () => {
        throw new Error("unsupported");
    },
    update: () => {
        throw new Error("unsupported");
    },
    delete: () => {
        throw new Error("unsupported");
    },
    queryByExample: () => {
        throw new Error("unsupported");
    },
    executeSql: () => {
        throw new Error("unsupported");
    },
};
//# sourceMappingURL=Scene.js.map