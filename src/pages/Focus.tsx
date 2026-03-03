import { useState, useEffect, useCallback, useRef } from "react";
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
  getFocusSessions,
  formatMsShort,
  type FocusSession,
} from "../lib/storage";
import { TimerEngine } from "../core/time/TimerEngine";
import type { TimerState } from "../core/models";

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

const Focus = () => {
  const navigate = useNavigate();
  const { refreshBalance, refreshToday } = useMetrics();

  const [timerState, setTimerState] = useState<TimerState>(
    TimerEngine.getState(),
  );
  const [timeLeft, setTimeLeft] = useState(() => TimerEngine.getRemainingMs());

  const [selectedLabel, setSelectedLabel] = useState(timerState.label);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showLabels, setShowLabels] = useState(false);
  const [showColors, setShowColors] = useState(false);

  // Last session + today total from storage
  const [lastSession, setLastSession] = useState<FocusSession | null>(null);
  const [todayTotalMs, setTodayTotalMs] = useState(0);
  
  // Track previous phase to detect transitions
  const prevPhaseRef = useRef<"FOCUS" | "BREAK">(timerState.phase);

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
    // Suscribirse a los cambios del estado global del timer
    const unsubscribe = TimerEngine.subscribe((newState) => {
      setTimerState(newState);
      setTimeLeft(TimerEngine.getRemainingMs());
      
      // Detectar transición de FOCUS a BREAK (sesión completada)
      if (prevPhaseRef.current === "FOCUS" && newState.phase === "BREAK") {
        refreshBalance();
        refreshToday();
        loadHistory();
      }
      
      prevPhaseRef.current = newState.phase;
    });

    return () => unsubscribe();
  }, [loadHistory, refreshBalance, refreshToday]);

  const startTimer = () => {
    TimerEngine.start(selectedLabel);
  };

  const pauseTimer = () => {
    TimerEngine.pause();
  };

  const resetTimer = () => {
    TimerEngine.reset();
  };

  const addTime = () => {
    TimerEngine.addTime(5);
  };

  const finishSession = () => {
    TimerEngine.finishSession();
    refreshBalance();
    refreshToday();
    loadHistory();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress =
    ((timerState.durationMs - timeLeft) / timerState.durationMs) * 100;

  const isBreak = timerState.phase === "BREAK";

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-[#0F172A]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-[#F8FAFC]" />
          </button>
          <h1 className="text-lg font-semibold text-[#F8FAFC]">
            {isBreak ? "Descanso" : "Concentrarse"}
          </h1>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Brain
              className={`w-6 h-6 ${isBreak ? "text-green-400" : "text-[#4B6FA7]"}`}
            />
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="pt-20 pb-24 px-4 min-h-screen transition-colors duration-500 bg-[#0F172A]">
        <div className="max-w-md mx-auto w-full">
          {/* Botones de configuración */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <button
                onClick={() => {
                  setShowLabels(!showLabels);
                  setShowColors(false);
                }}
                disabled={timerState.isActive || isBreak}
                className={`w-full py-2 px-3 bg-[#1E293B] text-[#F8FAFC] rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 ${timerState.isActive || isBreak ? "opacity-50 cursor-not-allowed" : "hover:bg-[#2D3E52]"}`}
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
                  style={{
                    backgroundColor: isBreak ? "#22C55E" : selectedColor,
                  }}
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
              Resetear
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
                  stroke={isBreak ? "#22C55E" : selectedColor}
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
                    className="h-0.5 w-32 mx-auto transition-colors"
                    style={{
                      backgroundColor: isBreak ? "#22C55E" : selectedColor,
                    }}
                  ></div>
                  <p
                    className={`text-xs mt-2 font-medium ${isBreak ? "text-green-400" : "text-[#94A3B8]"}`}
                  >
                    {isBreak ? "Descansando..." : timerState.label}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de control */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() =>
                timerState.isActive ? pauseTimer() : startTimer()
              }
              className={`px-8 py-3 text-[#F8FAFC] rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                isBreak
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#1E293B] hover:bg-[#2D3E52]"
              }`}
            >
              {timerState.isActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  {isBreak ? "Pausar descanso" : "Pausar concentración"}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {isBreak ? "Reanudar descanso" : "Empezar concentración"}
                </>
              )}
            </button>
            {(timerState.startAtMs || timerState.pausedAtMs) && (
              <button
                onClick={finishSession}
                className="px-4 py-3 bg-[#EF4444]/20 text-[#EF4444] rounded-full text-sm font-semibold hover:bg-[#EF4444]/30 transition-all flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                {isBreak ? "Omitir" : "Finalizar"}
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
          {isBreak ? (
            <div className="mt-6 bg-green-900/20 rounded-xl p-4 border border-green-500/20">
              <p className="text-xs text-green-400 text-center">
                ✨ Aprovecha para estirarte un poco o tomar agua.
              </p>
            </div>
          ) : (
            <div className="mt-6 bg-[#4B6FA7]/10 rounded-xl p-4 border border-[#4B6FA7]/20">
              <p className="text-xs text-[#94A3B8] text-center">
                💡 Completa sesiones de 25+ minutos para ganar tokens
              </p>
            </div>
          )}
        </div>
      </main>

      <Navbar />
    </>
  );
};

export default Focus;
