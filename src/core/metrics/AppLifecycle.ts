import { getMetrics, getToday, saveMetrics } from "../../lib/storage";

/**
 * Tracks app open time and visibility time.
 * - appOpenMs: total time since the tab was opened (includes background)
 * - appVisibleMs: total time the tab was visible/focused
 */
export class AppLifecycle {
  private static sessionStartMs: number = 0;
  private static visibleStartMs: number = 0;
  private static accumulatedVisibleMs: number = 0;
  private static isVisible: boolean = true;

  static initialize() {
    this.sessionStartMs = Date.now();
    this.visibleStartMs = Date.now();
    this.isVisible = true;
    this.accumulatedVisibleMs = 0;

    // Listen for visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.onHidden();
      } else {
        this.onVisible();
      }
    });

    // Save on unload
    window.addEventListener("beforeunload", () => {
      this.persistMetrics();
    });

    // Also persist periodically (every 60s)
    setInterval(() => {
      this.persistMetrics();
    }, 60000);
  }

  private static onHidden() {
    if (this.isVisible) {
      this.accumulatedVisibleMs += Date.now() - this.visibleStartMs;
      this.isVisible = false;
    }
  }

  private static onVisible() {
    if (!this.isVisible) {
      this.visibleStartMs = Date.now();
      this.isVisible = true;
    }
  }

  static getAppOpenMs(): number {
    return Date.now() - this.sessionStartMs;
  }

  static getAppVisibleMs(): number {
    let total = this.accumulatedVisibleMs;
    if (this.isVisible) {
      total += Date.now() - this.visibleStartMs;
    }
    return total;
  }

  private static lastAppOpenPersistMs: number = 0;

  private static persistMetrics() {
    const todayKey = getToday();
    const metrics = getMetrics(todayKey);

    // Add the new visible time from this session
    metrics.screenActiveMs += this.getAppVisibleMs();

    // Add elapsed appOpen time since last persist
    const currentAppOpenMs = this.getAppOpenMs();
    const appOpenDelta = currentAppOpenMs - this.lastAppOpenPersistMs;
    if (appOpenDelta > 0) {
      metrics.appOpenMs += appOpenDelta;
      this.lastAppOpenPersistMs = currentAppOpenMs;
    }

    // Reset visible accumulators so we don't double count
    this.accumulatedVisibleMs = 0;
    if (this.isVisible) {
      this.visibleStartMs = Date.now();
    }

    saveMetrics(metrics);
  }

  /**
   * Call this to register a "pickup" (app open event).
   * Should be called once per distinct app opening.
   */
  static registerPickup() {
    const todayKey = getToday();
    const metrics = getMetrics(todayKey);
    metrics.pickups += 1;
    saveMetrics(metrics);
  }
}
