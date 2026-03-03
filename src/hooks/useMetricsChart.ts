import { useMemo } from "react";
import { useMetrics } from "../context/MetricsContext";
import { formatDateKey, getMetrics, type DailyMetrics } from "../lib/storage";
import { storage } from "../core/storage/userStorage";
import {
  type TabType,
  dayLabels,
  monthLabels,
  daysInMonth,
  weekRangeLabel,
} from "../lib/dateHelpers";
import { formatHour12 } from "../core/time/formatHour12";

// ── Options ────────────────────────────────────────────────────────────

interface UseMetricsChartOptions {
  currentDate: Date;
  activeTab: TabType;
  /** Extract the numeric value from DailyMetrics (e.g. m => m.pickups) */
  metricExtractor: (m: DailyMetrics) => number;
  /** Extract hourly array for "Día" tab (24 values). If not provided, falls back to distribution. */
  hourlyExtractor?: (m: DailyMetrics) => number[];
  /** localStorage key for the historical max-Y */
  maxYStorageKey: string;
  /** Minimum max-Y so the chart never has a zero scale */
  defaultMaxY: number;
}

interface ChartResult {
  labels: string[];
  values: number[];
  maxY: number;
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useMetricsChart({
  currentDate,
  activeTab,
  metricExtractor,
  hourlyExtractor,
  maxYStorageKey,
  defaultMaxY,
}: UseMetricsChartOptions): ChartResult {
  const { todayMetrics, getMetricsForDate } = useMetrics();

  const dateKey = formatDateKey(currentDate);
  const isToday = dateKey === formatDateKey(new Date());
  const dayMetrics = isToday ? todayMetrics : getMetricsForDate(dateKey);

  // Helper: resolve metrics for any date key (uses live todayMetrics when applicable)
  const resolve = (k: string): DailyMetrics => {
    const todayKey = formatDateKey(new Date());
    return k === todayKey ? todayMetrics : getMetricsForDate(k);
  };

  // ── Historical max-Y ────────────────────────────────────────────────
  const maxHistorical = useMemo(() => {
    const stored = storage.get<number>(maxYStorageKey, 0);
    const currentValue = metricExtractor(dayMetrics);
    if (currentValue > stored) {
      storage.set(maxYStorageKey, currentValue);
      return currentValue;
    }
    return Math.max(stored, defaultMaxY);
  }, [dayMetrics, maxYStorageKey, metricExtractor, defaultMaxY]);

  // ── Chart data by tab ───────────────────────────────────────────────
  const chartData = useMemo((): ChartResult => {
    if (activeTab === "Día") {
      // Use real hourly data if extractor provided
      if (hourlyExtractor) {
        const hourlyValues = hourlyExtractor(dayMetrics);
        // Show labels every 3 hours in 12h format
        const labels = Array.from({ length: 24 }, (_, i) =>
          i % 3 === 0 ? formatHour12(i) : "",
        );
        return { labels, values: hourlyValues, maxY: maxHistorical };
      }

      // Fallback: distribute daily total across active hours
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const totalValue = metricExtractor(dayMetrics);
      const activeHours = hours.filter((h) => h >= 8 && h <= 22);
      const perHour = totalValue / Math.max(1, activeHours.length);
      const values = hours.map((h) => (activeHours.includes(h) ? perHour : 0));
      return {
        labels: hours.map((h) => (h % 3 === 0 ? formatHour12(h) : "")),
        values,
        maxY: maxHistorical,
      };
    }

    if (activeTab === "Semana") {
      const dow = currentDate.getDay();
      const monday = new Date(currentDate);
      monday.setDate(monday.getDate() - ((dow + 6) % 7));
      const values = dayLabels.map((_, i) => {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        const k = formatDateKey(d);
        return metricExtractor(resolve(k));
      });
      return { labels: [...dayLabels], values, maxY: maxHistorical };
    }

    if (activeTab === "Mes") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const totalDays = daysInMonth(year, month);
      const weeksCount = Math.ceil(totalDays / 7);
      const labels: string[] = [];
      const values: number[] = [];

      for (let w = 0; w < weeksCount; w++) {
        labels.push(weekRangeLabel(year, month, w));
        let weekTotal = 0;
        let weekDays = 0;
        for (let d = w * 7; d < Math.min((w + 1) * 7, totalDays); d++) {
          const date = new Date(year, month, d + 1);
          const k = formatDateKey(date);
          weekTotal += metricExtractor(resolve(k));
          weekDays++;
        }
        values.push(weekDays > 0 ? weekTotal / weekDays : 0);
      }
      return { labels, values, maxY: maxHistorical };
    }

    // Año
    const year = currentDate.getFullYear();
    const values = monthLabels.map((_, monthIdx) => {
      const days = daysInMonth(year, monthIdx);
      let total = 0;
      for (let d = 1; d <= days; d++) {
        const date = new Date(year, monthIdx, d);
        const k = formatDateKey(date);
        const m = getMetrics(k);
        total += metricExtractor(m);
      }
      return days > 0 ? total / days : 0;
    });
    return { labels: [...monthLabels], values, maxY: maxHistorical };
  }, [
    activeTab,
    currentDate,
    dayMetrics,
    todayMetrics,
    getMetricsForDate,
    maxHistorical,
    metricExtractor,
    hourlyExtractor,
  ]);

  return chartData;
}

// ── Week stats helper ──────────────────────────────────────────────────

interface WeekStats {
  weekTotal: number;
  avg: number;
  minVal: number;
  maxVal: number;
}

export function useWeekStats(
  currentDate: Date,
  metricExtractor: (m: DailyMetrics) => number,
): WeekStats {
  const { todayMetrics, getMetricsForDate } = useMetrics();

  return useMemo(() => {
    const dow = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() - ((dow + 6) % 7));

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const k = formatDateKey(d);
      const m =
        k === formatDateKey(new Date()) ? todayMetrics : getMetricsForDate(k);
      return metricExtractor(m);
    });

    const weekTotal = weekData.reduce((s, v) => s + v, 0);
    const nonZero = weekData.filter((v) => v > 0);
    const avg = nonZero.length > 0 ? Math.round(weekTotal / nonZero.length) : 0;
    const minVal = nonZero.length > 0 ? Math.min(...nonZero) : 0;
    const maxVal = nonZero.length > 0 ? Math.max(...nonZero) : 0;

    return { weekTotal, avg, minVal, maxVal };
  }, [currentDate, todayMetrics, getMetricsForDate, metricExtractor]);
}
