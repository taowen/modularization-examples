import { ActiveRecord, ActiveRecordClass, getTableName } from './ActiveRecord';
import { Database, Scene } from './Scene';

type ActiveRecordCopy = Record<string, any>;

// 用内存模拟数据库
export class InMemDatabase implements Database {
    private tables: Map<ActiveRecordClass, Map<string, ActiveRecordCopy>> = new Map();

    public async insert(
        scene: Scene,
        activeRecordClass: ActiveRecordClass,
        props: Record<string, any>,
    ): Promise<ActiveRecord> {
        const record = new activeRecordClass(scene);
        const id = nextId();
        Object.assign(record, { ...props, id });
        const table = this.getTable(activeRecordClass);
        table.set(id, JSON.parse(JSON.stringify(record)));
        scene.notifyChange(getTableName(activeRecordClass));
        return record;
    }
    public async update<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void> {
        const table = this.getTable(activeRecord.class);
        table.set(Reflect.get(activeRecord, 'id'), JSON.parse(JSON.stringify(activeRecord)));
        scene.notifyChange(getTableName(activeRecord.class));
    }
    public async delete<T extends ActiveRecord>(scene: Scene, activeRecord: T): Promise<void> {
        const table = this.getTable(activeRecord.class);
        table.delete(Reflect.get(activeRecord, 'id'));
        scene.notifyChange(getTableName(activeRecord.class));
    }
    public async query<T extends ActiveRecord>(
        scene: Scene,
        activeRecordClass: ActiveRecordClass<T>,
        criteria: Partial<T>,
    ): Promise<T[]> {
        const tableName = getTableName(activeRecordClass);
        scene.subscribe(tableName);
        const table = this.getTable(activeRecordClass);
        function isMatch(record: ActiveRecordCopy) {
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
    public executeSql(scene: Scene, sql: string, sqlVars: Record<string, any>): Promise<any[]> {
        throw new Error('unsupported');
    }

    private getTable(activeRecordClass: ActiveRecordClass) {
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
