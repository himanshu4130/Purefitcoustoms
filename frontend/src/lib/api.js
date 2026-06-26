import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const BACKEND = BACKEND_URL;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

export const buildMediaUrl = (urlOrId) => {
  if (!urlOrId) return null;
  if (urlOrId.startsWith("http")) return urlOrId;
  if (urlOrId.startsWith("/api/")) return `${BACKEND_URL}${urlOrId}`;
  return `${BACKEND_URL}/api/media/${urlOrId}`;
};
