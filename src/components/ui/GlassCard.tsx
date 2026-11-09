"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-3xl border border-white/[0.08]
        bg-white/[0.035] backdrop-blur-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.36)]
        ${hoverEffect ? "transition-all duration-300 hover:bg-white/[0.055] hover:border-white/[0.12]" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

