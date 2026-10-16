// Decorative background shapes shared by the page sections (same look as the hero).
// Everything here is aria-hidden and ignores the pointer; place it inside a
// section that has `relative isolate` so it sits behind the content.
import type { ReactNode } from "react";

/** Full-viewport-width, clipped layer behind a section's content. */
export function SectionDecor({ children, contained = false }: { children: ReactNode; contained?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 -z-10 overflow-hidden ${
        contained ? "inset-x-0" : "left-1/2 w-screen -translate-x-1/2"
      }`}
    >
      {children}
    </div>
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute grid grid-cols-5 gap-2 ${className}`}>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#1a9e55]/25" />
      ))}
    </div>
  );
}

/** Soft filled circle; pass size, position and colour classes. */
export function Blob({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full ${className}`} />;
}

/** Thin outlined circle. */
export function Ring({ className = "" }: { className?: string }) {
  return <div className={`absolute rounded-full border-2 border-[#1a9e55]/15 ${className}`} />;
}

/** Hand-drawn wavy line, like the doodle next to the hero signature. */
export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`absolute text-[#1a9e55]/30 ${className}`}
    >
      <path d="M3 14c9-12 17-12 26 0s17 12 26 0 17-12 26 0 17 12 26 0 7-6 10-5" />
    </svg>
  );
}

/** Small plus / sparkle mark. */
export function Plus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={`absolute text-[#1a9e55]/35 ${className}`}>
      <path d="M10 3v14M3 10h14" />
    </svg>
  );
}
