"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  approved?: boolean;
  settled?: boolean;
}

export function ScoreRing({
  score,
  size = 72,
  strokeWidth = 3.5,
  approved = true,
  settled = true,
}: ScoreRingProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 1100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Track: subtle ring
  const trackColor = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.15)";

  // Stroke: #0088cc while animating, settling to semantic status colour
  const strokeColor = !isSettled
    ? "#0088cc"
    : approved
    ? (isLight ? "#16a34a" : "#22c55e")
    : (isLight ? "#dc2626" : "#ef4444");

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeOpacity={0.25}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-semibold font-body tabular-nums text-[var(--fg)] tracking-tight leading-none">
          {score}
        </span>
        <span className="text-[10px] font-ui text-[var(--fg-muted)] uppercase tracking-wider mt-0.5">
          Score
        </span>
      </div>
    </div>
  );
}
