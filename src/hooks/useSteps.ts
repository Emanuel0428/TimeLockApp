import { useState, useCallback } from "react";
import { getMetrics, saveMetrics, getToday } from "../lib/storage";

/**
 * Hook for step tracking. Currently a stub for web — ready for future
 * integration with a real pedometer API (e.g., via Capacitor plugin).
 *
 * For now, provides manual input and persists to DailyMetrics.stepsToday.
 */
export function useSteps() {
  const todayKey = getToday();
  const [stepsToday, setStepsToday] = useState(() => {
    return getMetrics(todayKey).stepsToday;
  });

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
