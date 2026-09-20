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
    const [files, setFiles] = useState<File[]>([]);
    const [priorities, setPriorities] = useState<JobPriority[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles = Array.from(
            event.target.files || []
        );

        const csvFiles = selectedFiles.filter((file) =>
            file.name.toLowerCase().endsWith(".csv")
        );

        if (csvFiles.length === 0) return;

        setFiles(csvFiles);
        setPriorities(
            csvFiles.map(() => "high")
        );
    };

    const handlePriorityChange = (
        index: number,
        priority: JobPriority
    ) => {
        setPriorities((prev) =>
            prev.map((item, i) =>
                i === index ? priority : item
            )
        );
    };

    const handleUpload = async () => {
        if (isUploading || files.length === 0) return;

        setIsUploading(true);

        const tempJobs: Job[] = files.map(
            (file, index) => ({
                id: `temp-${Date.now()}-${index}`,
                fileName: file.name,
                priority: priorities[index],
                executionOrder: index + 1,
                status: "uploading",
                uploadProgress: 0,
                progress: 0,
            })
        );

        setJobs((prev) => [...prev, ...tempJobs]);

        try {
            const results = await Promise.all(
                files.map((file, fileIndex) =>
                    UploadCSV(
                        [file],
                        [priorities[fileIndex]],
                        (uploadProgress) => {
                            setJobs((prev) =>
                                prev.map((job) => {
                                    const index =
                                        tempJobs.findIndex(
                                            (tempJob) =>
                                                tempJob.id === job.id
                                        );

                                    if (index !== fileIndex) {
                                        return job;
                                    }

                                    return {
                                        ...job,
                                        uploadProgress,
                                    };
                                })
                            );
                        }
                    )
                )
            );

            const data = {
                jobs: results.flatMap(
                    (result) => result.jobs
                ),
            };

            setJobs((prev) =>
                prev.map((job) => {
                    const index = tempJobs.findIndex(
                        (tempJob) =>
                            tempJob.id === job.id
                    );

                    if (index === -1) return job;

                    return {
                        ...job,
                        ...data.jobs[index],
                        uploadProgress: 100,
                    };
                })
            );

            setFiles([]);
            setPriorities([]);
        } catch (error) {
            console.error("Upload failed:", error);

            setJobs((prev) =>
                prev.map((job) => {
                    const isTempJob = tempJobs.some(
                        (tempJob) =>
                            tempJob.id === job.id
                    );

                    return isTempJob
                        ? {
                            ...job,
                            status: "failed",
                        }
                        : job;
                })
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="border border-zinc-800 p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">
                    Upload CSV Files
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    Add CSV files to the queue and set their priority.
                </p>
            </div>

            <label className="group flex min-h-40 cursor-pointer flex-col items-center justify-center border border-dashed border-zinc-700 px-6 transition hover:border-zinc-500">
                <input
                    type="file"
                    accept=".csv,text/csv"
                    multiple
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="hidden"
                />

                <div className="mb-3 flex h-10 w-10 items-center justify-center text-xl text-zinc-500">
                    ↑
                </div>

                {files.length > 0 ? (
                    <>
                        <p className="text-sm font-medium text-white">
                            {files.length} CSV file
                            {files.length > 1 ? "s" : ""} selected
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                            Click to choose different files
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-sm font-medium text-white">
                            Choose CSV files
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                            Multiple files can be selected
                        </p>
                    </>
                )}
            </label>

            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="flex flex-col gap-3 border border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {file.name}
                                </p>

                                <p className="mt-1 text-xs text-zinc-600">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() =>
                                        handlePriorityChange(
                                            index,
                                            "low"
                                        )
                                    }
                                    className={`border px-3 py-1.5 text-xs transition ${
                                        priorities[index] === "low"
                                            ? "border-zinc-400 text-white"
                                            : "border-zinc-800 text-zinc-500 hover:text-white"
                                    }`}
                                >
                                    Low
                                </button>

                                <button
                                    type="button"
                                    disabled={isUploading}
                                    onClick={() =>
                                        handlePriorityChange(
                                            index,
                                            "high"
                                        )
                                    }
                                    className={`border px-3 py-1.5 text-xs transition ${
                                        priorities[index] === "high"
                                            ? "border-zinc-300 text-white"
                                            : "border-zinc-800 text-zinc-500 hover:text-white"
                                    }`}
                                >
                                    High
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    disabled={
                        files.length === 0 ||
                        isUploading
                    }
                    onClick={handleUpload}
                    className="border border-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isUploading
                        ? "Uploading..."
                        : `Upload ${files.length || ""} File${files.length !== 1 ? "s" : ""}`}
                </button>
            </div>
        </section>
    );
};

export default UploadPanel;