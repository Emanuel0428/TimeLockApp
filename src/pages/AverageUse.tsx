import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, BarChart3, Share2, X } from "lucide-react";
import Navbar from "../components/Navbar";
import DonutChart from "../components/DonutChart";
import StackedBarChart from "../components/StackedBarChart";
import MetricsBarChart from "../components/MetricsBarChart";
import { useMetrics } from "../context/MetricsContext";
import { formatDateKey, formatMs, type DailyMetrics } from "../lib/storage";
import { useMetricsChart, useWeekStats } from "../hooks/useMetricsChart";
import { type TabType, formatDateDisplay, dayLabels } from "../lib/dateHelpers";

const screenActiveExtractor = (m: DailyMetrics) => m.screenActiveMs / 3600000;
const screenActiveMsExtractor = (m: DailyMetrics) => m.screenActiveMs;
const screenActiveHourlyExtractor = (m: DailyMetrics) =>
  (m.hourly?.screenActiveMs ?? Array(24).fill(0)).map(
    (ms: number) => ms / 3600000,
  );

const AverageUse = () => {
  const navigate = useNavigate();
  const { todayMetrics, getMetricsForDate } = useMetrics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>("Semana");

  const dateKey = formatDateKey(currentDate);
  const isToday = dateKey === formatDateKey(new Date());
  const dayMetrics = isToday ? todayMetrics : getMetricsForDate(dateKey);

  const prevDay = useCallback(() => {
    setCurrentDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 1);
      return n;
    });
  }, []);
  const nextDay = useCallback(() => {
    setCurrentDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 1);
      return n;
    });
  }, []);

  // ─── Chart Data via shared hook ───────────────────────────────────
  const chartData = useMetricsChart({
    currentDate,
    activeTab,
    metricExtractor: screenActiveExtractor,
    hourlyExtractor: screenActiveHourlyExtractor,
    maxYStorageKey: "maxDailyHoursHistorical",
    defaultMaxY: 1,
  });

  // ─── Week stats ───────────────────────────────────────────────────
  const weekStats = useWeekStats(currentDate, screenActiveMsExtractor);

  // ─── Caption by tab ───────────────────────────────────────────────
  const caption = useMemo(() => {
    if (activeTab === "Día") return "Horas de uso por hora del día";
    if (activeTab === "Semana") return "Horas de uso por día de la semana";
    if (activeTab === "Mes") return "Promedio semanal de horas de uso";
    return "Promedio mensual de horas de uso";
  }, [activeTab]);

  // ─── Donut: today's time distribution ─────────────────────────────
  const donutSegments = useMemo(() => {
    const focusMs = dayMetrics.focusSessions.reduce(
      (s, f) => s + f.duration,
      0,
    );
    const screenOnly = Math.max(0, dayMetrics.screenActiveMs - focusMs);
    const backgroundMs = Math.max(
      0,
      dayMetrics.appOpenMs - dayMetrics.screenActiveMs,
    );
    return [
      {
        label: "Pantalla activa",
        value: screenOnly / 3600000,
        color: "#4B6FA7",
      },
      { label: "Enfoque", value: focusMs / 3600000, color: "#22D3EE" },
      {
        label: "En segundo plano",
        value: backgroundMs / 3600000,
        color: "#334155",
      },
    ];
  }, [dayMetrics]);

  // ─── Stacked weekly: screen vs focus ──────────────────────────────
  const stackedWeekData = useMemo(() => {
    const dow = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() - ((dow + 6) % 7));
    const screenVals: number[] = [];
    const focusVals: number[] = [];
    dayLabels.forEach((_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const k = formatDateKey(d);
      const m =
        k === formatDateKey(new Date()) ? todayMetrics : getMetricsForDate(k);
      const focusMs = m.focusSessions.reduce((s, f) => s + f.duration, 0);
      screenVals.push(Math.max(0, m.screenActiveMs - focusMs) / 3600000);
      focusVals.push(focusMs / 3600000);
    });
    return {
      labels: [...dayLabels],
      series: [
        { name: "Pantalla", values: screenVals, color: "#4B6FA7" },
        { name: "Enfoque", values: focusVals, color: "#22D3EE" },
      ],
    };
  }, [currentDate, todayMetrics, getMetricsForDate]);

  return (
    <>
      {/* Header */}
      <header className="header-page">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="btn-icon"
          >
            <ChevronLeft className="w-6 h-6 icon-primary" />
          </button>
          <h1 className="header-primary">Uso Regular</h1>
          <button className="btn-icon">
            <BarChart3 className="w-6 h-6 icon-brand" />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="px-4 bg-main safe-content">
        <div className="max-w-md mx-auto w-full">
          {/* Mensaje informativo */}
          <div className="mb-4 text-center">
            <p className="text-sm text-secondary">
              {dayMetrics.screenActiveMs > 0
                ? `Tiempo activo: ${formatMs(dayMetrics.screenActiveMs)}`
                : "No hay registros hoy"}
            </p>
          </div>

          {/* Navegación de fecha */}
          <div className="flex items-center justify-between mb-6 py-3">
            <button
              onClick={prevDay}
              className="btn-icon-brand"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="header-secondary">
              {formatDateDisplay(currentDate)}
            </h2>
            <button
              onClick={nextDay}
              className="btn-icon-brand"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["Día", "Semana", "Mes", "Año"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? "tab-active" : "tab-inactive"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Gráfico via shared component */}
          <MetricsBarChart
            labels={chartData.labels}
            values={chartData.values}
            maxY={chartData.maxY}
            yUnit="h"
            caption={caption}
            activeTab={activeTab}
            yMaxLabel={`Eje Y máx: ${chartData.maxY.toFixed(1)}h (máximo histórico)`}
          />

          {/* Estadísticas */}
          <div className="card-primary mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-secondary mb-1">Promedio diario</p>
                <p className="text-sm text-secondary">El más corto</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-secondary mb-1">Semana total</p>
                <p className="text-sm text-secondary">El más largo</p>
              </div>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <div>
                <p className="text-base font-semibold text-primary">
                  {formatMs(weekStats.avg)}
                </p>
                <p className="text-sm text-secondary">
                  {formatMs(weekStats.minVal)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-primary">
                  {formatMs(weekStats.weekTotal)}
                </p>
                <p className="text-sm text-secondary">
                  {formatMs(weekStats.maxVal)}
                </p>
              </div>
            </div>
            {/* appOpenMs info */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
              <p className="text-sm text-secondary">App abierta (total)</p>
              <p className="text-sm font-semibold text-primary">
                {formatMs(dayMetrics.appOpenMs)}
              </p>
            </div>
          </div>

          {/* Donut: distribución del día */}
          <div className="card-primary mb-6">
            <h3 className="header-secondary mb-4 text-center">
              Distribución del tiempo hoy
            </h3>
            <DonutChart
              segments={donutSegments}
              size={180}
              centerValue={formatMs(dayMetrics.screenActiveMs)}
              centerLabel="Pantalla"
            />
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4">
              {donutSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[10px] text-[#94A3B8]">
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stacked: semana pantalla vs enfoque */}
          <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 mb-6 border border-white/10">
            <h3 className="text-sm font-medium text-[#F8FAFC] mb-3 text-center">
              Pantalla vs Enfoque — Semana
            </h3>
            <StackedBarChart
              labels={stackedWeekData.labels}
              series={stackedWeekData.series}
              maxY={chartData.maxY}
              height={200}
            />
          </div>

          {/* Mensaje inferior */}
          <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 border border-white/10">
            <p className="text-sm text-center text-[#94A3B8] leading-relaxed">
              El tiempo promedio que pasas en pantalla cada uso
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button className="p-3 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors">
                <Share2 className="w-5 h-5 text-[#4B6FA7]" />
              </button>
              <button className="p-3 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors">
                <X className="w-5 h-5 text-[#4B6FA7]" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Navbar />
    </>
  );
};

export default AverageUse;
