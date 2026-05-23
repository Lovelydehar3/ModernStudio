import axios from "axios";
import { authStore } from "../store/authStore";
import { userAuthStore } from "../store/userAuthStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Secure CSRF token retrieval with proper cookie parsing
const getCsrfToken = () => {
  try {
    const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 6000),
  // Set secure defaults
  headers: {
    "Content-Type": "application/json"
  }
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

// Fetch CSRF token with retry logic
const ensureCsrfToken = async (retries = 2) => {
  const existing = getCsrfToken();
  if (existing) return existing;

  try {
    csrfRequest = csrfRequest || csrfClient.get("/auth/csrf").finally(() => {
      csrfRequest = null;
    });
    await csrfRequest;
    const token = getCsrfToken();
    if (!token && retries > 0) {
      // Retry once if token not set
      return ensureCsrfToken(retries - 1);
    }
    return token;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error.message);
    return "";
  }
};

// Request interceptor for CSRF protection
apiClient.interceptors.request.use(async (config) => {
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    const token = await ensureCsrfToken();
    if (token) {
      config.headers["X-CSRF-Token"] = token;
    }
  }
  return config;
});

// Response interceptor for error handling and security
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    
    // Handle authentication errors
    if (status === 401) {
      // Clear user data on authentication failure
      authStore.clearUser();
      userAuthStore.clearUser();
      
      // Redirect to login if not already there
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        // Store intended destination for post-login redirect
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      }
    }
    
    // Handle CSRF errors - refresh page to get new token
    if (status === 403 && error?.response?.data?.message?.includes("CSRF")) {
      // Clear corrupted cookies and refresh
      document.cookie = "csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
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
