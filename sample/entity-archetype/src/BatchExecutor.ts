export class BatchExecutor<T> {
    private jobs: T[] = [];
    private executing?: Promise<void>;
    constructor(
        private readonly batchSizeLimit: number,
        private readonly batchExecute: (batch: T[]) => Promise<void>,
    ) {}
    public enqueue(job: T) {
        this.jobs.push(job);
        if (!this.executing) {
            this.executing = this.execute();
        }
    }
    private async execute() {
        // 攒一批 jobs
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
        while (this.jobs.length > 0) {
            await this.executeOnce();
        }
        this.executing = undefined;
    }
    private async executeOnce() {
        const batches = [];
        while (this.jobs.length > 0) {
            batches.push(this.jobs.splice(0, this.batchSizeLimit));
        }
        for (const batch of batches) {
            try {
                await this.batchExecute(batch);
            } catch (e) {
                console.log(`did not expect batchExecute to throw exception`, e);
            }
        }
    }
}
