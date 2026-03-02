export const USER_ID_KEY = "timelock_current_userid";
export const GUEST_USER_ID = "guest";

/**
 * Ensures a user ID exists in localStorage. If none is found, it uses 'guest'.
 * In a real app with login, this would be set upon successful authentication.
 */
export const getCurrentUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = GUEST_USER_ID;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export const setCurrentUserId = (userId: string) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

/**
 * Helper to create a namespaced key for the current user.
 * Format: timelock:{userId}:{key}
 */
export const getUserStorageKey = (key: string): string => {
  const userId = getCurrentUserId();
  return `timelock:${userId}:${key}`;
};

/**
 * Generic storage helpers that automatically use the user namespace.
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const namespacedKey = getUserStorageKey(key);
      const item = localStorage.getItem(namespacedKey);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading key "${key}" from storage:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      const namespacedKey = getUserStorageKey(key);
      localStorage.setItem(namespacedKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing key "${key}" to storage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      const namespacedKey = getUserStorageKey(key);
      localStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(`Error removing key "${key}" from storage:`, error);
    }
  },
};

/**
 * Utility functions for IDs and Dates
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

export const getTodayDateKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
