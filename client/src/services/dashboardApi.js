import apiClient from "./apiClient";

export const dashboardApi = {
  getStats() {
    return apiClient.get("/admin/dashboard/stats");
  }
};
