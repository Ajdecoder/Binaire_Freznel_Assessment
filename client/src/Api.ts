import axios from "axios";
import { JobPriority } from "./types/jobs";

const URL =
    import.meta.env.VITE_SERVER_URL ||
    "https://binaire-freznel-assessment-1-ugmm.onrender.com";

export const api = axios.create({
    baseURL: `${URL}/api`,
});

export const UploadCSV = async (
    files: File[],
    priorities: JobPriority[],
    onProgress: (progress: number) => void
) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    formData.append(
        "priorities",
        JSON.stringify(priorities)
    );

    const response = await api.post(
        "/jobs/upload",
        formData,
        {
            onUploadProgress: (event) => {
                if (!event.total) return;

                const progress = Math.round(
                    (event.loaded * 100) / event.total
                );

                onProgress(progress);
            },
        }
    );

    return response.data;
};


export const GetJobs = async () => {
    const response = await api.get("/jobs");

    return response.data;
};

export const DownloadResult = async (
    jobId: string
) => {
    const response = await api.get(
        `/jobs/${jobId}/download`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};