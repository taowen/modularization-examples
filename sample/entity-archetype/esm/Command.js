// 封装写操作，进行业务规则校验
export class Command {
    constructor(props) {
        Object.assign(this, props);
    }
    static toRun(commandClass) {
        return (props) => {
            return new commandClass(props).run();
        };
    }
}
//# sourceMappingURL=Command.js.map