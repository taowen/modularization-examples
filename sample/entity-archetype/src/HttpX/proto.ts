export interface Job {
    project: string;
    service: string;
    args: any[];
}

export type JobResult = JobSuccess | JobError;

export function isJobError(jobResult: JobResult): jobResult is JobError {
    return !!(jobResult as any).error;
}

export interface JobSuccess {
    data: any;
    subscribed: string[];
    changed: string[];
}

export interface JobError {
    error: any;
}