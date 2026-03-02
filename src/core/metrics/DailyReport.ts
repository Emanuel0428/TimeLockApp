import { getMetrics, formatMs } from "../../lib/storage";
import { storage } from "../storage/userStorage";
import { NotificationService } from "../notifications/NotificationService";
import { ChallengesEngine } from "../challenges/ChallengesEngine";

const REPORT_SENT_KEY_PREFIX = "daily_report_sent_";

/**
 * Programa o envía el reporte diario de métricas.
 * - Si la app está abierta a las 5 AM, se envía automáticamente.
 * - Si la app se abre después de las 5 AM, se envía un catch-up (si aún no se envió).
 */
export class DailyReport {
  private static timeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Calcula la fecha de "ayer" en formato YYYY-MM-DD.
   */
  private static getYesterdayKey(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  /**
   * Envía el reporte diario del día anterior, si no se ha enviado aún.
   */
  static sendReport() {
    const yesterdayKey = this.getYesterdayKey();
    const sentKey = REPORT_SENT_KEY_PREFIX + yesterdayKey;

    if (storage.get<boolean>(sentKey, false)) {
      return; // Ya se envió hoy
    }

    const metrics = getMetrics(yesterdayKey);

    const totalFocusMs = metrics.focusSessions.reduce(
      (s, f) => s + f.duration,
      0,
    );
    const focusCount = metrics.focusSessions.length;

    const body = [
      `📊 Resumen del ${yesterdayKey}:`,
      `• Tiempo total (app abierta): ${formatMs(metrics.appOpenMs)}`,
      `• Tiempo en pantalla (visible): ${formatMs(metrics.screenActiveMs)}`,
      `• Recogidas: ${metrics.pickups}`,
      `• Sesiones de enfoque: ${focusCount} (${formatMs(totalFocusMs)})`,
      `• Tokens acumulados: ${metrics.tokens}`,
    ].join("\n");

    NotificationService.send("Informe Diario", {
      body,
      type: "SYSTEM",
    });

    // También evaluar los desafíos del día anterior
    ChallengesEngine.evaluateDaily(yesterdayKey);

    // Marcar como enviado
    storage.set(sentKey, true);
  }

  /**
   * Inicializa el scheduler.
   * - Verifica si hay un catch-up pendiente (ya pasó las 5 AM hoy sin reporte).
   * - Programa un setTimeout para las próximas 5 AM.
   */
  static initialize() {
    const now = new Date();
    const sentKey = REPORT_SENT_KEY_PREFIX + this.getYesterdayKey();
    const alreadySent = storage.get<boolean>(sentKey, false);

    // Catch-up: si ya pasaron las 5 AM y no se envió
    if (now.getHours() >= 5 && !alreadySent) {
      this.sendReport();
    }

    // Programar para las próximas 5 AM
    this.scheduleNext5AM();
  }

  private static scheduleNext5AM() {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    const now = new Date();
    const next5AM = new Date(now);
    next5AM.setHours(5, 0, 0, 0);

    if (now >= next5AM) {
      next5AM.setDate(next5AM.getDate() + 1);
    }

    const msUntil5AM = next5AM.getTime() - now.getTime();

    this.timeoutId = setTimeout(() => {
      this.sendReport();
      // Re-schedule for the next day
      this.scheduleNext5AM();
    }, msUntil5AM);
  }
}
