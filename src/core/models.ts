export type TimerPhase = "FOCUS" | "BREAK";

export interface TimerState {
  isActive: boolean;
  phase: TimerPhase;
  startAtMs: number | null;
  pausedAtMs: number | null;
  accumulatedPausedMs: number;
  durationMs: number;
  label: string;
}

export type NotificationType = "POMODORO" | "CHALLENGE" | "SYSTEM" | "WARNING";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: number;
  readAt?: number;
}

// Re-export TokenLedgerEntry from canonical location
export type { TokenLedgerEntry } from "../lib/storage";

export interface BlockedApp {
  id: string;
  name: string;
  packageName?: string;
}

export interface BlockedUrl {
  id: string;
  label: string;
  url: string;
}

export interface SettingsModel {
  challenges: {
    screenTime: boolean;
    pickupTimes: boolean;
    sleepMore: boolean;
    continuousUse: boolean;
    noWalkingGame: boolean;
    dailyReport: boolean;
  };
  pickupLimit: number;
  continuousUseMaxHours: number;
  continuousUseLockMinutes: number;
}

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
