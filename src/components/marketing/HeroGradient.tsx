"use client";

import React from "react";

export interface HeroGradientProps {
  className?: string;
}

export function HeroGradient({ className = "" }: HeroGradientProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-0 ${className}`}
    >
      <style jsx>{`
        @keyframes driftOrb1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-30px, 20px, 0) scale(1.06);
          }
        }
        @keyframes driftOrb2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(25px, -15px, 0) scale(0.95);
          }
        }
      `}</style>

      {/* 1. Primary luminous atmospheric glow behind the verification card in #78C5EF and #51A0D5 */}
      <div
        className="absolute -top-16 right-[-5%] sm:right-[2%] w-[680px] sm:w-[920px] h-[600px] sm:h-[750px] rounded-full opacity-65 blur-[120px] sm:blur-[160px]"
        style={{
          background:
            "radial-gradient(circle at 65% 45%, rgba(120, 197, 239, 0.45) 0%, rgba(81, 160, 213, 0.28) 42%, rgba(0, 0, 0, 0) 72%)",
          animation: "driftOrb1 14s ease-in-out infinite",
        }}
      />

      {/* 2. Soft top-center ambient light wash bridging headline and mockup */}
      <div
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[950px] h-[520px] rounded-full opacity-45 blur-[140px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 10%, rgba(120, 197, 239, 0.35) 0%, rgba(81, 160, 213, 0.18) 50%, transparent 80%)",
          animation: "driftOrb2 18s ease-in-out infinite",
        }}
      />

      {/* 3. Subtle secondary accent orb under the left headline */}
      <div
        className="absolute top-1/4 -left-28 w-[550px] h-[550px] rounded-full opacity-30 blur-[150px]"
        style={{
          background:
            "radial-gradient(circle, rgba(81, 160, 213, 0.3) 0%, rgba(120, 197, 239, 0.12) 55%, transparent 75%)",
        }}
      />

      {/* 4. Bottom fade into the marquee ribbon */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent" />
    </div>
  );
}
