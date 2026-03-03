import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Smartphone,
  BarChart3,
  Footprints,
  Armchair,
  Unlock,
  Timer,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import QuickAccess from "../components/QuickAccess";
import Navbar from "../components/Navbar";
import { useMetrics } from "../context/MetricsContext";
import { formatDateKey, formatMs } from "../lib/storage";
import {
  homeModulesStorage,
  type ModuleConfig,
  type ModuleKey,
} from "../lib/homeModulesStorage";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { todayMetrics, getMetricsForDate } = useMetrics();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moduleConfig, setModuleConfig] = useState<ModuleConfig>(() =>
    homeModulesStorage.getConfig(),
  );
  const [isEditMode, setIsEditMode] = useState(() =>
    (location.state as any)?.edit === true,
  );

  useEffect(() => {
    setIsEditMode((location.state as any)?.edit === true);
  }, [location.state]);

  useEffect(() => {
    if (isEditMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditMode]);

  const isToday = formatDateKey(currentDate) === formatDateKey(new Date());
  const metrics = isToday
    ? todayMetrics
    : getMetricsForDate(formatDateKey(currentDate));

  const formatDate = (date: Date) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const day = date.getDate();
    const month = date.toLocaleString("es-ES", { month: "long" });
    const dayName = days[date.getDay()];
    return `${day} ${month}, ${dayName}`;
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

  const toggleModule = (key: ModuleKey) => {
    const newConfig = {
      ...moduleConfig,
      [key]: !moduleConfig[key],
    };
    setModuleConfig(newConfig);
  };

  const saveModuleConfig = () => {
    homeModulesStorage.saveConfig(moduleConfig);
    setIsEditMode(false);
  };

  const cancelEdit = () => {
    setModuleConfig(homeModulesStorage.getConfig());
    setIsEditMode(false);
  };

  return (
    <>
      <QuickAccess />

      {/* Contenido principal */}
      <main className={`${isEditMode ? "" : "pt-16"} pb-24 px-3 md:px-4 min-h-screen bg-[#0F172A]`}>
        <div className="max-w-md mx-auto w-full">
          {/* Navegación de fecha */}
          {!isEditMode && (
            <div className="flex items-center justify-between mb-6 py-4 px-2">
              <button
                onClick={prevDay}
                className="p-2 rounded-lg bg-linear-to-br from-[#2D3E52] to-[#1E293B] hover:from-[#3d4e62] hover:to-[#2d3d4b] transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
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
              <h2 className="text-sm md:text-base font-medium text-[#F8FAFC]">
                {formatDate(currentDate)}
              </h2>
              <button
                onClick={nextDay}
                className="p-2 rounded-lg bg-linear-to-br from-[#2D3E52] to-[#1E293B] hover:from-[#3d4e62] hover:to-[#2d3d4b] transition-all duration-200"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-white"
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
          )}

          {isEditMode && (
            <div className="mb-6 py-4 px-2">
              <h2 className="text-lg font-bold text-[#F8FAFC]">
                Personalizar Inicio
              </h2>
              <p className="text-sm text-[#94A3B8] mt-1">
                Selecciona los módulos que ves aquí abajo
              </p>
            </div>
          )}

          {/* Grid de estadísticas */}
          <div className="grid grid-cols-2 gap-3 px-2">
            {/* Recogidas */}
            {moduleConfig.pickups && (
              <button
                onClick={() => navigate("/pickups")}
                className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                <div className="flex justify-center items-center grow">
                  <Smartphone
                    className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left mt-auto">
                  <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">
                    Recogidas
                  </p>
                  <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">
                    {metrics.pickups} {metrics.pickups === 1 ? "Vez" : "Veces"}
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: "shine 4s infinite" }}
                ></div>
              </button>
            )}

            {/* Uso Promedio */}
            {moduleConfig.averageUse && (
              <button
                onClick={() => navigate("/average-use")}
                className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                <div className="flex justify-center items-center grow">
                  <BarChart3
                    className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left mt-auto">
                  <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">
                    Uso Promedio
                  </p>
                <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">
                  {formatMs(metrics.screenActiveMs)}
                </p>
              </div>
              <div
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: "shine 4s infinite" }}
              ></div>
            </button>
            )}

            {/* Mientras Caminas */}
            {moduleConfig.walkingUse && (
              <button
                onClick={() => navigate("/walking-use")}
                className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                <div className="flex justify-center items-center grow">
                  <Footprints
                    className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left mt-auto">
                  <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">
                    Mientras Caminas
                  </p>
                  <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">
                    {formatMs(metrics.walkingMs)}
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: "shine 4s infinite" }}
                ></div>
              </button>
            )}

            {/* Vida estacionaria */}
            {moduleConfig.stationaryLife && (
              <button
                onClick={() => navigate("/stationary-life")}
                className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                <div className="flex justify-center items-center grow">
                  <Armchair
                    className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left mt-auto">
                  <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">
                    Vida estacionaria
                  </p>
                  <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">
                    {formatMs(metrics.stationaryMs)}
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: "shine 4s infinite" }}
                ></div>
              </button>
            )}

            {/* Adelantar Bloqueos */}
            {moduleConfig.unlockAdvance && (
              <button
                onClick={() => navigate("/unlock-advance")}
                className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                <div className="flex justify-center items-center grow">
                  <Unlock
                    className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left mt-auto">
                  <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">
                    Adelantar Bloqueos
                  </p>
                  <p className="text-[#F8FAFC] text-[9px] md:text-[10px] leading-tight">
                    Usa tokens para adelantar tu proceso
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: "shine 4s infinite" }}
                ></div>
              </button>
            )}

            {/* Uso continuo */}
            {moduleConfig.continuousUse && (
              <button
                onClick={() => navigate("/continuous-use")}
                className="bg-linear-to-br from-[#131F37]/85 to-[#0F172A]/85 rounded-2xl p-5 md:p-6 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform active:scale-95 cursor-pointer"
              >
                <div className="flex justify-center items-center grow">
                  <Timer
                    className="w-12 h-12 md:w-14 md:h-14 text-[#4B6FA7]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-left mt-auto">
                  <p className="text-[#F8FAFC] text-[10px] md:text-xs mb-1 font-semibold">
                    Uso continuo
                  </p>
                  <p className="text-[#F8FAFC] text-lg md:text-xl font-bold">
                    {formatMs(metrics.continuousMaxMs)}
                  </p>
                </div>
                <div
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: "shine 4s infinite" }}
                ></div>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Panel de Edición Interactivo */}
      {isEditMode && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelEdit();
            }
          }}
        >
          {/* Header - Cierre */}
          <div className="bg-[#0F172A]/40 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#F8FAFC]">
                Personalizar Inicio
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">Selecciona los módulos que deseas ver</p>
            </div>
            <button
              onClick={() => cancelEdit()}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-[#F8FAFC]" />
            </button>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto bg-linear-to-b from-[#0F172A]/30 via-transparent to-transparent backdrop-blur-sm">
            <div className="pt-2 px-4 pb-4 max-w-sm mx-auto w-full">
              {/* Grid de módulos en tamaño real */}
              <div className="grid grid-cols-2 gap-3">
                {/* Recogidas */}
                <button
                  onClick={() => toggleModule("pickups")}
                  className={`bg-linear-to-br from-[#1E293B]/80 to-[#131F37]/80 rounded-2xl p-4 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 ${
                    !moduleConfig.pickups ? "opacity-50 hover:opacity-70" : "hover:border-[#4B6FA7]/50 hover:shadow-lg hover:shadow-[#4B6FA7]/20"
                  }`}
                >
                  {!moduleConfig.pickups && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex justify-center items-center grow">
                    <div className="w-12 h-12 rounded-lg bg-[#4B6FA7]/10 flex items-center justify-center">
                      <Smartphone
                        className="w-6 h-6 text-[#4B6FA7]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider">
                      Recogidas
                    </p>
                    <p className="text-[#F8FAFC] text-sm font-bold mt-1">
                      {metrics.pickups}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: "shine 4s infinite" }}
                  ></div>
                </button>

                {/* Uso Promedio */}
                <button
                  onClick={() => toggleModule("averageUse")}
                  className={`bg-linear-to-br from-[#1E293B]/80 to-[#131F37]/80 rounded-2xl p-4 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 ${
                    !moduleConfig.averageUse ? "opacity-50 hover:opacity-70" : "hover:border-[#4B6FA7]/50 hover:shadow-lg hover:shadow-[#4B6FA7]/20"
                  }`}
                >
                  {!moduleConfig.averageUse && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex justify-center items-center grow">
                    <div className="w-12 h-12 rounded-lg bg-[#4B6FA7]/10 flex items-center justify-center">
                      <BarChart3
                        className="w-6 h-6 text-[#4B6FA7]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider">
                      Promedio
                    </p>
                    <p className="text-[#F8FAFC] text-sm font-bold mt-1">
                      {formatMs(metrics.screenActiveMs)}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: "shine 4s infinite" }}
                  ></div>
                </button>

                {/* Mientras Caminas */}
                <button
                  onClick={() => toggleModule("walkingUse")}
                  className={`bg-linear-to-br from-[#1E293B]/80 to-[#131F37]/80 rounded-2xl p-4 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 ${
                    !moduleConfig.walkingUse ? "opacity-50 hover:opacity-70" : "hover:border-[#4B6FA7]/50 hover:shadow-lg hover:shadow-[#4B6FA7]/20"
                  }`}
                >
                  {!moduleConfig.walkingUse && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex justify-center items-center grow">
                    <div className="w-12 h-12 rounded-lg bg-[#4B6FA7]/10 flex items-center justify-center">
                      <Footprints
                        className="w-6 h-6 text-[#4B6FA7]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider">
                      Caminas
                    </p>
                    <p className="text-[#F8FAFC] text-sm font-bold mt-1">
                      {formatMs(metrics.walkingMs)}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: "shine 4s infinite" }}
                  ></div>
                </button>

                {/* Vida estacionaria */}
                <button
                  onClick={() => toggleModule("stationaryLife")}
                  className={`bg-linear-to-br from-[#1E293B]/80 to-[#131F37]/80 rounded-2xl p-4 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 ${
                    !moduleConfig.stationaryLife ? "opacity-50 hover:opacity-70" : "hover:border-[#4B6FA7]/50 hover:shadow-lg hover:shadow-[#4B6FA7]/20"
                  }`}
                >
                  {!moduleConfig.stationaryLife && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex justify-center items-center grow">
                    <div className="w-12 h-12 rounded-lg bg-[#4B6FA7]/10 flex items-center justify-center">
                      <Armchair
                        className="w-6 h-6 text-[#4B6FA7]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider">
                      Estacionario
                    </p>
                    <p className="text-[#F8FAFC] text-sm font-bold mt-1">
                      {formatMs(metrics.stationaryMs)}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: "shine 4s infinite" }}
                  ></div>
                </button>

                {/* Adelantar Bloqueos */}
                <button
                  onClick={() => toggleModule("unlockAdvance")}
                  className={`bg-linear-to-br from-[#1E293B]/80 to-[#131F37]/80 rounded-2xl p-4 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 ${
                    !moduleConfig.unlockAdvance ? "opacity-50 hover:opacity-70" : "hover:border-[#4B6FA7]/50 hover:shadow-lg hover:shadow-[#4B6FA7]/20"
                  }`}
                >
                  {!moduleConfig.unlockAdvance && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex justify-center items-center grow">
                    <div className="w-12 h-12 rounded-lg bg-[#4B6FA7]/10 flex items-center justify-center">
                      <Unlock
                        className="w-6 h-6 text-[#4B6FA7]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider">
                      Adelantar
                    </p>
                    <p className="text-[#F8FAFC] text-xs mt-1">
                      Bloqueos
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: "shine 4s infinite" }}
                  ></div>
                </button>

                {/* Uso continuo */}
                <button
                  onClick={() => toggleModule("continuousUse")}
                  className={`bg-linear-to-br from-[#1E293B]/80 to-[#131F37]/80 rounded-2xl p-4 flex flex-col justify-between aspect-square shadow-lg border border-white/10 backdrop-blur-sm relative overflow-hidden group transition-all duration-300 ${
                    !moduleConfig.continuousUse ? "opacity-50 hover:opacity-70" : "hover:border-[#4B6FA7]/50 hover:shadow-lg hover:shadow-[#4B6FA7]/20"
                  }`}
                >
                  {!moduleConfig.continuousUse && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex justify-center items-center grow">
                    <div className="w-12 h-12 rounded-lg bg-[#4B6FA7]/10 flex items-center justify-center">
                      <Timer
                        className="w-6 h-6 text-[#4B6FA7]"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider">
                      Continuo
                    </p>
                    <p className="text-[#F8FAFC] text-sm font-bold mt-1">
                      {formatMs(metrics.continuousMaxMs)}
                    </p>
                  </div>
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    style={{ animation: "shine 4s infinite" }}
                  ></div>
                </button>
              </div>

              <div className="mt-4 p-3 bg-[#1E293B]/50 rounded-xl border border-white/5">
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  <span className="text-[#4B6FA7] font-semibold">💡 Toca un módulo</span> para mostrar u ocultar. Los módulos deshabilitados aparecerán oscurecidos en tu inicio.
                </p>
              </div>
            </div>
          </div>

          {/* Footer - Botones */}
          <div className="bg-linear-to-t from-[#0F172A]/40 to-transparent backdrop-blur-md border-t border-white/5 p-4 pb-24 flex gap-3">
            <button
              onClick={cancelEdit}
              className="flex-1 py-3 rounded-xl font-medium text-[#F8FAFC] bg-[#1E293B]/60 hover:bg-[#2D3E52] transition-all duration-200 border border-white/5 hover:border-white/10"
            >
              Cancelar
            </button>
            <button
              onClick={saveModuleConfig}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-linear-to-r from-[#4B6FA7] to-[#5a7fbd] hover:shadow-lg hover:shadow-[#4B6FA7]/40 transition-all duration-200"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </>
  );
};

export default Home;
