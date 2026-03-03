/**
 * Converts a 0–23 hour to 12-hour format string.
 * @example formatHour12(0) → "12 AM"
 * @example formatHour12(13) → "1 PM"
 */
export function formatHour12(hour: number): string {
  const h = hour % 24;
  const suffix = h < 12 ? "AM" : "PM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display} ${suffix}`;
}
