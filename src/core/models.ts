/**
 * @file models.ts
 * @description Modelos de datos compartidos por toda la aplicación.
 *
 * Define las interfaces para el temporizador, notificaciones, listas de bloqueo,
 * y configuración del usuario. Los tipos de métricas y tokens están en `lib/storage.ts`.
 */

// ── Temporizador (Focus Timer) ─────────────────────────────────────────

/** Fase del temporizador: "FOCUS" (enfoque) o "BREAK" (descanso) */
export type TimerPhase = "FOCUS" | "BREAK";

/**
 * Estado completo del temporizador Pomodoro.
 * Se persiste en localStorage para sobrevivir recargas de página.
 */
export interface TimerState {
  /** Si el temporizador está corriendo */
  isActive: boolean;
  /** Fase actual: enfoque o descanso */
  phase: TimerPhase;
  /** Timestamp (ms) de cuándo se inició la cuenta */
  startAtMs: number | null;
  /** Timestamp (ms) de cuándo se pausó (null si no está pausado) */
  pausedAtMs: number | null;
  /** Milisegundos acumulados en pausa durante la sesión actual */
  accumulatedPausedMs: number;
  /** Duración total configurada para esta fase (ms) */
  durationMs: number;
  /** Etiqueta de la sesión (ej: "Estudio", "Trabajo") */
  label: string;
}

// ── Notificaciones ─────────────────────────────────────────────────────

/** Tipo de notificación: Pomodoro, Desafío, Sistema, Advertencia */
export type NotificationType = "POMODORO" | "CHALLENGE" | "SYSTEM" | "WARNING";

/**
 * Elemento de notificación mostrado en el centro de notificaciones.
 */
export interface NotificationItem {
  /** Identificador único */
  id: string;
  /** Tipo de notificación */
  type: NotificationType;
  /** Título de la notificación */
  title: string;
  /** Cuerpo/contenido del mensaje */
  body: string;
  /** Timestamp de creación */
  createdAt: number;
  /** Timestamp de lectura (undefined si no leída) */
  readAt?: number;
}

// Re-exportar TokenLedgerEntry desde su ubicación canónica
export type { TokenLedgerEntry } from "../lib/storage";

// ── Listas de Bloqueo ──────────────────────────────────────────────────

/**
 * Aplicación bloqueada por el usuario.
 */
export interface BlockedApp {
  id: string;
  /** Nombre visible de la app */
  name: string;
  /** Nombre del paquete Android (opcional, para integración nativa) */
  packageName?: string;
}

/**
 * URL bloqueada por el usuario.
 */
export interface BlockedUrl {
  id: string;
  /** Etiqueta visible (ej: "Instagram") */
  label: string;
  /** URL completa bloqueada */
  url: string;
}

// ── Configuración ──────────────────────────────────────────────────────

/**
 * Modelo de configuración del usuario.
 * Controla qué desafíos están activos y sus umbrales.
 */
export interface SettingsModel {
  /** Desafíos activados/desactivados */
  challenges: {
    /** Desafío de tiempo de pantalla */
    screenTime: boolean;
    /** Desafío de número de recogidas */
    pickupTimes: boolean;
    /** Desafío de dormir más */
    sleepMore: boolean;
    /** Desafío de uso continuo */
    continuousUse: boolean;
    /** Desafío de no usar mientras caminas */
    noWalkingGame: boolean;
    /** Informe diario automático */
    dailyReport: boolean;
  };
  /** Límite de recogidas diarias para el desafío */
  pickupLimit: number;
  /** Máximo de horas de uso continuo antes de alerta */
  continuousUseMaxHours: number;
  /** Minutos de bloqueo cuando se excede el uso continuo */
  continuousUseLockMinutes: number;
}

/** Configuración por defecto (todos los desafíos desactivados) */
export const defaultSettings: SettingsModel = {
  challenges: {
    screenTime: false,
    pickupTimes: false,
    sleepMore: false,
    continuousUse: false,
    noWalkingGame: false,
    dailyReport: false,
  },
  pickupLimit: 50,
  continuousUseMaxHours: 2,
  continuousUseLockMinutes: 30,
};
