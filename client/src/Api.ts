import axios from "axios";

const URL =
    import.meta.env.VITE_SERVER_URL ||
    "https://binaire-freznel-assessment-1-ugmm.onrender.com";

export const api = axios.create({
    baseURL: `${URL}/api`,
});

export const UploadCSV = async (
    file: File,
    priority: string
) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("priority", priority);

    const response = await api.post(
        "/jobs/upload",
        formData
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