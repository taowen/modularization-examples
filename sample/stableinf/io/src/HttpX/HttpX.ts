export interface Job {
    service: string;
    args: any[];
}

export type JobResult = JobSuccess | JobError;

export function isJobError(jobResult: JobResult): jobResult is JobError {
    return !!(jobResult as any).error;
}

export interface JobSuccess {
    index: number;
    data: any;
    subscribed: string[];
    changed: string[];
}

export interface JobError {
    index: number;
    error: any;
}