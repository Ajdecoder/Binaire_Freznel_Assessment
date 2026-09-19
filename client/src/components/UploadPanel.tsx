import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Job, JobPriority } from "../types/jobs";

interface UploadPanelProps {
    setJobs: Dispatch<SetStateAction<Job[]>>;
}



const UploadPanel = ({ setJobs }: UploadPanelProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [priority, setPriority] = useState<JobPriority>("high");
    const processingRef = useRef(false);
    const queueRef = useRef<Job[]>([]);

    const updateJob = (jobId: string, updates: Partial<Job>) => {
        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId
                    ? { ...job, ...updates }
                    : job
            )
        );
    };

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        setFile(selectedFile);
    };

    const processQueue = async () => {
        if (processingRef.current || queueRef.current.length === 0) {
            return;
        }

        processingRef.current = true;

        queueRef.current.sort((a, b) => {
            if (a.priority === "high" && b.priority === "low") return -1;
            if (a.priority === "low" && b.priority === "high") return 1;
            return 0;
        });

        const nextJob = queueRef.current.shift();

        if (!nextJob) {
            processingRef.current = false;
            return;
        }

        const processId = String(
            Math.floor(Math.random() * 9000) + 1000
        );

        updateJob(nextJob.id, {
            status: "processing",
            progress: 0,
            processId,
        });

        for (let progress = 10; progress <= 100; progress += 10) {
            await sleep(400);

            updateJob(nextJob.id, {
                progress,
            });
        }

        updateJob(nextJob.id, {
            status: "completed",
            progress: 100,
            result: 80,
        });

        processingRef.current = false;

        processQueue();
    };

    const handleUpload = async (
        file: File,
        priority: JobPriority
    ) => {
        const sleep = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));

        const jobId = `job-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`;

        const newJob: Job = {
            id: jobId,
            fileName: file.name,
            priority,
            status: "uploading",
            progress: 0,
        };

        setJobs((prev) => [...prev, newJob]);

        await sleep(800);

        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId
                    ? {
                        ...job,
                        status: "uploaded",
                    }
                    : job
            )
        );

        await sleep(400);

        const queuedJob: Job = {
            ...newJob,
            status: "queued",
        };

        setJobs((prev) =>
            prev.map((job) =>
                job.id === jobId
                    ? {
                        ...job,
                        status: "queued",
                    }
                    : job
            )
        );

        queueRef.current.push(queuedJob);

        if (processingRef.current) {
            setJobs((prev) =>
                prev.map((job) =>
                    job.id === jobId
                        ? {
                            ...job,
                            status: "waiting",
                            processId: String(
                                Math.floor(Math.random() * 9000) + 1000
                            ),
                        }
                        : job
                )
            );
        }

        await sleep(300);

        processQueue();
    };

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                    Upload CSV
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Select a CSV file and choose its processing priority.
                </p>
            </div>

            <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950 px-6 transition hover:border-slate-500">
                <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                />

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl">
                    ↑
                </div>

                {file ? (
                    <>
                        <p className="text-sm font-medium text-white">
                            {file.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Click to choose another file
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm font-medium text-white">
                            Choose a CSV file
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            CSV files only
                        </p>
                    </>
                )}
            </label>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium text-slate-300">
                        Priority
                    </p>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setPriority("low")}
                            className={`rounded-lg border px-4 py-2 text-sm transition ${priority === "low"
                                ? "border-slate-500 bg-slate-800 text-white"
                                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                                }`}
                        >
                            Low
                        </button>

                        <button
                            type="button"
                            onClick={() => setPriority("high")}
                            className={`rounded-lg border px-4 py-2 text-sm transition ${priority === "high"
                                ? "border-white bg-white text-slate-950"
                                : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                                }`}
                        >
                            High
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={!file}
                    onClick={() => file && handleUpload(file, priority)}
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Upload File
                </button>
            </div>
        </section>
    );
};

export default UploadPanel;