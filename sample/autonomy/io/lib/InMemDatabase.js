"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemDatabase = void 0;
const ActiveRecord_1 = require("./ActiveRecord");
// 用内存模拟数据库
class InMemDatabase {
    constructor() {
        this.tables = new Map();
    }
    async insert(scene, activeRecordClass, props) {
        const record = new activeRecordClass(scene);
        const id = nextId();
        Object.assign(record, { ...props, id });
        const table = this.getTable(activeRecordClass);
        table.set(id, JSON.parse(JSON.stringify(record)));
        scene.notifyChange(ActiveRecord_1.getTableName(activeRecordClass));
        return record;
    }
    async update(scene, activeRecord) {
        const table = this.getTable(activeRecord.class);
        table.set(Reflect.get(activeRecord, 'id'), JSON.parse(JSON.stringify(activeRecord)));
        scene.notifyChange(ActiveRecord_1.getTableName(activeRecord.class));
    }
    async delete(scene, activeRecord) {
        const table = this.getTable(activeRecord.class);
        table.delete(Reflect.get(activeRecord, 'id'));
        scene.notifyChange(ActiveRecord_1.getTableName(activeRecord.class));
    }
    async queryByExample(scene, activeRecordClass, criteria) {
        const tableName = ActiveRecord_1.getTableName(activeRecordClass);
        for (const subscriber of scene.subscribers) {
            subscriber.subscribe(tableName);
        }
        const table = this.getTable(activeRecordClass);
        function isMatch(record) {
            for (const [k, v] of Object.entries(criteria)) {
                if (record[k] !== v) {
                    return false;
                }
            }
            return true;
        }
        const filtered = [];
        for (const record of table.values()) {
            if (isMatch(record)) {
                filtered.push(Object.assign(new activeRecordClass(scene), record));
            }
        }
        return filtered;
    }
    executeSql(scene, sql, sqlVars) {
        throw new Error('unsupported');
    }
    getTable(activeRecordClass) {
        let table = this.tables.get(activeRecordClass);
        if (!table) {
            this.tables.set(activeRecordClass, (table = new Map()));
        }
        return table;
    }
}
exports.InMemDatabase = InMemDatabase;
let currentId = 1000;
function nextId() {
    return `~${currentId++}`;
}
//# sourceMappingURL=InMemDatabase.js.map