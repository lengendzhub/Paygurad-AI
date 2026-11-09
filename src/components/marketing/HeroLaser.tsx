"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LaserFlow } from "@/components/reactbits/LaserFlow";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";

export interface HeroLaserProps {
  surfaceRef?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function HeroLaser({ surfaceRef, className = "" }: HeroLaserProps) {
  const { resolvedTheme } = useTheme();
  const hasWebGL2 = useWebGL2Support();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMounted) return null;

  const currentTheme = resolvedTheme === "light" ? "light" : "dark";

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <LaserFlow
        color="#0088cc"
        intensity={1.6}
        beamPosition={isMobile ? 0.88 : 0.7}
        beamWidth={isMobile ? 1.0 : 1.5}
        dpr={isMobile ? 1.0 : 1.5}
        mouseInteraction={!isMobile}
        fog={isMobile ? 0.1 : 0.2}
        dust={isMobile ? 0.6 : 1.2}
        flare={1.5}
        spread={1.5}
        spill={1.0}
        speed={1.0}
        theme={currentTheme}
        surfaceRef={surfaceRef}
      />
    </div>
  );
}

