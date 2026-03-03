/**
 * @file storage.ts
 * @description Módulo central de persistencia de datos.
 *
 * Define los tipos de datos principales de la aplicación (DailyMetrics, FocusSession,
 * TokenLedgerEntry, etc.) y provee funciones CRUD para métricas diarias, el libro
 * de tokens y las sesiones de enfoque.
 *
 * Toda la persistencia usa `localStorage` a través del helper con namespace
 * de usuario (`userStorage`), lo que permite aislar datos por usuario.
 */

// ── Tipos ──────────────────────────────────────────────────────────────

/**
 * Representa una sesión de enfoque (Pomodoro) completada.
 * Se almacena tanto en la lista global de sesiones como dentro de DailyMetrics.
 */
export interface FocusSession {
  /** Identificador único de la sesión */
  id: string;
  /** Timestamp (ms) de inicio */
  start: number;
  /** Timestamp (ms) de fin */
  end: number;
  /** Duración total en milisegundos */
  duration: number;
  /** Etiqueta personalizada (ej: "Estudio", "Trabajo") */
  label: string;
  /** Color asociado a la etiqueta */
  color: string;
}

/**
 * Métricas desglosadas por hora del día (24 slots, uno por hora: 0–23).
 * Permite graficar datos reales en la pestaña "Día" de cada métrica.
 */
export interface HourlyMetrics {
  /** Número de recogidas (pickups) por hora */
  pickups: number[];
  /** Milisegundos con pantalla activa por hora */
  screenActiveMs: number[];
  /** Pico de uso continuo (ms) registrado en cada hora */
  continuousMaxMs: number[];
}

/**
 * Métricas acumuladas de un día completo.
 * Se almacena con la clave `metrics:YYYY-MM-DD` en localStorage (con namespace de usuario).
 */
export interface DailyMetrics {
  /** Fecha en formato YYYY-MM-DD */
  date: string;
  /** Total de veces que el usuario abrió/reactivó la app */
  pickups: number;
  /** Milisegundos con la pestaña visible (pantalla activa) */
  screenActiveMs: number;
  /** Milisegundos totales con la app abierta (visible + oculta) */
  appOpenMs: number;
  /** Pico máximo de uso continuo en ms (la sesión más larga sin salir) */
  continuousMaxMs: number;
  /** Milisegundos en estado estacionario (sin caminar) */
  stationaryMs: number;
  /** Milisegundos caminando (velocidad > 0.5 m/s) */
  walkingMs: number;
  /** Pasos registrados hoy (stub para futura integración con podómetro) */
  stepsToday: number;
  /** Tokens acumulados en el día */
  tokens: number;
  /** Sesiones de enfoque completadas hoy */
  focusSessions: FocusSession[];
  /** Desglose por hora para gráficos del día */
  hourly: HourlyMetrics;
}

/**
 * Resultado de evaluar una regla de ganancia de tokens al final del día.
 * Devuelto por `evaluateDailyTokenRewards()` en tokenRules.ts.
 */
export interface TokenRewardResult {
  /** Identificador de la regla (ej: "low_pickups", "steps_10k") */
  rule: string;
  /** Cantidad de tokens otorgados */
  amount: number;
  /** Descripción legible del motivo */
  reason: string;
}

/**
 * Entrada en el libro mayor de tokens. Cada transacción (ganar, comprar, gastar)
 * se registra como una entrada inmutable.
 */
export interface TokenLedgerEntry {
  /** Identificador único de la transacción */
  id: string;
  /** Timestamp (ms) de la transacción */
  timestamp: number;
  /** Tipo: "earn" = ganado, "purchase" = comprado, "spend" = gastado */
  type: "earn" | "purchase" | "spend";
  /** Cantidad de tokens involucrados */
  amount: number;
  /** Descripción del motivo (ej: "Sesión de enfoque completada") */
  reason: string;
}

// ── Helpers de fecha ───────────────────────────────────────────────────

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD.
 */
export function getToday(): string {
  return formatDateKey(new Date());
}

/**
 * Convierte un objeto Date a string YYYY-MM-DD.
 * @param d - Objeto Date a formatear
 */
export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Genera la clave de almacenamiento para métricas de una fecha.
 * Formato: "metrics:YYYY-MM-DD"
 */
function metricsKey(date: string) {
  return `metrics:${date}`;
}

/**
 * Crea un objeto HourlyMetrics vacío con 24 slots inicializados en 0.
 */
const emptyHourly = (): HourlyMetrics => ({
  pickups: Array(24).fill(0),
  screenActiveMs: Array(24).fill(0),
  continuousMaxMs: Array(24).fill(0),
});

/**
 * Crea un DailyMetrics con valores por defecto para la fecha dada.
 * @param date - Fecha en formato YYYY-MM-DD
 */
function defaultMetrics(date: string): DailyMetrics {
  return {
    date,
    pickups: 0,
    screenActiveMs: 0,
    appOpenMs: 0,
    continuousMaxMs: 0,
    stationaryMs: 0,
    walkingMs: 0,
    stepsToday: 0,
    tokens: 0,
    focusSessions: [],
    hourly: emptyHourly(),
  };
}

// ── CRUD de Métricas ───────────────────────────────────────────────────

import { storage as ns } from "../core/storage/userStorage";

/**
 * Obtiene las métricas diarias para una fecha. Busca primero en el almacenamiento
 * con namespace; si no encuentra, intenta la clave vieja (pre-migración) y
 * auto-migra los datos al nuevo formato.
 *
 * @param date - Fecha en formato YYYY-MM-DD
 * @returns DailyMetrics del día solicitado (o valores por defecto si no hay datos)
 */
export function getMetrics(date: string): DailyMetrics {
  // Intentar almacenamiento con namespace primero
  const m = ns.get<DailyMetrics | null>(metricsKey(date), null);
  if (m) {
    // Rellenar campo hourly para datos antiguos que no lo tenían
    if (!m.hourly) m.hourly = emptyHourly();
    return m;
  }

  // Fallback: buscar clave vieja sin namespace (datos pre-migración)
  try {
    const oldKey = metricsKey(date);
    const raw = localStorage.getItem(oldKey);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyMetrics;
      if (!parsed.hourly) parsed.hourly = emptyHourly();
      // Auto-migrar al almacenamiento con namespace
      ns.set(metricsKey(parsed.date), parsed);
      localStorage.removeItem(oldKey);
      return parsed;
    }
  } catch {
    /* datos corruptos — ignorar */
  }

  return defaultMetrics(date);
}

/**
 * Guarda las métricas diarias en el almacenamiento con namespace.
 * @param metrics - Objeto DailyMetrics a persistir
 */
export function saveMetrics(metrics: DailyMetrics): void {
  ns.set(metricsKey(metrics.date), metrics);
}

// ── Libro Mayor de Tokens ──────────────────────────────────────────────

const LEDGER_KEY = "tokenLedger";

/**
 * Obtiene todas las entradas del libro mayor de tokens.
 * @returns Array de TokenLedgerEntry
 */
export function getLedger(): TokenLedgerEntry[] {
  return ns.get<TokenLedgerEntry[]>(LEDGER_KEY, []);
}

/**
 * Agrega una nueva entrada al libro mayor de tokens.
 * @param entry - Entrada a agregar (earn/purchase/spend)
 */
export function addLedgerEntry(entry: TokenLedgerEntry): void {
  const ledger = getLedger();
  ledger.push(entry);
  ns.set(LEDGER_KEY, ledger);
}

/**
 * Calcula el balance actual de tokens sumando ganancias/compras y restando gastos.
 * @returns Balance total de tokens (puede ser 0, nunca negativo en uso normal)
 */
export function getTokenBalance(): number {
  const ledger = getLedger();
  return ledger.reduce((sum, e) => {
    if (e.type === "earn" || e.type === "purchase") return sum + e.amount;
    if (e.type === "spend") return sum - e.amount;
    return sum;
  }, 0);
}

// ── Sesiones de Enfoque ────────────────────────────────────────────────

const FOCUS_KEY = "focusSessions";

/**
 * Obtiene todas las sesiones de enfoque almacenadas.
 * @returns Array de FocusSession
 */
export function getFocusSessions(): FocusSession[] {
  return ns.get<FocusSession[]>(FOCUS_KEY, []);
}

/**
 * Registra una nueva sesión de enfoque completada.
 * La agrega tanto a la lista global como a las métricas del día actual.
 * @param session - Sesión completada a registrar
 */
export function addFocusSession(session: FocusSession): void {
  const sessions = getFocusSessions();
  sessions.push(session);
  ns.set(FOCUS_KEY, sessions);

  // También agregar a las métricas diarias
  const today = getToday();
  const m = getMetrics(today);
  m.focusSessions.push(session);
  saveMetrics(m);
}

// ── Utilidades ─────────────────────────────────────────────────────────

/**
 * Genera un ID único combinando timestamp en base36 y caracteres aleatorios.
 */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Formatea milisegundos a texto legible largo (ej: "2 H 15 M" o "45 M").
 * @param ms - Milisegundos a formatear
 */
export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h} H ${m} M`;
  return `${m} M`;
}

/**
 * Formatea milisegundos a texto legible corto (ej: "2h 15m" o "45m").
 * @param ms - Milisegundos a formatear
 */
export function formatMsShort(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
