/**
 * @file useSteps.ts
 * @description Hook para el conteo de pasos diarios.
 *
 * Proporciona una interfaz para leer y modificar manualmente los pasos
 * del día actual. Actualmente es un stub (sin integración con podómetro
 * real del dispositivo), pero está preparado para conectarse con una
 * API nativa en el futuro (ej: Capacitor + HealthKit/Google Fit).
 *
 * Los pasos se persisten en DailyMetrics.stepsToday y se usan para
 * la regla de tokens de 10,000 pasos (+5 tokens).
 */

import { useState, useCallback } from "react";
import { getMetrics, saveMetrics, getToday } from "../lib/storage";

/**
 * Hook para gestionar los pasos del día.
 *
 * @returns {Object} Estado y funciones:
 *   - `stepsToday`: número de pasos registrados hoy
 *   - `setManualSteps`: función para establecer manualmente el conteo de pasos
 *
 * @example
 * const { stepsToday, setManualSteps } = useSteps();
 * setManualSteps(12500); // Registrar 12,500 pasos
 */
export function useSteps() {
  const todayKey = getToday();
  const [stepsToday, setStepsToday] = useState(() => {
    return getMetrics(todayKey).stepsToday;
  });

  /** Establece manualmente el conteo de pasos y lo persiste en métricas */
  const setManualSteps = useCallback(
    (steps: number) => {
      const m = getMetrics(todayKey);
      m.stepsToday = steps;
      saveMetrics(m);
      setStepsToday(steps);
    },
    [todayKey],
  );

  return { stepsToday, setManualSteps };
}
