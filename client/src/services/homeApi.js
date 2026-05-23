import apiClient from "./apiClient";

export const homeApi = {
  getPublic() {
    return apiClient.get("/home");
  },
  getAdmin() {
    return apiClient.get("/admin/home");
  },
  update(payload) {
    return apiClient.put("/admin/home", payload);
  }
};
