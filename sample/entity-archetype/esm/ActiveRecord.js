import { call } from "./Command";
// 数据库表
export class ActiveRecord {
    constructor(scene) {
        this.scene = scene;
    }
    static getTableName(activeRecordClass) {
        return activeRecordClass.tableName || activeRecordClass.name;
    }
    async update() {
        await this.scene.update(this);
    }
    call(commandClass, props) {
        return call(this.scene, commandClass, props);
    }
    get class() {
        return this.constructor;
    }
}
ActiveRecord.IS_ACTIVE_RECORD = true;
export function toInsert(activeRecordClass) {
    return (scene, props) => {
        return scene.insert(activeRecordClass, props);
    };
}
export function toQuery(activeRecordClass) {
    return (scene, props) => {
        return scene.query(activeRecordClass, props || {});
    };
}
export function toLoad(activeRecordClass) {
    return async (scene, props) => {
        const records = await scene.query(activeRecordClass, props);
        if (records.length !== 1) {
            throw new Error('unexpected');
        }
        return records[0];
    };
}
export function toGet(activeRecordClass) {
    return async (scene, id) => {
        const records = await scene.query(activeRecordClass, { id });
        if (records.length === 0) {
            throw new Error(`${ActiveRecord.getTableName(activeRecordClass)} ${id} not found`);
        }
        if (records.length !== 1) {
            throw new Error('unexpected');
        }
        return records[0];
    };
}
export function toRunMethod(activeRecordClass, method) {
    return async (scene, id, ...args) => {
        const entity = (await scene.query(activeRecordClass, { id }))[0];
        return await Reflect.get(entity, method)(...args);
    };
}
export function subsetOf(activeRecordClass) {
    return (sqlWhere, ...args) => {
        return (scene, sqlVars) => {
            return scene.executeSql(`SELECT * FROM ${ActiveRecord.getTableName(activeRecordClass)} WHERE ${sqlWhere[0]}`, sqlVars);
        };
    };
}
export function sqlView(sqlFragments, ...activeRecordClasses) {
    const merged = [];
    for (const [i, sqlFragment] of sqlFragments.entries()) {
        merged.push(sqlFragment);
        const activeRecordClass = activeRecordClasses[i];
        if (activeRecordClass) {
            merged.push(ActiveRecord.getTableName(activeRecordClass));
        }
    }
    const sql = merged.join("");
    return (scene, sqlVars) => {
        return scene.executeSql(sql, sqlVars);
    };
}
//# sourceMappingURL=ActiveRecord.js.map