import apiClient from "./apiClient";

export const inquiryApi = {
  create(payload) {
    return apiClient.post("/inquiries", payload);
  },
  getAdmin(params = {}) {
    return apiClient.get("/admin/inquiries", { params });
  },
  resolve(id, payload) {
    return apiClient.patch(`/admin/inquiries/${id}/resolve`, payload);
  },
  remove(id) {
    return apiClient.delete(`/admin/inquiries/${id}`);
  }
};
