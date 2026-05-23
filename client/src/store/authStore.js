import { secureStorage } from "../utils/secureStorage";

/**
 * Admin Auth Store
 * Uses secure storage for non-sensitive user profile data
 * Authentication tokens are stored in httpOnly cookies on the server
 */
export const authStore = {
  getUser() {
    return secureStorage.admin.get();
  },
  setUser(user) {
    secureStorage.admin.set(user);
  },
  clearUser() {
    secureStorage.admin.clear();
  }
};
