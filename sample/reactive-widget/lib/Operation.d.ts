import { Operation } from "@autonomy/entity-archetype";
export declare function runInOperation<T>(op: Operation, action: () => T): T;
export declare function newOperation(traceOp: string): Operation;
export declare function currentOperation(): Operation;
