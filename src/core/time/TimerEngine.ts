import type { TimerState } from "../models";
import { storage } from "../storage/userStorage";
import { NotificationService } from "../notifications/NotificationService";
import {
  addFocusSession,
  addLedgerEntry,
  uid,
  type FocusSession,
} from "../../lib/storage";

const TIMER_STATE_KEY = "timerState";
const FOCUS_MS = 25 * 60 * 1000;
const BREAK_MS = 5 * 60 * 1000;

class TimerEngineEvents {
  private listeners: ((state: TimerState) => void)[] = [];

  subscribe(listener: (state: TimerState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(state: TimerState) {
    this.listeners.forEach((l) => l(state));
  }
}

export class TimerEngine {
  private static state: TimerState;
  private static events = new TimerEngineEvents();
  private static intervalId: number | null = null;

  static initialize() {
    this.state = storage.get<TimerState>(TIMER_STATE_KEY, {
      isActive: false,
      phase: "FOCUS",
      startAtMs: null,
      pausedAtMs: null,
      accumulatedPausedMs: 0,
      durationMs: FOCUS_MS,
      label: "Estudio",
    });

    if (this.state.isActive) {
      this.startTick();
    }

    // Sync across tabs
    window.addEventListener("storage", (e) => {
      if (
        e.key ===
          `timelock:${storage.get("timelock_current_userid", "guest")}:${TIMER_STATE_KEY}` ||
        e.key === TIMER_STATE_KEY
      ) {
        // Just reload state and notify listeners
        try {
          if (e.newValue) {
            this.state = JSON.parse(e.newValue);
            if (this.state.isActive) {
              this.startTick();
            } else {
              this.stopTick();
            }
            this.events.notify(this.state);
          }
        } catch (err) {}
      }
    });
  }

  static subscribe(listener: (state: TimerState) => void) {
    return this.events.subscribe(listener);
  }

  static getState(): TimerState {
    return { ...this.state };
  }

  private static saveState() {
    storage.set(TIMER_STATE_KEY, this.state);
    this.events.notify(this.state);
  }

  static start(label: string = "Estudio") {
    if (this.state.isActive) return;

    if (this.state.pausedAtMs) {
      // Resuming
      const pauseDuration = Date.now() - this.state.pausedAtMs;
      this.state.accumulatedPausedMs += pauseDuration;
      this.state.pausedAtMs = null;
    } else {
      // Fresh start
      this.state.startAtMs = Date.now();
      this.state.accumulatedPausedMs = 0;
      this.state.label = label;
      // Keep current phase and duration
    }

    this.state.isActive = true;
    this.saveState();
    this.startTick();
  }

  static pause() {
    if (!this.state.isActive) return;

    this.state.isActive = false;
    this.state.pausedAtMs = Date.now();
    this.saveState();
    this.stopTick();
  }

  static reset() {
    this.state = {
      isActive: false,
      phase: "FOCUS",
      startAtMs: null,
      pausedAtMs: null,
      accumulatedPausedMs: 0,
      durationMs: FOCUS_MS,
      label: this.state.label,
    };
    this.saveState();
    this.stopTick();
  }

  static addTime(minutes: number) {
    this.state.durationMs += minutes * 60 * 1000;
    this.saveState();
  }

  static finishSession() {
    this.state.isActive = false;
    const sessionEnd = Date.now();
    const sessionStart = this.state.startAtMs || sessionEnd;
    const durationMs =
      sessionEnd - sessionStart - this.state.accumulatedPausedMs;

    this.state.startAtMs = null;
    this.state.pausedAtMs = null;
    this.state.accumulatedPausedMs = 0;

    if (this.state.phase === "FOCUS") {
      // Registrar la sesión y tokens antes de cambiar de fase
      if (durationMs > 0) {
        const session: FocusSession = {
          id: uid(),
          start: sessionStart,
          end: sessionEnd,
          duration: durationMs,
          label: this.state.label,
          color: "#4B6FA7", // Default or make it part of state
        };
        addFocusSession(session);

        const tokensEarned = Math.floor(durationMs / (25 * 60 * 1000));
        if (tokensEarned > 0) {
          addLedgerEntry({
            id: uid(),
            timestamp: Date.now(),
            type: "earn",
            amount: tokensEarned,
            reason: `Sesión de enfoque: ${this.state.label} (${Math.round(durationMs / 60000)}m)`,
          });
        }
      }

      this.state.phase = "BREAK";
      this.state.durationMs = BREAK_MS;
      NotificationService.send("¡Modo Descanso!", {
        body: "Es momento de tomarte 5 minutos de descanso.",
        type: "POMODORO",
      });
      // auto-start break
      this.start(this.state.label);
    } else {
      this.state.phase = "FOCUS";
      this.state.durationMs = FOCUS_MS;
      NotificationService.send("¡Fin del descanso!", {
        body: "Vuelve a concentrarte.",
        type: "POMODORO",
      });
      this.saveState();
      this.stopTick(); // Requires manual start for next focus session
    }
  }

  static getRemainingMs(): number {
    if (!this.state.startAtMs) {
      return this.state.durationMs;
    }

    const now = this.state.pausedAtMs || Date.now();
    const elapsed = now - this.state.startAtMs - this.state.accumulatedPausedMs;
    const remaining = this.state.durationMs - elapsed;

    return Math.max(0, remaining);
  }

  private static startTick() {
    if (this.intervalId) return;
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  private static stopTick() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private static tick() {
    if (!this.state.isActive) return;

    const remaining = this.getRemainingMs();
    if (remaining <= 0) {
      this.finishSession();
    } else {
      // Just notify listeners so UI can update the clock
      this.events.notify(this.state);
    }
  }
}
