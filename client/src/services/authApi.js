import apiClient from "./apiClient";

export const authApi = {
  register(payload) {
    return apiClient.post("/auth/register", payload);
  },
  sendVerificationOtp(payload) {
    return apiClient.post("/auth/send-verification-otp", payload);
  },
  verifyEmailOtp(payload) {
    return apiClient.post("/auth/verify-email-otp", payload);
  },
  resendVerificationOtp(payload) {
    return apiClient.post("/auth/resend-verification-otp", payload);
  },
  login(payload) {
    return apiClient.post("/auth/login", payload);
  },
  me() {
    return apiClient.get("/auth/me");
  },
  requestPasswordReset(payload) {
    return apiClient.post("/auth/forgot-password", payload);
  },
  validateResetToken(payload) {
    return apiClient.post("/auth/validate-reset-token", payload);
  },
  resetPassword(payload) {
    return apiClient.post("/auth/reset-password", payload);
  },
  googleLogin(payload) {
    return apiClient.post("/auth/google", payload);
  },
  logout() {
    return apiClient.post("/auth/logout");
  }
};
