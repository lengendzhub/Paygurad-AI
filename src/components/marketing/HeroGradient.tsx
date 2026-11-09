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
      {/* Clean, subtle linear gradient backdrop without glow or blurred orbs */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "linear-gradient(135deg, #78C5EF 0%, #51A0D5 45%, transparent 85%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />
    </div>
  );
}
