/**
 * Secure Storage Utility
 * Provides secure storage operations with XSS protection considerations
 */

// Storage keys
const STORAGE_KEYS = {
  USER: "modern_studio_user",
  ADMIN_USER: "modern_studio_admin_user",
  REDIRECT: "redirectAfterLogin"
};

/**
 * Safely parse JSON from storage
 * @param {string} value - Value to parse
 * @returns {any|null} Parsed value or null
 */
const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse storage value:", error.message);
    return null;
  }
};

/**
 * Check if storage is available
 * @param {string} type - 'localStorage' or 'sessionStorage'
 * @returns {boolean}
 */
const isStorageAvailable = (type) => {
  try {
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Secure user storage operations
 * Note: For maximum security, sensitive data should be in httpOnly cookies
 * This storage is for non-sensitive user profile data only
 */
export const secureStorage = {
  // User storage (non-sensitive profile data only)
  user: {
    get() {
      if (!isStorageAvailable("localStorage")) return null;
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return safeParse(data);
    },
    set(user) {
      if (!isStorageAvailable("localStorage")) return;
      // Only store non-sensitive data
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified
      };
      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
      } catch (error) {
        console.error("Failed to store user data:", error.message);
      }
    },
    clear() {
      if (!isStorageAvailable("localStorage")) return;
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  // Admin user storage
  admin: {
    get() {
      if (!isStorageAvailable("localStorage")) return null;
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
      return safeParse(data);
    },
    set(user) {
      if (!isStorageAvailable("localStorage")) return;
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(safeUser));
      } catch (error) {
        console.error("Failed to store admin data:", error.message);
      }
    },
    clear() {
      if (!isStorageAvailable("localStorage")) return;
      localStorage.removeItem(STORAGE_KEYS.ADMIN_USER);
    }
  },

  // Session storage for temporary data
  session: {
    getRedirect() {
      if (!isStorageAvailable("sessionStorage")) return null;
      const data = sessionStorage.getItem(STORAGE_KEYS.REDIRECT);
      return data;
    },
    setRedirect(path) {
      if (!isStorageAvailable("sessionStorage")) return;
      try {
        sessionStorage.setItem(STORAGE_KEYS.REDIRECT, path);
      } catch (error) {
        console.error("Failed to store redirect:", error.message);
      }
    },
    clearRedirect() {
      if (!isStorageAvailable("sessionStorage")) return;
      sessionStorage.removeItem(STORAGE_KEYS.REDIRECT);
    }
  },

  // Clear all storage
  clearAll() {
    this.user.clear();
    this.admin.clear();
    this.session.clearRedirect();
  }
};

/**
 * Update existing auth stores to use secure storage
 * This maintains backward compatibility
 */
export const updateAuthStore = (store) => ({
  getUser() {
    return store.get();
  },
  setUser(user) {
    store.set(user);
  },
  clearUser() {
    store.clear();
  }
});

export default secureStorage;