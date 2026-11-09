"use client";

import React from "react";
import { HeroGradient } from "./HeroGradient";

export interface HeroLaserProps {
  surfaceRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function HeroLaser({ className = "" }: HeroLaserProps) {
  return <HeroGradient className={className} />;
}
