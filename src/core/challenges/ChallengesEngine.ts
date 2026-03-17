import { getMetrics, getToday, saveMetrics } from "../../lib/storage";
import { storage } from "../storage/userStorage";
import { TokenService } from "../tokens/TokenService";
import { NotificationService } from "../notifications/NotificationService";
import { defaultSettings, type SettingsModel } from "../models";

interface ChallengeReward {
  amount: number;
  reason: string;
}

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

    const settings = storage.get<SettingsModel>("settings", defaultSettings);
    if (!settings) return;

    const metrics = getMetrics(dateKey);
    const rewards: ChallengeReward[] = [];

    // 1. Pickup Limit Challenge
    if (settings.challenges.pickupTimes) {
      if (metrics.pickups <= settings.pickupLimit) {
        rewards.push({
          amount: 2,
          reason: "Desafío completado: recogidas de pantalla bajo el límite",
        });
      }
    }

    // 2. Continuous Use Challenge (e.g. max continuous use never exceeded the configured limit)
    if (settings.challenges.continuousUse) {
      const maxMsAllowed = settings.continuousUseMaxHours * 3600 * 1000;
      if (metrics.continuousMaxMs <= maxMsAllowed) {
        rewards.push({
          amount: 1,
          reason: "Desafío completado: no excediste el uso continuo máximo",
        });
      }
    }

    // 3. Screen Time Challenge
    if (settings.challenges.screenTime) {
      // In a real scenario, compare today vs average
      // For the prototype: just a dummy check if active < 5 hours
      if (metrics.screenActiveMs < 5 * 3600 * 1000) {
        rewards.push({
          amount: 1,
          reason: "Desafío completado: redujiste tu tiempo en pantalla",
        });
      }
    }

    const earnedTokens = rewards.reduce((sum, reward) => sum + reward.amount, 0);

    if (earnedTokens > 0) {
      for (const reward of rewards) {
        TokenService.earnTokens(reward.amount, reward.reason);
      }

      // Persist challenge rewards in daily metrics to keep historical totals aligned.
      metrics.tokens += earnedTokens;
      saveMetrics(metrics);

      const reasonsPreview = rewards
        .map((r) => `• ${r.reason.replace("Desafío completado: ", "")}`)
        .join("\n");

      NotificationService.send("¡Retos del día superados!", {
        body: `Has ganado ${earnedTokens} token${earnedTokens === 1 ? "" : "s"}.\n${reasonsPreview}`,
        type: "CHALLENGE",
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
