"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentOperation = exports.newOperation = exports.runInOperation = void 0;
const tracing = require("scheduler/tracing");
function runInOperation(op, action) {
    return tracing.unstable_trace(op, 0, () => {
        return action();
    });
}
exports.runInOperation = runInOperation;
function newOperation(traceOp) {
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