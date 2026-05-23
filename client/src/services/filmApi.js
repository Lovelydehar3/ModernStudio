import apiClient from "./apiClient";

export const filmApi = {
  getPublic() {
    return apiClient.get("/films");
  },
  getAdmin() {
    return apiClient.get("/admin/films");
  },
  create(payload) {
    return apiClient.post("/admin/films", payload);
  },
  update(id, payload) {
    return apiClient.put(`/admin/films/${id}`, payload);
  },
  remove(id) {
    return apiClient.delete(`/admin/films/${id}`);
  }
};
