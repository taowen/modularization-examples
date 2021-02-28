// 封装写操作，进行业务规则校验
export class Command {
    constructor(scene, props) {
        this.scene = scene;
        Object.assign(this, props);
    }
    call(commandClass, props) {
        return call(this.scene, commandClass, props);
    }
}
export function toRun(commandClass) {
    return (scene, props) => {
        return new commandClass(scene, props).run();
    };
}
export function call(scene, commandClass, props) {
    return new commandClass(scene, props).run();
}
//# sourceMappingURL=Command.js.map