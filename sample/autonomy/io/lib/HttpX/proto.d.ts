export interface Job {
    project: string;
    service: string;
    args: any[];
}
export declare type JobResult = JobSuccess | JobError;
export declare function isJobError(jobResult: JobResult): jobResult is JobError;
export interface JobSuccess {
    data: any;
    subscribed: string[];
    changed: string[];
}
export interface JobError {
    error: any;
}
