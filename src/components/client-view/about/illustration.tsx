"use client";
import { useEffect, useRef } from "react";

/**
 * About-section illustration as a small looping video (WebM/MP4, ~45 KB)
 * instead of the 128 KB GIF. Plays only when the user allows motion;
 * otherwise the still poster frame stays visible.
 */
export default function AboutIllustration() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (media.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        video.play().catch(() => {});
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      width={640}
      height={640}
      muted
      loop
      playsInline
      preload="metadata"
      poster="/media/about-illustration-poster.webp"
      aria-label="Developer working at a desk illustration"
      role="img"
      className="w-full max-w-[420px] h-auto"
    >
      <source src="/media/about-illustration.webm" type="video/webm" />
      <source src="/media/about-illustration.mp4" type="video/mp4" />
    </video>
  );
}
