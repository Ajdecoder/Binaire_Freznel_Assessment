import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useState,
} from "react";

import { Job, JobPriority } from "../types/jobs";
import { UploadCSV } from "../Api";

interface UploadPanelProps {
    setJobs: Dispatch<SetStateAction<Job[]>>;
}

const UploadPanel = ({ setJobs }: UploadPanelProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [priority, setPriority] = useState<JobPriority>("high");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        if (
            !selectedFile.name
                .toLowerCase()
                .endsWith(".csv")
        ) {
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async (
        file: File,
        priority: JobPriority
    ) => {
        if (isUploading) return;

        setIsUploading(true);

        const jobId = `job-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`;

        const newJob: Job = {
            id: jobId,
            fileName: file.name,
            priority,
            status: "uploading",
            uploadProgress: 0,
            progress: 0,
        };

        setJobs((prev) => [...prev, newJob]);

        try {
            const data = await UploadCSV(
                file,
                priority,
                (uploadProgress) => {
                    setJobs((prev) =>
                        prev.map((job) =>
                            job.id === jobId
                                ? {
                                    ...job,
                                    uploadProgress,
                                }
                                : job
                        )
                    );
                }
            );


            setJobs((prev) =>
                prev.map((job) =>
                    job.id === jobId
                        ? {
                            ...job,
                            ...data.job,
                            uploadProgress: 100,
                        }
                        : job
                )
            );

            setFile(null);
        } catch (error) {
            console.error("Upload failed:", error);

            setJobs((prev) =>
                prev.map((job) =>
                    job.id === jobId
                        ? {
                            ...job,
                            status: "failed",
                        }
                        : job
                )
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="rounded-2xl border border-slate-800 p-6">
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
                    disabled={isUploading}
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
                    <h1 className="mb-2 text-sm font-medium text-slate-300">
                        Priority
                    </h1>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            disabled={isUploading}
                            onClick={() =>
                                setPriority("low")
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition ${
                                priority === "low"
                                    ? "border-slate-500 bg-slate-800 text-white"
                                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            Low
                        </button>

                        <button
                            type="button"
                            disabled={isUploading}
                            onClick={() =>
                                setPriority("high")
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition ${
                                priority === "high"
                                    ? "border-white bg-white text-slate-950"
                                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                            } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            High
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    disabled={!file || isUploading}
                    onClick={() => {
                        if (file) {
                            handleUpload(file, priority);
                        }
                    }}
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isUploading
                        ? "Uploading..."
                        : "Upload File"}
                </button>
            </div>
        </section>
    );
};

export default UploadPanel;