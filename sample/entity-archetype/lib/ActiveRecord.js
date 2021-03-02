"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlView = exports.subsetOf = exports.toRunMethod = exports.toGet = exports.toLoad = exports.toQuery = exports.toInsert = exports.getTableName = exports.ActiveRecord = void 0;
const Command_1 = require("./Command");
// 数据库表
class ActiveRecord {
    constructor(scene) {
        this.scene = scene;
    }
    async update() {
        await this.scene.update(this);
    }
    call(commandClass, props) {
        return Command_1.call(this.scene, commandClass, props);
    }
    get class() {
        return this.constructor;
    }
}
exports.ActiveRecord = ActiveRecord;
ActiveRecord.IS_ACTIVE_RECORD = true;
function getTableName(activeRecordClass) {
    return activeRecordClass.tableName || activeRecordClass.name;
}
exports.getTableName = getTableName;
function toInsert(activeRecordClass) {
    return (scene, props) => {
        return scene.insert(activeRecordClass, props);
    };
}
exports.toInsert = toInsert;
function toQuery(activeRecordClass) {
    return (scene, props) => {
        return scene.query(activeRecordClass, props || {});
    };
}
exports.toQuery = toQuery;
function toLoad(activeRecordClass) {
    return async (scene, props) => {
        return await scene.load(activeRecordClass, props);
    };
}
exports.toLoad = toLoad;
function toGet(activeRecordClass) {
    return async (scene, id) => {
        return await scene.get(activeRecordClass, id);
    };
}
exports.toGet = toGet;
function toRunMethod(activeRecordClass, method) {
    return async (scene, id, ...args) => {
        const entity = (await scene.query(activeRecordClass, { id }))[0];
        return await Reflect.get(entity, method).apply(entity, args);
    };
}
exports.toRunMethod = toRunMethod;
function subsetOf(activeRecordClass) {
    return (sqlWhere, ...args) => {
        return (scene, sqlVars) => {
            return scene.executeSql(`SELECT * FROM ${getTableName(activeRecordClass)} WHERE ${sqlWhere[0]}`, sqlVars);
        };
    };
}
exports.subsetOf = subsetOf;
function sqlView(sqlFragments, ...activeRecordClasses) {
    const merged = [];
    for (const [i, sqlFragment] of sqlFragments.entries()) {
        merged.push(sqlFragment);
        const activeRecordClass = activeRecordClasses[i];
        if (activeRecordClass) {
            merged.push(getTableName(activeRecordClass));
        }
    }
    const sql = merged.join('');
    return (scene, sqlVars) => {
        return scene.executeSql(sql, sqlVars);
    };
}
exports.sqlView = sqlView;
//# sourceMappingURL=ActiveRecord.js.map