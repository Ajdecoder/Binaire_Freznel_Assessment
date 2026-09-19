export type JobPriority = "high" | "low";

export type JobStatus = | "uploading" | "uploaded" | "queued" | "waiting" | "processing" | "completed" | "failed";

export interface Job {
    id: string;
    fileName: string;
    priority: JobPriority;
    status: JobStatus;
    progress: number;
    processId?: string;
    result?: number;
}