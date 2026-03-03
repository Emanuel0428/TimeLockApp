import { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logoTimeLock.svg";
import { useMetrics } from "../context/MetricsContext";
import { formatDateKey } from "../lib/storage";

function QuickAccess() {
  const navigate = useNavigate();
  const { getMetricsForDate, isTabVisible } = useMetrics();
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date()); // month being viewed
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setMenuOpen(false);
    navigate("/login");
  };

  // ── Calendar data ──────────────────────────────────────────────
  const today = new Date();
  const viewYear = calendarDate.getFullYear();
  const viewMonth = calendarDate.getMonth();

  const monthName = calendarDate.toLocaleString("es-ES", { month: "long" });
  const monthCapitalized =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon=0

  const prevMonth = useCallback(() => {
    setCalendarDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() - 1);
      return n;
    });
    setSelectedDay(null);
  }, []);
  const nextMonth = useCallback(() => {
    setCalendarDate((d) => {
      const n = new Date(d);
      n.setMonth(n.getMonth() + 1);
      return n;
    });
    setSelectedDay(null);
  }, []);

  const isToday = (day: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate();

  // Metrics for selected day
  const selectedMetrics = useMemo(() => {
    if (selectedDay === null) return null;
    const d = new Date(viewYear, viewMonth, selectedDay);
    return getMetricsForDate(formatDateKey(d));
  }, [selectedDay, viewYear, viewMonth, getMetricsForDate]);

  const formatMs = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-br from-[#1E293B]/95 to-[#0F172A]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 py-1.5  relative">
          {/* Menú Hamburguesa */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            aria-label="Menú"
          >
            <div className="space-y-1">
              <span className="block w-4 h-0.5 bg-[#4B6FA7] rounded-full"></span>
              <span className="block w-4 h-0.5 bg-[#4B6FA7] rounded-full"></span>
              <span className="block w-4 h-0.5 bg-[#4B6FA7] rounded-full"></span>
            </div>
          </button>

          {/* Logo/Título */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo TimeLock"
              className="w-12 h-12 drop-shadow-2xl brightness-0 invert"
            />
            <h1 className="text-xl font-bold text-[#F8FAFC]">TimeLock</h1>
          </div>

          {/* Icono Calendario */}
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
            aria-label="Calendario"
          >
            <svg
              className="w-5 h-5 text-[#4B6FA7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>
        </div>

        {/* Tab visibility notice */}
        {!isTabVisible && (
          <div className="bg-yellow-500/20 border-t border-yellow-500/30 px-4 py-2">
            <p className="text-xs text-yellow-300 text-center font-medium">
              ⚠️ La app debe permanecer abierta en segundo plano (pestaña
              activa)
            </p>
          </div>
        )}
      </nav>

      {/* Sidebar/Menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-xl z-40"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-linear-to-b from-[#1E293B] to-[#0F172A] shadow-2xl z-50 transform transition-transform duration-300 border-r border-white/10">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-8 h-8 brightness-0 invert"
                  />
                  <h2 className="text-lg font-bold text-[#F8FAFC]">Menú</h2>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-white/5 text-[#F8FAFC] transition-all group"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 text-[#4B6FA7] group-hover:text-[#6B8FD7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span>Inicio</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/token-shop"
                    className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-white/5 text-[#F8FAFC] transition-all group"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 text-[#4B6FA7] group-hover:text-[#6B8FD7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>Tienda de Tokens</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-white/5 text-[#F8FAFC] transition-all group"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 text-[#4B6FA7] group-hover:text-[#6B8FD7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span>Notificaciones</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-white/5 text-[#F8FAFC] transition-all group"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 text-[#4B6FA7] group-hover:text-[#6B8FD7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Configuración</span>
                  </Link>
                </li>
              </ul>

              {/* Separador */}
              <div className="my-6 border-t border-white/10"></div>

              {/* Cerrar sesión */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal Calendario */}
      {calendarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setCalendarOpen(false)}
          ></div>

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-linear-to-br from-[#1E293B] to-[#0F172A] rounded-2xl shadow-2xl z-50 w-11/12 max-w-md border border-white/10">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#F8FAFC]">Calendario</h2>
                <button
                  onClick={() => setCalendarOpen(false)}
                  className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Vista simple de calendario */}
              <div className="space-y-4">
                {/* Month navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevMonth}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-[#94A3B8]"
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
                  <h3 className="text-base font-semibold text-[#F8FAFC]">
                    {monthCapitalized} {viewYear}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-[#94A3B8]"
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

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#94A3B8]">
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mié</div>
                  <div>Jue</div>
                  <div>Vie</div>
                  <div>Sáb</div>
                  <div>Dom</div>
                </div>

                {/* Días del mes */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Empty cells for offset */}
                  {Array.from({ length: offset }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isTodayDay = isToday(day);
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() =>
                          setSelectedDay(day === selectedDay ? null : day)
                        }
                        className={`p-2 rounded-lg text-sm transition-all ${
                          isSelected
                            ? "bg-linear-to-br from-[#4B6FA7] to-[#6B8FD7] text-white font-semibold shadow-lg"
                            : isTodayDay
                              ? "bg-[#4B6FA7]/30 text-white font-semibold"
                              : "text-[#F8FAFC] hover:bg-white/5"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Selected day metrics */}
                {selectedMetrics && selectedDay !== null && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <p className="text-sm font-semibold text-[#F8FAFC] text-center">
                      {selectedDay} de {monthCapitalized}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#131F37] rounded-lg p-2">
                        <p className="text-[10px] text-[#94A3B8]">Recogidas</p>
                        <p className="text-sm font-bold text-[#F8FAFC]">
                          {selectedMetrics.pickups}
                        </p>
                      </div>
                      <div className="bg-[#131F37] rounded-lg p-2">
                        <p className="text-[10px] text-[#94A3B8]">Pantalla</p>
                        <p className="text-sm font-bold text-[#F8FAFC]">
                          {formatMs(selectedMetrics.screenActiveMs)}
                        </p>
                      </div>
                      <div className="bg-[#131F37] rounded-lg p-2">
                        <p className="text-[10px] text-[#94A3B8]">Racha</p>
                        <p className="text-sm font-bold text-[#F8FAFC]">
                          {formatMs(selectedMetrics.continuousMaxMs)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedMetrics && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-[#94A3B8] text-center">
                      Hoy: {today.getDate()} de{" "}
                      {today
                        .toLocaleString("es-ES", { month: "long" })
                        .replace(/^\w/, (c) => c.toUpperCase())}
                      , {today.getFullYear()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default QuickAccess;
