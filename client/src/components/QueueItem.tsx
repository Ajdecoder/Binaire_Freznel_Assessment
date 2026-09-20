import { Job } from "../types/jobs";

interface QueueItemProps {
    job: Job;
}

type Step = {
    key:
        | "uploading"
        | "uploaded"
        | "queued"
        | "processing"
        | "completed";
    label: string;
};

const steps: Step[] = [
    {
        key: "uploading",
        label: "Uploading",
    },
    {
        key: "uploaded",
        label: "File uploaded",
    },
    {
        key: "queued",
        label: "Added to queue",
    },
    {
        key: "processing",
        label: "Processing",
    },
    {
        key: "completed",
        label: "Completed",
    },
];

const QueueItem = ({ job }: QueueItemProps) => {
    const isWaiting = job.status === "waiting";

    const getStepState = (
        stepKey: Step["key"]
    ) => {
        if (job.status === "failed") {
            return "pending";
        }

        if (job.status === "waiting") {
            if (
                stepKey === "uploading" ||
                stepKey === "uploaded" ||
                stepKey === "queued"
            ) {
                return "completed";
            }

            return "pending";
        }

        const currentIndex = steps.findIndex(
            (step) => step.key === job.status
        );

        const stepIndex = steps.findIndex(
            (step) => step.key === stepKey
        );

        if (stepIndex < currentIndex) {
            return "completed";
        }

        if (stepIndex === currentIndex) {
            return "current";
        }

        return "pending";
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-medium text-white">
                            {job.fileName}
                        </h3>

                        <span
                            className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase ${
                                job.priority === "high"
                                    ? "bg-white text-slate-950"
                                    : "bg-slate-800 text-slate-300"
                            }`}
                        >
                            {job.priority}
                        </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Job ID: {job.id}
                    </p>
                </div>

                <div className="text-left sm:text-right">
                    <p className="text-sm font-medium text-slate-200">
                        {isWaiting
                            ? "Waiting for processing"
                            : job.status === "processing"
                            ? "Processing..."
                            : job.status === "uploading"
                            ? "Uploading..."
                            : job.status === "uploaded"
                            ? "File uploaded"
                            : job.status === "queued"
                            ? "Added to queue"
                            : job.status === "completed"
                            ? "Completed"
                            : "Failed"}
                    </p>

                    {job.processId &&
                        (isWaiting ||
                            job.status === "processing") && (
                            <p className="mt-1 text-xs text-slate-500">
                                Process ID: {job.processId}
                            </p>
                        )}
                </div>
            </div>

            
            <div className="mt-6">
                {steps.map((step, index) => {
                    const state = getStepState(step.key);

                    const isCurrent =
                        state === "current";

                    const isCompleted =
                        state === "completed";

                    return (
                        <div
                            key={step.key}
                            className="relative flex gap-3"
                        >
                            
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-2.25 top-6 h-7 w-px ${
                                        isCompleted
                                            ? "bg-slate-500"
                                            : "bg-red-800"
                                    }`}
                                />
                            )}

                            
                            <div
                                className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                                    isCompleted
                                        ? "border-white bg-white text-slate-950"
                                        : isCurrent
                                        ? "border-white text-white"
                                        : "border-slate-700 text-slate-600"
                                }`}
                            >
                                {isCompleted
                                    ? "✓"
                                    : index + 1}
                            </div>

                            
                            <div className="min-h-11 flex-1">
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`text-sm ${
                                            isCurrent ||
                                            isCompleted
                                                ? "text-white"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {step.label}
                                    </span>

                                    
                                    {step.key === "uploading" &&
                                        job.status ===
                                            "uploading" && (
                                            <span className="text-xs text-slate-400">
                                                {
                                                    job.uploadProgress
                                                }
                                                %
                                            </span>
                                        )}

                                    
                                    {step.key ===
                                            "processing" &&
                                        job.status ===
                                            "processing" && (
                                            <span className="text-xs text-slate-400">
                                                {job.progress}%
                                            </span>
                                        )}
                                </div>

                                
                                {step.key === "uploading" &&
                                    job.status ===
                                        "uploading" && (
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-white transition-all duration-200"
                                                style={{
                                                    width: `${job.uploadProgress}%`,
                                                }}
                                            />
                                        </div>
                                    )}

                                
                                {isWaiting &&
                                    step.key ===
                                        "queued" && (
                                        <p className="mt-1 text-xs text-slate-500">
                                            Waiting for an available
                                            worker
                                        </p>
                                    )}

                                
                                {step.key ===
                                        "processing" &&
                                    job.status ===
                                        "processing" && (
                                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-white transition-all duration-300"
                                                style={{
                                                    width: `${job.progress}%`,
                                                }}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    );
                })}
            </div>

            
            {job.status === "completed" &&
                job.result && (
                    <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                        <p className="text-sm text-emerald-400">
                            Processing completed
                        </p>

                        <p className="mt-2 text-lg font-semibold text-white">
                            Total: {job.result.total}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Numbers processed:{" "}
                            {job.result.numberCount}
                        </p>
                    </div>
                )}

            
            {job.status === "failed" && (
                <div className="mt-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">
                        Processing failed
                    </p>
                </div>
            )}
        </div>
    );
};

export default QueueItem;