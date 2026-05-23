import apiClient from "./apiClient";

export const packageApi = {
  getPublic() {
    return apiClient.get("/packages");
  },
  getAdmin() {
    return apiClient.get("/admin/packages");
  },
  create(payload) {
    return apiClient.post("/admin/packages", payload);
  },
  update(id, payload) {
    return apiClient.put(`/admin/packages/${id}`, payload);
  },
  remove(id) {
    return apiClient.delete(`/admin/packages/${id}`);
  }
};
