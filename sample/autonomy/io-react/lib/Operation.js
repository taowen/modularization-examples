"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentOperation = exports.newOperation = exports.runInOperation = void 0;
const tracing = require("scheduler/tracing");
function runInOperation(op, action) {
    // 这个就是 react 的异步调用链传递机制
    // 否则组件被 render 了不能知道是被什么 operation 给触发的
    return tracing.unstable_trace(op, 0, () => {
        return action();
    });
}
exports.runInOperation = runInOperation;
function newOperation(traceOp) {
    // 分布式追踪的 traceId 是在前端浏览器这里分配的，一直会往后传递
    return {
        traceId: '123',
        traceOp,
        baggage: {},
        props: {},
    };
}
exports.newOperation = newOperation;
function currentOperation() {
    const interactions = tracing.unstable_getCurrent();
    if (!interactions) {
        throw new Error('missing operation');
    }
    for (const interaction of interactions) {
        const maybeOp = interaction.name;
        if (maybeOp && maybeOp.traceId) {
            return maybeOp;
        }
    }
    throw new Error('missing operation');
}
exports.currentOperation = currentOperation;
//# sourceMappingURL=Operation.js.map