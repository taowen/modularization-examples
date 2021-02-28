// 用内存模拟数据库
export class InMemDatabase {
    constructor() {
        this.tables = new Map();
    }
    async insert(scene, activeRecordClass, props) {
        const record = new activeRecordClass(scene);
        const id = nextId();
        Object.assign(record, { ...props, id });
        const table = this.getTable(activeRecordClass);
        table.set(id, JSON.parse(JSON.stringify(record)));
        return record;
    }
    async update(scene, activeRecord) {
        const table = this.getTable(activeRecord.class);
        table.set(Reflect.get(activeRecord, "id"), JSON.parse(JSON.stringify(activeRecord)));
    }
    async delete(scene, activeRecord) {
        const table = this.getTable(activeRecord.class);
        table.delete(Reflect.get(activeRecord, "id"));
    }
    async queryByExample(scene, activeRecordClass, criteria) {
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
        throw new Error("unsupported");
    }
    getTable(activeRecordClass) {
        let table = this.tables.get(activeRecordClass);
        if (!table) {
            this.tables.set(activeRecordClass, (table = new Map()));
        }
        return table;
    }
}
let currentId = 1000;
function nextId() {
    return `~${currentId++}`;
}
//# sourceMappingURL=InMemDatabase.js.map