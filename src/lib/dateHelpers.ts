// ── Types ──────────────────────────────────────────────────────────────

export type TabType = "Día" | "Semana" | "Mes" | "Año";

// ── Day / Month labels ─────────────────────────────────────────────────

export const dayLabels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

export const monthLabels = [
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

// ── Pure date utilities ────────────────────────────────────────────────

/** Returns the Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0=Sun … 6=Sat
  d.setDate(d.getDate() - ((dow + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Number of 7-day chunks in a given month (ceil(totalDays / 7)). */
export function weeksOfMonth(year: number, month: number): number {
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Math.ceil(totalDays / 7);
}

/** Days in a given month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Format a Date for display: "6 marzo, Viernes" */
export function formatDateDisplay(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
  return `${day} ${month}, ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
}
