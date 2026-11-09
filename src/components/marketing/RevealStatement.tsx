"use client";

import React from "react";
import { ScrollReveal } from "@/components/reactbits/ScrollReveal";

export interface RevealStatementProps {
  children: string;
  preset?: "scrub" | "enter";
  className?: string;
  containerClassName?: string;
}

export function RevealStatement({
  children,
  preset = "enter",
  className = "",
  containerClassName = "",
}: RevealStatementProps) {
  if (preset === "scrub") {
    return (
      <ScrollReveal
        mode="scrub"
        splitBy="words"
        effect="fade"
        stagger={0.05}
        smoothing={0.3}
        baseOpacity={0.15}
        baseRotation={2}
        enableBlur={true}
        blurStrength={8}
        highlightColor="#007AFF"
        rotationEnd="bottom 80%"
        wordAnimationEnd="bottom 65%"
        textClassName={`font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center leading-tight font-normal ${className}`}
        containerClassName={`mx-auto max-w-5xl px-6 ${containerClassName}`}
      >
        {children}
      </ScrollReveal>
    );
  }

  // Enter preset
  return (
    <ScrollReveal
      mode="enter"
      splitBy="words"
      effect="rise"
      stagger={0.04}
      duration={0.8}
      baseOffset={0}
      enableBlur={false}
      baseRotation={0}
      textClassName={`font-display text-3xl sm:text-4xl md:text-5xl font-normal leading-tight ${className}`}
      containerClassName={containerClassName}
    >
      {children}
    </ScrollReveal>
  );
}

