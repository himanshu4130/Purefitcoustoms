import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const BACKEND = BACKEND_URL;

export const TOKEN_KEY = "purefit_admin_token";

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch (_e) { return null; }
};
export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (_e) { /* ignore */ }
};
export const clearToken = () => setToken(null);

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token to every request when available
api.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
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
