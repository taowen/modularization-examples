import { Database, Scene, Table } from './Scene';

// 用内存模拟数据库
export class InMemDatabase implements Database {
    private tables: Map<Table, Map<string, Record<string, any>>> = new Map();

    public async insert(scene: Scene, table: Table, props: Record<string, any>): Promise<any> {
        const obj = new table(scene);
        obj.update = this.update.bind(this, obj);
        obj.delete = this.delete.bind(this, obj);
        const id = nextId();
        Object.assign(obj, { ...props, id });
        const records = this.getRecords(table);
        records.set(id, JSON.parse(JSON.stringify(obj)));
        scene.notifyChange(table);
        return obj;
    }
    public async query(scene: Scene, table: Table, criteria: Record<string, any>): Promise<any[]> {
        scene.subscribe(table);
        const records = this.getRecords(table);
        function isMatch(record: Record<string, any>) {
            for (const [k, v] of Object.entries(criteria)) {
                if (record[k] !== v) {
                    return false;
                }
            }
            return true;
        }
        const objs = [];
        for (const record of records.values()) {
            if (isMatch(record)) {
                const obj = Object.assign(new table(scene), record);
                obj.update = this.update.bind(this, obj);
                obj.delete = this.delete.bind(this, obj);
                objs.push(obj);
            }
        }
        return objs;
    }
    private update(obj: any, scene: Scene) {
        const records = this.getRecords(obj.constructor);
        records.set(obj.id, JSON.parse(JSON.stringify(obj)));
        scene.notifyChange(obj.constructor);
    }
    private delete(obj: any, scene: Scene) {
        const records = this.getRecords(obj.constructor);
        records.delete(obj.id)
        scene.notifyChange(obj.constructor);
    }
    public executeSql(scene: Scene, sql: string, sqlVars: Record<string, any>): Promise<any[]> {
        throw new Error('unsupported');
    }
    private getRecords(table: Table) {
        let records = this.tables.get(table);
        if (!records) {
            this.tables.set(table, (records = new Map()));
        }
        return records;
    }
}

let currentId = 1000;
function nextId() {
    return `~${currentId++}`;
}
