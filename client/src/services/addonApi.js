import apiClient from "./apiClient";

export const addonApi = {
  getPublic() {
    return apiClient.get("/addons");
  },
  getAdmin() {
    return apiClient.get("/admin/addons");
  },
  create(payload) {
    return apiClient.post("/admin/addons", payload);
  },
  update(id, payload) {
    return apiClient.put(`/admin/addons/${id}`, payload);
  },
  remove(id) {
    return apiClient.delete(`/admin/addons/${id}`);
  }
};
