const USER_KEY = "modern_studio_admin_user";

export const authStore = {
  getUser() {
    const value = localStorage.getItem(USER_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },
  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearUser() {
    localStorage.removeItem(USER_KEY);
  }
};
