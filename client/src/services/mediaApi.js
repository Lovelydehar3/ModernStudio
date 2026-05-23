import apiClient from "./apiClient";

const UPLOAD_TIMEOUT_MS = Number(import.meta.env.VITE_UPLOAD_TIMEOUT || 120000);

const getUploadConfig = (payload, onUploadProgress) => {
  const isFormData = payload instanceof FormData;
  if (!isFormData) return {};

  return {
    timeout: UPLOAD_TIMEOUT_MS,
    onUploadProgress
  };
};

export const mediaApi = {
  getPublic(params = {}) {
    return apiClient.get("/media", { params });
  },
  getAdmin(params = {}) {
    return apiClient.get("/admin/media", { params });
  },
  /**
   * Create media with optional file upload.
   * @param {FormData|object} payload - use FormData when uploading a file
   * @param {function} onUploadProgress - optional progress callback
   */
  create(payload, onUploadProgress) {
    return apiClient.post("/admin/media", payload, getUploadConfig(payload, onUploadProgress));
  },
  /**
   * Update media - supports file replacement via FormData.
   */
  update(id, payload, onUploadProgress) {
    return apiClient.put(`/admin/media/${id}`, payload, getUploadConfig(payload, onUploadProgress));
  },
  remove(id) {
    return apiClient.delete(`/admin/media/${id}`);
  }
};
