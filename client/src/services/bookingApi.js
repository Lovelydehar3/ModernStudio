import apiClient from "./apiClient";

export const bookingApi = {
  create(payload) {
    return apiClient.post("/bookings", payload);
  },
  getAdmin(params = {}) {
    return apiClient.get("/admin/bookings", { params });
  },
  updateStatus(id, payload) {
    return apiClient.patch(`/admin/bookings/${id}/status`, payload);
  },
  getOne(id) {
    return apiClient.get(`/admin/bookings/${id}`);
  },
  update(id, payload) {
    return apiClient.put(`/admin/bookings/${id}`, payload);
  },
  remove(id) {
    return apiClient.delete(`/admin/bookings/${id}`);
  }
};
