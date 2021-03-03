"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.call = exports.toRun = exports.Command = void 0;
// 封装写操作，进行业务规则校验
class Command {
    constructor(scene, props) {
        this.scene = scene;
        Object.assign(this, props);
    }
    call(commandClass, props) {
        return call(this.scene, commandClass, props);
    }
}
exports.Command = Command;
function toRun(commandClass) {
    return (scene, props) => {
        return new commandClass(scene, props).run();
    };
}
exports.toRun = toRun;
function call(scene, commandClass, props) {
    return new commandClass(scene, props).run();
}
exports.call = call;
//# sourceMappingURL=Command.js.map