import { getMetrics, type TokenRewardResult } from "../../lib/storage";
import { storage } from "../storage/userStorage";

const EVALUATED_KEY_PREFIX = "dailyTokensEvaluated:";

/**
 * Evaluate end-of-day token rewards for a given date.
 * Each rule is checked independently. Returns an array of rewards to apply.
 * Includes deduplication: calling this multiple times for the same date is safe.
 */
export function evaluateDailyTokenRewards(
  dateKey: string,
): TokenRewardResult[] {
  // Deduplication: only evaluate once per date
  const evalKey = EVALUATED_KEY_PREFIX + dateKey;
  if (storage.get<boolean>(evalKey, false)) {
    return [];
  }

  const m = getMetrics(dateKey);
  const rewards: TokenRewardResult[] = [];

  // Rule (a): Focus sessions — 1 token per completed 25-min session
  // Already handled real-time in TimerEngine.finishSession().
  // We skip it here to avoid double-awarding.

  // Rule (b): Less than 50 pickups → +2 tokens
  if (m.pickups > 0 && m.pickups < 50) {
    rewards.push({
      rule: "low_pickups",
      amount: 2,
      reason: `Menos de 50 recogidas (${m.pickups}) el ${dateKey}`,
    });
  }

  // Rule (c): 10,000+ steps → +5 tokens
  if (m.stepsToday >= 10000) {
    rewards.push({
      rule: "steps_10k",
      amount: 5,
      reason: `10,000+ pasos (${m.stepsToday}) el ${dateKey}`,
    });
  }

  // Rule (d): Less than 5 hours total screen time → +1 token
  const screenHours = m.screenActiveMs / 3600000;
  if (m.screenActiveMs > 0 && screenHours < 5) {
    rewards.push({
      rule: "low_screen_time",
      amount: 1,
      reason: `Menos de 5h de pantalla (${screenHours.toFixed(1)}h) el ${dateKey}`,
    });
  }

  // Mark as evaluated (even if no rewards given)
  storage.set(evalKey, true);

  return rewards;
}
