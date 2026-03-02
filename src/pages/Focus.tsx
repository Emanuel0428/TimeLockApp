import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Brain,
  Play,
  Pause,
  RotateCcw,
  Tag,
  Palette,
  Clock,
  Square,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useMetrics } from "../context/MetricsContext";
import {
  addFocusSession,
  getFocusSessions,
  uid,
  addLedgerEntry,
  formatMsShort,
  type FocusSession,
} from "../lib/storage";

const LABELS = ["Estudio", "Trabajo", "Lectura", "Ejercicio", "Otro"];
const COLORS = [
  "#4B6FA7",
  "#6B8FD7",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#A855F7",
  "#EC4899",
];
const DEFAULT_MINUTES = 25;

const Focus = () => {
  const navigate = useNavigate();
  const { refreshBalance, refreshToday } = useMetrics();
  const [selectedLabel, setSelectedLabel] = useState(LABELS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showLabels, setShowLabels] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(DEFAULT_MINUTES * 60);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionStart, setSessionStart] = useState<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Last session + today total from storage
  const [lastSession, setLastSession] = useState<FocusSession | null>(null);
  const [todayTotalMs, setTodayTotalMs] = useState(0);

  const loadHistory = useCallback(() => {
    const sessions = getFocusSessions();
    if (sessions.length > 0) {
      setLastSession(sessions[sessions.length - 1]);
    }
    const todayKey = new Date().toISOString().slice(0, 10);
    const todaySessions = sessions.filter(
      (s) => new Date(s.start).toISOString().slice(0, 10) === todayKey,
    );
    setTodayTotalMs(todaySessions.reduce((sum, s) => sum + s.duration, 0));
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Timer tick
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  // Auto-finish when time runs out
  useEffect(() => {
    if (isActive && timeLeft === 0) {
      finishSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isActive]);

  const startTimer = () => {
    setIsActive(true);
    if (!sessionStart) setSessionStart(Date.now());
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
    setSessionStart(null);
  };

  const addTime = () => {
    setTimeLeft((t) => t + 5 * 60);
    setTotalSeconds((s) => s + 5 * 60);
  };

  const finishSession = () => {
    setIsActive(false);
    const end = Date.now();
    const start = sessionStart || end;
    const durationMs = end - start;

    const session: FocusSession = {
      id: uid(),
      start,
      end,
      duration: durationMs,
      label: selectedLabel,
      color: selectedColor,
    };

    addFocusSession(session);

    // Award 1 token per 25 min of focus
    const tokensEarned = Math.floor(durationMs / (25 * 60 * 1000));
    if (tokensEarned > 0) {
      addLedgerEntry({
        id: uid(),
        timestamp: Date.now(),
        type: "earn",
        amount: tokensEarned,
        reason: `Sesión de enfoque: ${selectedLabel} (${Math.round(durationMs / 60000)}m)`,
      });
      refreshBalance();
    }
    refreshToday();
    loadHistory();

    // Reset
    setTimeLeft(DEFAULT_MINUTES * 60);
    setTotalSeconds(DEFAULT_MINUTES * 60);
    setSessionStart(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

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
          <h1 className="text-lg font-semibold text-[#F8FAFC]">Concentrarse</h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Brain className="w-6 h-6 text-[#4B6FA7]" />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="pt-20 pb-24 px-4 min-h-screen bg-[#0F172A]">
        <div className="max-w-md mx-auto w-full">
          {/* Botones de configuración */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <button
                onClick={() => {
                  setShowLabels(!showLabels);
                  setShowColors(false);
                }}
                className="w-full py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2"
              >
                <Tag className="w-4 h-4" />
                {selectedLabel}
              </button>
              {showLabels && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] rounded-lg border border-white/10 z-50 overflow-hidden">
                  {LABELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setSelectedLabel(l);
                        setShowLabels(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs text-[#F8FAFC] hover:bg-[#2D3E52] transition-colors ${l === selectedLabel ? "bg-[#4B6FA7]/20" : ""}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-1 relative">
              <button
                onClick={() => {
                  setShowColors(!showColors);
                  setShowLabels(false);
                }}
                className="w-full py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4" />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                ></span>
                Estilo
              </button>
              {showColors && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1E293B] rounded-lg border border-white/10 z-50 p-3 flex gap-2 flex-wrap justify-center">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedColor(c);
                        setShowColors(false);
                      }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${c === selectedColor ? "border-white scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            <button
              onClick={resetTimer}
              className="flex-1 py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Cuenta regresiva
            </button>
            <button
              onClick={addTime}
              className="flex-1 py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium hover:bg-[#2D3E52] transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              +5 min
            </button>
          </div>

          {/* Timer circular */}
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              {/* Círculo de progreso */}
              <svg className="w-72 h-72 transform -rotate-90">
                {/* Círculo de fondo */}
                <circle
                  cx="144"
                  cy="144"
                  r="130"
                  stroke="#1E293B"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Círculo de progreso */}
                <circle
                  cx="144"
                  cy="144"
                  r="130"
                  stroke={selectedColor}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 130}`}
                  strokeDashoffset={`${2 * Math.PI * 130 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              {/* Contenido del círculo */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-center">
                  <p className="text-6xl font-bold text-[#F8FAFC] mb-2">
                    {formatTime(timeLeft)}
                  </p>
                  <div
                    className="h-0.5 w-32 mx-auto"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                  <p className="text-xs text-[#94A3B8] mt-2">{selectedLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de control */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => (isActive ? pauseTimer() : startTimer())}
              className="px-8 py-3 bg-[#1E293B] text-[#F8FAFC] rounded-full text-sm font-semibold hover:bg-[#2D3E52] transition-all flex items-center gap-2"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar concentración
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Empezar concentración
                </>
              )}
            </button>
            {sessionStart && (
              <button
                onClick={finishSession}
                className="px-4 py-3 bg-[#EF4444]/20 text-[#EF4444] rounded-full text-sm font-semibold hover:bg-[#EF4444]/30 transition-all flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Finalizar
              </button>
            )}
          </div>

          {/* Estadísticas de concentración */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-[#94A3B8] mb-2">
                {formatMsShort(todayTotalMs)}
              </p>
              <p className="text-sm font-semibold text-[#F8FAFC]">
                Concentración
              </p>
            </div>
            <div className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-4 border border-white/10">
              <p className="text-xs text-[#94A3B8] mb-2">
                {lastSession ? formatMsShort(lastSession.duration) : "0m"}
              </p>
              <p className="text-sm font-semibold text-[#F8FAFC]">
                Última concentración
              </p>
            </div>
          </div>

          {/* Información */}
          <div className="mt-6 bg-[#4B6FA7]/10 rounded-xl p-4 border border-[#4B6FA7]/20">
            <p className="text-xs text-[#94A3B8] text-center">
              💡 Completa sesiones de 25+ minutos para ganar tokens
            </p>
          </div>
        </div>
      </main>

      <Navbar />
    </>
  );
};

export default Focus;
