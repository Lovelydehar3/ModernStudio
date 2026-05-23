import axios from "axios";
import { authStore } from "../store/authStore";
import { userAuthStore } from "../store/userAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const getCsrfToken = () => {
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? match[1] : "";
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 6000)
});

const csrfClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 6000)
});

let csrfRequest = null;

// Request deduplication for GET requests
const pendingRequests = new Map();

const getRequestKey = (url, params = {}) => {
  const paramString = new URLSearchParams(params).toString();
  return `GET:${url}${paramString ? `?${paramString}` : ""}`;
};

const ensureCsrfToken = async () => {
  const existing = getCsrfToken();
  if (existing) return existing;

  csrfRequest = csrfRequest || csrfClient.get("/auth/csrf").finally(() => {
    csrfRequest = null;
  });
  await csrfRequest;
  return getCsrfToken();
};

apiClient.interceptors.request.use(async (config) => {
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    const token = await ensureCsrfToken();
    config.headers["X-CSRF-Token"] = token;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      authStore.clearUser();
      userAuthStore.clearUser();
    }
    return Promise.reject(error);
  }
);

// Wrap the get method to deduplicate requests
const originalGet = apiClient.get;
apiClient.get = function(url, config) {
  const key = getRequestKey(url, config?.params);
  
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  const request = originalGet.call(this, url, config)
    .finally(() => {
      pendingRequests.delete(key);
    });
  
  pendingRequests.set(key, request);
  return request;
};

export default apiClient;
