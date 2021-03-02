import { Operation } from "@autonomy/entity-archetype";
import * as tracing from 'scheduler/tracing';

export function runInOperation<T>(op: Operation, action: () => T): T {
    return tracing.unstable_trace(op as any, 0, () => {
        return action();
    });
}

export function newOperation(traceOp: string): Operation {
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