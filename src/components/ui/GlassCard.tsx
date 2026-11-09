"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export function GlassCard({
  children,
  className = "",
  delay = 0,
  hoverEffect = true,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-[28px] border border-[var(--border)]
        bg-[var(--surface)] backdrop-blur-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.36)]
        ${hoverEffect ? "transition-all duration-300 hover:bg-[var(--surface-strong)] hover:border-[var(--border-strong)] hover:-translate-y-0.5" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
