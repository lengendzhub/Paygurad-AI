"use client";

import React from "react";
import { useTheme } from "next-themes";
import { GradientText } from "@/components/reactbits/GradientText";

export interface AccentTextProps {
  children: React.ReactNode;
  preset?: "hero" | "chip" | "linear";
  className?: string;
  showBorder?: boolean;
}

export function AccentText({
  children,
  preset = "linear",
  className = "",
  showBorder = false,
}: AccentTextProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const colors = isLight
    ? ["#0088cc", "#000000", "#666666"]
    : ["#0088cc", "#eeeeee", "#979797"];

  if (preset === "hero") {
    return (
      <GradientText
        colors={colors}
        variant="flow"
        glow={0.35}
        animationSpeed={10}
        followPointer={true}
        className={className}
      >
        {children}
      </GradientText>
    );
  }

  if (preset === "chip") {
    return (
      <GradientText
        colors={colors}
        variant="linear"
        showBorder={showBorder ?? true}
        borderWidth={1.5}
        animationSpeed={6}
        pauseOnHover={true}
        className={className}
      >
        {children}
      </GradientText>
    );
  }

  // Linear preset
  return (
    <GradientText
      colors={colors}
      variant="linear"
      yoyo={true}
      animationSpeed={8}
      glow={0}
      showBorder={showBorder}
      className={className}
    >
      {children}
    </GradientText>
  );
}

