/**
 * @file dateHelpers.ts
 * @description Utilidades puras de fecha para la UI de métricas.
 *
 * Provee constantes de etiquetas (días, meses), funciones para calcular
 * rangos de semanas/meses, y formateo de fechas en español.
 * Usado por los gráficos y la navegación por fecha en las páginas de métricas.
 */

// ── Tipos ──────────────────────────────────────────────────────────────

/** Pestañas de período temporal en las vistas de métricas */
export type TabType = "Día" | "Semana" | "Mes" | "Año";

// ── Etiquetas ──────────────────────────────────────────────────────────

/** Abreviaturas de los días de la semana (Lunes a Domingo) */
export const dayLabels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

/** Abreviaturas de los meses del año */
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

// ── Utilidades de fecha ────────────────────────────────────────────────

/**
 * Devuelve el lunes de la semana que contiene la fecha dada.
 * @param date - Fecha de referencia
 * @returns Date del lunes de esa semana (00:00:00)
 */
export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0=Dom … 6=Sáb
  d.setDate(d.getDate() - ((dow + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Cantidad de bloques de 7 días en un mes dado (ceil(totalDías / 7)).
 * Se usa para determinar cuántas barras mostrar en la pestaña "Mes".
 * @param year - Año
 * @param month - Mes (0-indexado: 0=Enero, 11=Diciembre)
 */
export function weeksOfMonth(year: number, month: number): number {
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Math.ceil(totalDays / 7);
}

/**
 * Días totales en un mes dado.
 * @param year - Año
 * @param month - Mes (0-indexado)
 */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Formatea una fecha para mostrar en la UI: "6 marzo, Viernes"
 * @param date - Fecha a formatear
 */
export function formatDateDisplay(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
  return `${day} ${month}, ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
}

/**
 * Genera una etiqueta para un rango semanal dentro de un mes.
 * Ejemplo: weekRangeLabel(2026, 2, 0) → "01 Mar - 07 Mar"
 *
 * @param year - Año
 * @param month - Mes (0-indexado)
 * @param weekIndex - Índice de la semana dentro del mes (0-based)
 */
export function weekRangeLabel(
  year: number,
  month: number,
  weekIndex: number,
): string {
  const totalDays = daysInMonth(year, month);
  const startDay = weekIndex * 7 + 1;
  const endDay = Math.min(startDay + 6, totalDays);
  const mon = monthLabels[month];
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(startDay)} ${mon} - ${pad(endDay)} ${mon}`;
}
