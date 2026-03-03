/**
 * @file formatHour12.ts
 * @description Formateador de horas en formato de 12 horas (AM/PM).
 *
 * Convierte una hora en formato 24h (0–23) a una cadena legible en formato
 * de 12 horas. Se usa en las etiquetas de los gráficos de la pestaña "Día".
 *
 * @example
 * formatHour12(0)  → "12 AM"
 * formatHour12(13) → "1 PM"
 * formatHour12(12) → "12 PM"
 */

/**
 * Convierte una hora (0–23) a formato de 12 horas con sufijo AM/PM.
 * @param hour24 - Hora en formato 24h (0–23)
 * @returns Cadena formateada (ej: "1 PM", "12 AM")
 */
export function formatHour12(hour24: number): string {
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const h = hour24 % 12 || 12;
  return `${h} ${suffix}`;
}
