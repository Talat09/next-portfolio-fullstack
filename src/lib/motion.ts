/**
 * Scroll animation length that respects the OS "reduce motion" setting.
 * Returns 0 (jump instantly) when the user prefers reduced motion.
 */
export function scrollDuration(ms: number): number {
  if (typeof window === "undefined" || !window.matchMedia) return ms;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : ms;
}
