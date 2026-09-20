import axios from "axios";

const URL = import.meta.env.VITE_SERVER_URL || "https://binaire-freznel-assessment-1-ugmm.onrender.com";

export const api = axios.create({
  baseURL: `${URL}/api`,
});
