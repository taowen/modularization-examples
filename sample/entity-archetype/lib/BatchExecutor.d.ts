export declare class BatchExecutor<T> {
    private readonly batchSizeLimit;
    private readonly batchExecute;
    private jobs;
    private executing?;
    constructor(batchSizeLimit: number, batchExecute: (batch: T[]) => Promise<void>);
    enqueue(job: T): void;
    private execute;
    private executeOnce;
}
