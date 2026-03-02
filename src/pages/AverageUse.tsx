import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, BarChart3, Share2, X } from "lucide-react";
import Navbar from "../components/Navbar";
import MiniChart from "../components/MiniChart";
import DonutChart from "../components/DonutChart";
import StackedBarChart from "../components/StackedBarChart";
import { useMetrics } from "../context/MetricsContext";
import { formatDateKey, formatMs, getMetrics } from "../lib/storage";
import { storage } from "../core/storage/userStorage";

type TabType = "Día" | "Semana" | "Mes" | "Año";

const AverageUse = () => {
  const navigate = useNavigate();
  const { todayMetrics, getMetricsForDate } = useMetrics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>("Semana");

  const dateKey = formatDateKey(currentDate);
  const isToday = dateKey === formatDateKey(new Date());
  const dayMetrics = isToday ? todayMetrics : getMetricsForDate(dateKey);

  // Get or update historical max
  const maxHistorical = useMemo(() => {
    const stored = storage.get<number>("maxDailyHoursHistorical", 0);
    const todayHours = dayMetrics.screenActiveMs / 3600000;
    if (todayHours > stored) {
      storage.set("maxDailyHoursHistorical", todayHours);
      return todayHours;
    }
    return Math.max(stored, 1); // At least 1h for the scale
  }, [dayMetrics.screenActiveMs]);

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "long" });
    const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
    return `${day} ${month}, ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
  };

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

  // ─── Chart Data by Tab ──────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (activeTab === "Día") {
      // Hourly breakdown (simulated: we don't have hourly data, show daily total spread)
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const totalMs = dayMetrics.screenActiveMs;
      // Simple distribution: assume uniform usage across active hours (8-22)
      const activeHours = hours.filter((h) => h >= 8 && h <= 22);
      const perHourMs = totalMs / Math.max(1, activeHours.length);
      const values = hours.map((h) =>
        activeHours.includes(h) ? perHourMs / 3600000 : 0,
      );
      return {
        labels: hours.map((h) => (h % 4 === 0 ? `${h}h` : "")),
        values,
        maxY: maxHistorical,
      };
    }

    if (activeTab === "Semana") {
      const dow = currentDate.getDay();
      const monday = new Date(currentDate);
      monday.setDate(monday.getDate() - ((dow + 6) % 7));
      const labels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
      const values = labels.map((_, i) => {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        const k = formatDateKey(d);
        const m =
          k === formatDateKey(new Date()) ? todayMetrics : getMetricsForDate(k);
        return m.screenActiveMs / 3600000;
      });
      return { labels, values, maxY: maxHistorical };
    }

    if (activeTab === "Mes") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const lastDay = new Date(year, month + 1, 0);
      const totalDays = lastDay.getDate();
      const weeksCount = Math.ceil(totalDays / 7);
      const labels: string[] = [];
      const values: number[] = [];

      for (let w = 0; w < weeksCount; w++) {
        labels.push(`Sem ${w + 1}`);
        let weekTotal = 0;
        let weekDays = 0;
        for (let d = w * 7; d < Math.min((w + 1) * 7, totalDays); d++) {
          const date = new Date(year, month, d + 1);
          const k = formatDateKey(date);
          const m =
            k === formatDateKey(new Date()) ? todayMetrics : getMetrics(k);
          weekTotal += m.screenActiveMs / 3600000;
          weekDays++;
        }
        values.push(weekDays > 0 ? weekTotal / weekDays : 0);
      }
      return { labels, values, maxY: maxHistorical };
    }

    // Año
    const year = currentDate.getFullYear();
    const monthLabels = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const values = monthLabels.map((_, monthIdx) => {
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
      let total = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, monthIdx, d);
        const k = formatDateKey(date);
        const m = getMetrics(k);
        total += m.screenActiveMs / 3600000;
      }
      return daysInMonth > 0 ? total / daysInMonth : 0;
    });
    return { labels: monthLabels, values, maxY: maxHistorical };
  }, [
    activeTab,
    currentDate,
    dayMetrics,
    todayMetrics,
    getMetricsForDate,
    maxHistorical,
  ]);

  // Stats for the week view (used in summary card)
  const weekStats = useMemo(() => {
    const dow = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(monday.getDate() - ((dow + 6) % 7));
    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const k = formatDateKey(d);
      const m =
        k === formatDateKey(new Date()) ? todayMetrics : getMetricsForDate(k);
      return m.screenActiveMs;
    });
    const weekTotal = weekData.reduce((s, v) => s + v, 0);
    const nonZero = weekData.filter((v) => v > 0);
    const avg = nonZero.length > 0 ? Math.round(weekTotal / nonZero.length) : 0;
    const minVal = nonZero.length > 0 ? Math.min(...nonZero) : 0;
    const maxVal = nonZero.length > 0 ? Math.max(...nonZero) : 0;
    return { weekTotal, avg, minVal, maxVal };
  }, [currentDate, todayMetrics, getMetricsForDate]);

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
    const labels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
    const screenVals: number[] = [];
    const focusVals: number[] = [];
    labels.forEach((_, i) => {
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
      labels,
      series: [
        { name: "Pantalla", values: screenVals, color: "#4B6FA7" },
        { name: "Enfoque", values: focusVals, color: "#22D3EE" },
      ],
    };
  }, [currentDate, todayMetrics, getMetricsForDate]);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0F172A] z-40 border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
          </button>
          <h1 className="text-lg font-semibold text-[#F8FAFC]">Uso Regular</h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <BarChart3 className="w-6 h-6 text-[#4B6FA7]" />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
        <div className="max-w-md mx-auto w-full">
          {/* Mensaje informativo */}
          <div className="mb-4 text-center">
            <p className="text-sm text-[#94A3B8]">
              {dayMetrics.screenActiveMs > 0
                ? `Tiempo activo: ${formatMs(dayMetrics.screenActiveMs)}`
                : "No hay registros hoy"}
            </p>
          </div>

          {/* Navegación de fecha */}
          <div className="flex items-center justify-between mb-6 py-3">
            <button
              onClick={prevDay}
              className="p-2 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors"
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
            <h2 className="text-sm font-medium text-[#F8FAFC]">
              {formatDate(currentDate)}
            </h2>
            <button
              onClick={nextDay}
              className="p-2 rounded-lg bg-[#1E293B] hover:bg-[#2D3E52] transition-colors"
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
                  activeTab === tab
                    ? "bg-[#4B6FA7] text-white"
                    : "bg-[#1E293B] text-[#94A3B8] hover:bg-[#2D3E52]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Gráfico SVG */}
          <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 mb-6 border border-white/10">
            <MiniChart
              labels={chartData.labels}
              values={chartData.values}
              maxY={chartData.maxY}
              color="#4B6FA7"
              height={220}
              barMode={activeTab === "Semana" || activeTab === "Mes"}
            />
            <div className="text-center mt-2 pt-3 border-t border-white/10">
              <p className="text-xs text-[#94A3B8]">
                {activeTab === "Día" && "Horas de uso por hora del día"}
                {activeTab === "Semana" && "Horas de uso por día de la semana"}
                {activeTab === "Mes" && "Promedio semanal de horas de uso"}
                {activeTab === "Año" && "Promedio mensual de horas de uso"}
              </p>
              <p className="text-[10px] text-[#64748B] mt-1">
                Eje Y máx: {chartData.maxY.toFixed(1)}h (máximo histórico)
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">Promedio diario</p>
                <p className="text-sm text-[#94A3B8]">El más corto</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#94A3B8] mb-1">Semana total</p>
                <p className="text-sm text-[#94A3B8]">El más largo</p>
              </div>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-white/10">
              <div>
                <p className="text-base font-semibold text-[#F8FAFC]">
                  {formatMs(weekStats.avg)}
                </p>
                <p className="text-sm text-[#94A3B8]">
                  {formatMs(weekStats.minVal)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-[#F8FAFC]">
                  {formatMs(weekStats.weekTotal)}
                </p>
                <p className="text-sm text-[#94A3B8]">
                  {formatMs(weekStats.maxVal)}
                </p>
              </div>
            </div>
            {/* appOpenMs info */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
              <p className="text-sm text-[#94A3B8]">App abierta (total)</p>
              <p className="text-sm font-semibold text-[#F8FAFC]">
                {formatMs(dayMetrics.appOpenMs)}
              </p>
            </div>
          </div>

          {/* Donut: distribución del día */}
          <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-6 mb-6 border border-white/10">
            <h3 className="text-sm font-medium text-[#F8FAFC] mb-4 text-center">
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
              maxY={maxHistorical}
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
