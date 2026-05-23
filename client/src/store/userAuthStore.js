import { secureStorage } from "../utils/secureStorage";

/**
 * User Auth Store
 * Uses secure storage for non-sensitive user profile data
 * Authentication tokens are stored in httpOnly cookies on the server
 */
export const userAuthStore = {
  getUser() {
    return secureStorage.user.get();
  },
  setUser(user) {
    secureStorage.user.set(user);
  },
  clearUser() {
    secureStorage.user.clear();
  }
};
