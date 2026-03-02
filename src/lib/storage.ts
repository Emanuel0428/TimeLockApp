// ── Types ──────────────────────────────────────────────────────────────

export interface FocusSession {
  id: string;
  start: number;
  end: number;
  duration: number; // ms
  label: string;
  color: string;
}

export interface DailyMetrics {
  date: string; // YYYY-MM-DD
  pickups: number;
  screenActiveMs: number;
  appOpenMs: number;
  continuousMaxMs: number;
  stationaryMs: number;
  walkingMs: number;
  tokens: number;
  focusSessions: FocusSession[];
}

export interface TokenLedgerEntry {
  id: string;
  timestamp: number;
  type: "earn" | "purchase" | "spend";
  amount: number;
  reason: string;
}

// ── Helpers ────────────────────────────────────────────────────────────

export function getToday(): string {
  return formatDateKey(new Date());
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function metricsKey(date: string) {
  return `metrics:${date}`;
}

function defaultMetrics(date: string): DailyMetrics {
  return {
    date,
    pickups: 0,
    screenActiveMs: 0,
    appOpenMs: 0,
    continuousMaxMs: 0,
    stationaryMs: 0,
    walkingMs: 0,
    tokens: 0,
    focusSessions: [],
  };
}

// ── Metrics CRUD ───────────────────────────────────────────────────────

export function getMetrics(date: string): DailyMetrics {
  try {
    const raw = localStorage.getItem(metricsKey(date));
    if (raw) return JSON.parse(raw) as DailyMetrics;
  } catch {
    /* corrupt data – return default */
  }
  return defaultMetrics(date);
}

export function saveMetrics(metrics: DailyMetrics): void {
  localStorage.setItem(metricsKey(metrics.date), JSON.stringify(metrics));
}

// ── Token Ledger ───────────────────────────────────────────────────────

const LEDGER_KEY = "tokenLedger";

export function getLedger(): TokenLedgerEntry[] {
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    if (raw) return JSON.parse(raw) as TokenLedgerEntry[];
  } catch {
    /* corrupt */
  }
  return [];
}

export function addLedgerEntry(entry: TokenLedgerEntry): void {
  const ledger = getLedger();
  ledger.push(entry);
  localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
}

export function getTokenBalance(): number {
  const ledger = getLedger();
  return ledger.reduce((sum, e) => {
    if (e.type === "earn" || e.type === "purchase") return sum + e.amount;
    if (e.type === "spend") return sum - e.amount;
    return sum;
  }, 0);
}

// ── Focus Sessions ─────────────────────────────────────────────────────

const FOCUS_KEY = "focusSessions";

export function getFocusSessions(): FocusSession[] {
  try {
    const raw = localStorage.getItem(FOCUS_KEY);
    if (raw) return JSON.parse(raw) as FocusSession[];
  } catch {
    /* corrupt */
  }
  return [];
}

export function addFocusSession(session: FocusSession): void {
  const sessions = getFocusSessions();
  sessions.push(session);
  localStorage.setItem(FOCUS_KEY, JSON.stringify(sessions));

  // Also add to daily metrics
  const today = getToday();
  const m = getMetrics(today);
  m.focusSessions.push(session);
  saveMetrics(m);
}

// ── Utility ────────────────────────────────────────────────────────────

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h} H ${m} M`;
  return `${m} M`;
}

export function formatMsShort(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
