import { Operation } from "@autonomy/entity-archetype";
import * as tracing from 'scheduler/tracing';

export function runInOperation<T>(op: Operation, action: () => T): T {
    // 这个就是 react 的异步调用链传递机制
    // 否则组件被 render 了不能知道是被什么 operation 给触发的
    return tracing.unstable_trace(op as any, 0, () => {
        return action();
    });
}

export function newOperation(traceOp: string): Operation {
    // 分布式追踪的 traceId 是在前端浏览器这里分配的，一直会往后传递
    return {
        traceId: '123',
        traceOp,
        baggage: {},
        props: {},
    };
}

export function currentOperation(): Operation {
    const interactions = tracing.unstable_getCurrent();
    if (!interactions) {
        throw new Error('missing operation');
    }
    for (const interaction of interactions) {
        const maybeOp = interaction.name as any;
        if (maybeOp && maybeOp.traceId) {
            return maybeOp;
        }
    }
    throw new Error('missing operation');
}