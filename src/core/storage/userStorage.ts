/**
 * @file userStorage.ts
 * @description Almacenamiento con namespace por usuario.
 *
 * Proporciona un wrapper sobre `localStorage` que antepone automáticamente
 * el prefijo `timelock:{userId}:` a todas las claves. Esto permite que
 * múltiples usuarios compartan el mismo navegador sin conflictos de datos.
 *
 * Por defecto usa el usuario "guest" si no hay sesión activa.
 */

/** Clave donde se almacena el ID del usuario actual */
export const USER_ID_KEY = "timelock_current_userid";

/** ID del usuario invitado (cuando no hay login) */
export const GUEST_USER_ID = "guest";

/**
 * Obtiene el ID del usuario actual desde localStorage.
 * Si no existe, establece "guest" como valor por defecto.
 *
 * En una app con autenticación real, este valor se establece
 * al hacer login exitoso.
 *
 * @returns ID del usuario actual
 */
export const getCurrentUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = GUEST_USER_ID;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

/**
 * Establece el ID del usuario actual.
 * @param userId - Nuevo ID de usuario
 */
export const setCurrentUserId = (userId: string) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

/**
 * Crea una clave con namespace para el usuario actual.
 * Formato resultante: `timelock:{userId}:{key}`
 *
 * @param key - Clave base (ej: "metrics:2026-03-03")
 * @returns Clave con namespace (ej: "timelock:guest:metrics:2026-03-03")
 */
export const getUserStorageKey = (key: string): string => {
  const userId = getCurrentUserId();
  return `timelock:${userId}:${key}`;
};

/**
 * Helpers genéricos de almacenamiento que usan automáticamente
 * el namespace del usuario actual. Serializan/deserializan JSON.
 */
export const storage = {
  /**
   * Lee un valor del almacenamiento con namespace.
   * @param key - Clave base
   * @param defaultValue - Valor por defecto si no existe la clave
   * @returns Valor deserializado o defaultValue
   */
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const namespacedKey = getUserStorageKey(key);
      const item = localStorage.getItem(namespacedKey);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error leyendo clave "${key}" del almacenamiento:`, error);
      return defaultValue;
    }
  },

  /**
   * Escribe un valor al almacenamiento con namespace.
   * @param key - Clave base
   * @param value - Valor a serializar y guardar
   */
  set: <T>(key: string, value: T): void => {
    try {
      const namespacedKey = getUserStorageKey(key);
      localStorage.setItem(namespacedKey, JSON.stringify(value));
    } catch (error) {
      console.error(
        `Error escribiendo clave "${key}" al almacenamiento:`,
        error,
      );
    }
  },

  /**
   * Elimina un valor del almacenamiento con namespace.
   * @param key - Clave base a eliminar
   */
  remove: (key: string): void => {
    try {
      const namespacedKey = getUserStorageKey(key);
      localStorage.removeItem(namespacedKey);
    } catch (error) {
      console.error(
        `Error eliminando clave "${key}" del almacenamiento:`,
        error,
      );
    }
  },
};

/**
 * Genera un ID aleatorio único combinando caracteres aleatorios y timestamp.
 * @returns String alfanumérico único
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD.
 * @returns String con la fecha actual
 */
export const getTodayDateKey = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
