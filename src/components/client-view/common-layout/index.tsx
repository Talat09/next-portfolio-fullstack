"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "../navbar";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

// The navbar scrolls between homepage sections, so project pages use their own back link.
// Toasts are mounted only where they are used (admin layout and the contact form).
export default function CommonLayout({ children }: { children: ReactNode }) {
  const pathName = usePathname();
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {pathName !== "/admin" && !pathName?.startsWith("/projects/") ? <Navbar /> : null}
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
