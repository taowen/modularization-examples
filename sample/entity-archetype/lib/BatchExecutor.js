"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchExecutor = void 0;
class BatchExecutor {
    constructor(batchSizeLimit, batchExecute) {
        this.batchSizeLimit = batchSizeLimit;
        this.batchExecute = batchExecute;
        this.jobs = [];
    }
    enqueue(job) {
        this.jobs.push(job);
        if (!this.executing) {
            this.executing = this.execute();
        }
    }
    async execute() {
        // 攒一批 jobs
        await new Promise((resolve) => setTimeout(resolve, 0));
        while (this.jobs.length > 0) {
            await this.executeOnce();
        }
        this.executing = undefined;
    }
    async executeOnce() {
        const batches = [];
        while (this.jobs.length > 0) {
            batches.push(this.jobs.splice(0, this.batchSizeLimit));
        }
        for (const batch of batches) {
            try {
                await this.batchExecute(batch);
            }
            catch (e) {
                console.log(`did not expect batchExecute to throw exception`, e);
            }
        }
    }
}
exports.BatchExecutor = BatchExecutor;
//# sourceMappingURL=BatchExecutor.js.map