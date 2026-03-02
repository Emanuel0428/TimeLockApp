import { getMetrics, getToday } from "../../lib/storage";
import { storage } from "../storage/userStorage";
import { TokenService } from "../tokens/TokenService";
import { NotificationService } from "../notifications/NotificationService";
import type { SettingsModel } from "../models";

export class ChallengesEngine {
  /**
   * Ejecuta la evaluación de los desafíos diarios.
   * Usualmente se llama al final del día (11:59 PM) o en el primer login del día siguiente.
   */
  static evaluateDaily(dateKey: string = getToday()) {
    // Check if already evaluated
    const evaluatedKey = `evaluated_${dateKey}`;
    if (storage.get(evaluatedKey, false)) {
      return;
    }

    const settings = storage.get<SettingsModel>("settings");
    if (!settings) return;

    const metrics = getMetrics(dateKey);
    let earnedTokens = 0;
    const reasons: string[] = [];

    // 1. Pickup Limit Challenge
    if (settings.challenges.pickupTimes) {
      if (metrics.pickups <= settings.pickupLimit) {
        earnedTokens += 2;
        reasons.push("Mantuviste tus recogidas de pantalla bajo el límite.");
      }
    }

    // 2. Continuous Use Challenge (e.g. max continuous use never exceeded the configured limit)
    if (settings.challenges.continuousUse) {
      const maxMsAllowed = settings.continuousUseMaxHours * 3600 * 1000;
      if (metrics.continuousMaxMs <= maxMsAllowed) {
        earnedTokens += 1;
        reasons.push("No excediste el uso continuo máximo.");
      }
    }

    // 3. Screen Time Challenge
    if (settings.challenges.screenTime) {
      // In a real scenario, compare today vs average
      // For the prototype: just a dummy check if active < 5 hours
      if (metrics.screenActiveMs < 5 * 3600 * 1000) {
        earnedTokens += 1;
        reasons.push("Redujiste tu tiempo en pantalla.");
      }
    }

    if (earnedTokens > 0) {
      TokenService.earnTokens(earnedTokens, "Recompensa de Desafíos Diarios");

      NotificationService.send("¡Retos del día superados!", {
        body: `Has ganado ${earnedTokens} tokens. ${reasons[0]}`,
        type: "SYSTEM",
      });
    }

    // Mark as evaluated
    storage.set(evaluatedKey, true);
  }

  /**
   * Función de ayuda para la demo/pruebas.
   */
  static forceEvaluateToday() {
    storage.remove(`evaluated_${getToday()}`);
    this.evaluateDaily(getToday());
  }
}
