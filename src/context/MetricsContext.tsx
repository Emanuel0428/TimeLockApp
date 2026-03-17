/**
 * @file MetricsContext.tsx
 * @description Contexto global de métricas de la aplicación.
 *
 * Provee a toda la app acceso a las métricas del día actual, el balance de tokens,
 * el estado de visibilidad de la pestaña, y la racha de uso continuo.
 *
 * Funcionalidades principales:
 * - **Tracking de visibilidad**: detecta cuándo la pestaña se oculta/muestra (pickups)
 * - **Acumulador de tiempo**: cada segundo suma screenActiveMs y appOpenMs
 * - **Métricas por hora**: registra pickups, screenActive y uso continuo por hora (24 slots)
 * - **Geolocalización**: detecta movimiento para clasificar caminando vs estacionario
 * - **Tokens**: otorga tokens por hitos (pickups cada 10, caminata cada 10 min, rachas cada 30 min)
 * - **Rollover de día**: detecta cambio de día y crea métricas nuevas automáticamente
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  getToday,
  getMetrics,
  saveMetrics,
  addLedgerEntry,
  getTokenBalance,
  uid,
  type DailyMetrics,
} from "../lib/storage";

// ── Context shape ──────────────────────────────────────────────────────

interface MetricsContextValue {
  todayMetrics: DailyMetrics;
  getMetricsForDate: (date: string) => DailyMetrics;
  tokenBalance: number;
  isTabVisible: boolean;
  currentStreakMs: number;
  refreshBalance: () => void;
  refreshToday: () => void;
}

const MetricsContext = createContext<MetricsContextValue | null>(null);

export function useMetrics() {
  const ctx = useContext(MetricsContext);
  if (!ctx) throw new Error("useMetrics must be used inside MetricsProvider");
  return ctx;
}

// ── Haversine helpers (for geolocation speed calc) ─────────────────────

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // metres
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Provider ───────────────────────────────────────────────────────────

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [todayMetrics, setTodayMetrics] = useState<DailyMetrics>(() =>
    getMetrics(getToday()),
  );
  const [tokenBalance, setTokenBalance] = useState(() => getTokenBalance());
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [currentStreakMs, setCurrentStreakMs] = useState(0);

  // Refs for tracking (avoid stale closures)
  const visibleSinceRef = useRef<number | null>(Date.now());
  const lastTickRef = useRef<number>(Date.now());
  const streakStartRef = useRef<number>(Date.now());
  const lastPosRef = useRef<{ lat: number; lon: number; time: number } | null>(
    null,
  );
  const todayKeyRef = useRef(getToday());
  const metricsRef = useRef(todayMetrics);
  const geoIdRef = useRef<number | null>(null);
  // Track which token milestones have already been awarded
  const awardedPickupMilestoneRef = useRef(0);
  const awardedStreakMilestoneRef = useRef(0);
  const awardedWalkMilestoneRef = useRef(0);

  // Keep metricsRef in sync
  useEffect(() => {
    metricsRef.current = todayMetrics;
  }, [todayMetrics]);

  // ── Persist helper ─────────────────────────────────────────────────
  const persist = useCallback((m: DailyMetrics) => {
    saveMetrics(m);
    setTodayMetrics({ ...m });
  }, []);

  // ── Day rollover check ─────────────────────────────────────────────
  const ensureToday = useCallback(() => {
    const key = getToday();
    if (key !== todayKeyRef.current) {
      todayKeyRef.current = key;
      const fresh = getMetrics(key);
      metricsRef.current = fresh;
      setTodayMetrics(fresh);
      // reset milestone trackers on new day
      awardedPickupMilestoneRef.current = 0;
      awardedStreakMilestoneRef.current = 0;
      awardedWalkMilestoneRef.current = 0;
    }
  }, []);

  // ── Token award helper ─────────────────────────────────────────────
  const awardToken = useCallback(
    (amount: number, reason: string) => {
      addLedgerEntry({
        id: uid(),
        timestamp: Date.now(),
        type: "earn",
        amount,
        reason,
      });
      const m = metricsRef.current;
      m.tokens += amount;
      persist(m);
      setTokenBalance(getTokenBalance());
    },
    [persist],
  );

  // ── 1. Visibility tracking ────────────────────────────────────────
  useEffect(() => {
    const onVisChange = () => {
      const visible = document.visibilityState === "visible";
      setIsTabVisible(visible);

      if (visible) {
        // hidden → visible  = pickup
        visibleSinceRef.current = Date.now();
        lastTickRef.current = Date.now();
        streakStartRef.current = Date.now();
        setCurrentStreakMs(0);

        ensureToday();
        const m = metricsRef.current;
        m.pickups += 1;
        // Track hourly pickup
        const hour = new Date().getHours();
        if (m.hourly)
          m.hourly.pickups[hour] = (m.hourly.pickups[hour] || 0) + 1;
        persist(m);

        // Award 1 token per 10 pickups
        const milestone = Math.floor(m.pickups / 10);
        if (milestone > awardedPickupMilestoneRef.current) {
          awardToken(1, `10 pickups alcanzados (${m.pickups})`);
          awardedPickupMilestoneRef.current = milestone;
        }
      } else {
        // visible → hidden  = end streak, save continuous max
        if (visibleSinceRef.current) {
          const streakDuration = Date.now() - streakStartRef.current;
          const m = metricsRef.current;
          if (streakDuration > m.continuousMaxMs) {
            m.continuousMaxMs = streakDuration;
          }
          // Track hourly continuous-use peak
          const hour = new Date().getHours();
          if (
            m.hourly &&
            streakDuration > (m.hourly.continuousMaxMs[hour] || 0)
          ) {
            m.hourly.continuousMaxMs[hour] = streakDuration;
          }
          persist(m);
        }
        visibleSinceRef.current = null;
      }
    };

    const onFocus = () => {
      if (!visibleSinceRef.current) {
        onVisChange(); // trigger pickup logic
      }
    };

    document.addEventListener("visibilitychange", onVisChange);
    window.addEventListener("focus", onFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisChange);
      window.removeEventListener("focus", onFocus);
    };
  }, [persist, ensureToday, awardToken]);

  // ── 2. Screen-active + appOpen accumulator (every 1 s) ─────────────
  useEffect(() => {
    const id = setInterval(() => {
      ensureToday();

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      const m = metricsRef.current;

      // appOpenMs always accumulates (total session time, visible or hidden)
      m.appOpenMs = (m.appOpenMs || 0) + delta;

      // screenActiveMs only accumulates when tab is visible
      if (visibleSinceRef.current) {
        m.screenActiveMs += delta;

        // Track hourly screenActive
        const hour = new Date().getHours();
        if (m.hourly)
          m.hourly.screenActiveMs[hour] =
            (m.hourly.screenActiveMs[hour] || 0) + delta;

        // Update current streak display
        setCurrentStreakMs(now - streakStartRef.current);

        // Update hourly continuous-use peak with live streak
        const liveStreak = now - streakStartRef.current;
        if (m.hourly && liveStreak > (m.hourly.continuousMaxMs[hour] || 0)) {
          m.hourly.continuousMaxMs[hour] = liveStreak;
        }

        // Award 1 token per 30 min continuous streak
        const streakMin = Math.floor(
          (now - streakStartRef.current) / (30 * 60 * 1000),
        );
        if (streakMin > awardedStreakMilestoneRef.current) {
          awardToken(1, `Racha de ${streakMin * 30} minutos`);
          awardedStreakMilestoneRef.current = streakMin;
        }

        // Persist & re-render only when visible
        persist(m);
      } else {
        // When hidden, just save to localStorage without triggering React re-render
        saveMetrics(m);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [persist, ensureToday, awardToken]);

  // ── 3. Geolocation tracking ───────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return;

    let lastGeoTick = Date.now();

    const onPos = (pos: GeolocationPosition) => {
      if (!visibleSinceRef.current) return;
      ensureToday();

      const now = Date.now();
      const elapsed = now - lastGeoTick;
      lastGeoTick = now;

      const cur = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        time: now,
      };

      if (lastPosRef.current) {
        const dist = haversineDistance(
          lastPosRef.current.lat,
          lastPosRef.current.lon,
          cur.lat,
          cur.lon,
        );
        const dt = (now - lastPosRef.current.time) / 1000; // seconds
        const speed = dt > 0 ? dist / dt : 0;

        const m = metricsRef.current;
        if (speed > 0.5) {
          m.walkingMs += elapsed;
          // Award 1 token per 10 min walking
          const walkMin = Math.floor(m.walkingMs / (10 * 60 * 1000));
          if (walkMin > awardedWalkMilestoneRef.current) {
            awardToken(1, `${walkMin * 10} minutos caminando`);
            awardedWalkMilestoneRef.current = walkMin;
          }
        } else {
          m.stationaryMs += elapsed;
        }
        persist(m);
      }

      lastPosRef.current = cur;
    };

    const onErr = () => {
      /* user denied or unavailable – silently ignore */
    };

    geoIdRef.current = navigator.geolocation.watchPosition(onPos, onErr, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });

    return () => {
      if (geoIdRef.current !== null) {
        navigator.geolocation.clearWatch(geoIdRef.current);
      }
    };
  }, [persist, ensureToday, awardToken]);

  // ── Public helpers ─────────────────────────────────────────────────

  const getMetricsForDate = useCallback((date: string) => getMetrics(date), []);

  const refreshBalance = useCallback(() => {
    setTokenBalance(getTokenBalance());
  }, []);

  const refreshToday = useCallback(() => {
    setTodayMetrics(getMetrics(getToday()));
  }, []);

  // Keep token balance synced when rewards/spends happen outside this context.
  useEffect(() => {
    const onBalanceUpdate = () => {
      setTokenBalance(getTokenBalance());
    };

    window.addEventListener(
      "timelock:balance_update",
      onBalanceUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "timelock:balance_update",
        onBalanceUpdate as EventListener,
      );
    };
  }, []);

  return (
    <MetricsContext.Provider
      value={{
        todayMetrics,
        getMetricsForDate,
        tokenBalance,
        isTabVisible,
        currentStreakMs,
        refreshBalance,
        refreshToday,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
}
