"use client";
import { m, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type AnimationWrapperProps = HTMLMotionProps<"div"> & {
  children?: ReactNode;
  className?: string;
};
export default function AnimationWrapper({
  children,
  className,
  ...props
}: AnimationWrapperProps) {
  return (
    <m.div
      initial="offscreen"
      whileInView={"onscreen"}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}
