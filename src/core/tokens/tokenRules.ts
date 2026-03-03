/**
 * @file tokenRules.ts
 * @description Motor de reglas para ganancia de tokens al final del día.
 *
 * Evalúa las métricas de un día y determina qué recompensas de tokens
 * se deben otorgar. Incluye deduplicación para evitar evaluaciones repetidas.
 *
 * Reglas implementadas:
 * - (a) Sesiones de enfoque: manejado en tiempo real por TimerEngine (no se evalúa aquí)
 * - (b) Menos de 50 recogidas → +2 tokens
 * - (c) 10,000+ pasos → +5 tokens
 * - (d) Menos de 5h de pantalla → +1 token
 * - (e) Reglas existentes (rachas, caminata) → preservadas en MetricsContext
 */

import { getMetrics, type TokenRewardResult } from "../../lib/storage";
import { storage } from "../storage/userStorage";

/** Prefijo para las claves de deduplicación (una por fecha evaluada) */
const EVALUATED_KEY_PREFIX = "dailyTokensEvaluated:";

/**
 * Evalúa las recompensas de tokens correspondientes a un día.
 *
 * Cada regla se verifica de forma independiente. La función es idempotente:
 * llamarla múltiples veces para la misma fecha es seguro gracias a la
 * clave de deduplicación `dailyTokensEvaluated:YYYY-MM-DD`.
 *
 * Se invoca desde `DailyReport.sendReport()` al generar el informe del día anterior.
 *
 * @param dateKey - Fecha a evaluar en formato YYYY-MM-DD
 * @returns Array de recompensas a aplicar (vacío si ya fue evaluado)
 */
export function evaluateDailyTokenRewards(
  dateKey: string,
): TokenRewardResult[] {
  // Deduplicación: solo evaluar una vez por fecha
  const evalKey = EVALUATED_KEY_PREFIX + dateKey;
  if (storage.get<boolean>(evalKey, false)) {
    return [];
  }

  const m = getMetrics(dateKey);
  const rewards: TokenRewardResult[] = [];

  // Regla (a): Sesiones de enfoque — 1 token por sesión de 25 min
  // Ya se maneja en tiempo real en TimerEngine.finishSession().
  // Se omite aquí para evitar doble premiación.

  // Regla (b): Menos de 50 recogidas del teléfono → +2 tokens
  if (m.pickups > 0 && m.pickups < 50) {
    rewards.push({
      rule: "low_pickups",
      amount: 2,
      reason: `Menos de 50 recogidas (${m.pickups}) el ${dateKey}`,
    });
  }

  // Regla (c): 10,000+ pasos en el día → +5 tokens
  if (m.stepsToday >= 10000) {
    rewards.push({
      rule: "steps_10k",
      amount: 5,
      reason: `10,000+ pasos (${m.stepsToday}) el ${dateKey}`,
    });
  }

  // Regla (d): Menos de 5 horas de tiempo de pantalla → +1 token
  const screenHours = m.screenActiveMs / 3600000;
  if (m.screenActiveMs > 0 && screenHours < 5) {
    rewards.push({
      rule: "low_screen_time",
      amount: 1,
      reason: `Menos de 5h de pantalla (${screenHours.toFixed(1)}h) el ${dateKey}`,
    });
  }

  // Marcar como evaluado (incluso si no hubo recompensas)
  storage.set(evalKey, true);

  return rewards;
}
