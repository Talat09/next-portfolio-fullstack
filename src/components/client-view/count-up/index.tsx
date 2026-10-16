"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Counts from 0 up to `value` once the number scrolls into view.
 * Non-numeric values are shown as-is; reduced-motion users see the final number.
 */
export default function CountUp({
  value,
  duration = 1.6,
  suffix = "",
}: {
  value: string | number;
  duration?: number;
  suffix?: string;
}) {
  const target = Number.parseInt(String(value), 10);
  const isNumber = Number.isFinite(target);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  // On desktop (lg+) the stats are already on screen, so start right away without waiting for a scroll.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  const shouldStart = inView || isDesktop;

  useEffect(() => {
    if (!isNumber || !shouldStart || reduceMotion) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [shouldStart, isNumber, target, duration, reduceMotion]);

  if (!isNumber) return <span>{String(value)}{suffix}</span>;
  const shown = reduceMotion ? target : display;

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {target}
        {suffix}
      </span>
    </span>
  );
}