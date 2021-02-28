// 数据库表
export class ActiveRecord {
    constructor(scene) {
        this.scene = scene;
    }
    static toInsert(activeRecordClass) {
        return (scene, props) => {
            return scene.insert(activeRecordClass, props);
        };
    }
    static toQuery(activeRecordClass) {
        return (scene, props) => {
            return scene.query(activeRecordClass, props);
        };
    }
    static toGet(activeRecordClass) {
        return async (scene, id) => {
            return (await scene.query(activeRecordClass, { id }))[0];
        };
    }
}
//# sourceMappingURL=ActiveRecord.js.map