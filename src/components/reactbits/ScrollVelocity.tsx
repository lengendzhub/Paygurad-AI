"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ScrollVelocityProps {
  texts: string[];
  velocity?: number;
  gap?: number;
  skewWithVelocity?: number;
  scaleWithVelocity?: number;
  outlineAlternate?: boolean;
  fadeEdges?: boolean;
  draggable?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  separator?: React.ReactNode;
}

export function ScrollVelocity({
  texts,
  velocity = 60,
  gap = 32,
  skewWithVelocity = 10,
  scaleWithVelocity = 0.1,
  outlineAlternate = true,
  fadeEdges = true,
  draggable = true,
  pauseOnHover = false,
  className = "font-display",
  fontSize = "clamp(48px, 9vw, 120px)",
  fontWeight = 500,
  color = "var(--fg)",
  separator,
}: ScrollVelocityProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const xPos = useRef<number[]>([0, 0]);
  const lastScrollY = useRef<number>(0);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY.current);
      lastScrollY.current = currentScrollY;
      const boosted = Math.min(1 + delta * 0.05, 4);
      setScrollSpeed(boosted);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isHovered || !pauseOnHover) {
        const step = velocity * delta * scrollSpeed;
        xPos.current[0] = (xPos.current[0] - step) % 2000;
        xPos.current[1] = (xPos.current[1] + step) % 2000;

        const row0 = document.getElementById("scroll-velocity-row-0");
        const row1 = document.getElementById("scroll-velocity-row-1");

        if (row0) {
          row0.style.transform = `translateX(${xPos.current[0]}px)`;
        }
        if (row1) {
          row1.style.transform = `translateX(${xPos.current[1]}px)`;
        }
      }

      // Smooth decay scrollSpeed back to 1
      setScrollSpeed((s) => Math.max(1, s - 0.02));

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [reducedMotion, isHovered, pauseOnHover, velocity, scrollSpeed]);

  const defaultSeparator = (
    <span
      className="inline-block w-3 h-3 rounded-full mx-6 align-middle"
      style={{ backgroundColor: "var(--accent)" }}
    />
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full overflow-hidden select-none border-y border-[var(--border)] py-8 ${className}`}
    >
      {fadeEdges && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[var(--bg)] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[var(--bg)] to-transparent" />
        </>
      )}

      {texts.map((text, rowIndex) => (
        <div
          key={rowIndex}
          id={`scroll-velocity-row-${rowIndex}`}
          className="flex whitespace-nowrap will-change-transform leading-none py-1"
          style={{
            fontSize,
            fontWeight,
            color,
          }}
        >
          {Array.from({ length: 6 }).map((_, repeatIndex) => {
            const isOutlined = outlineAlternate && (rowIndex + repeatIndex) % 2 === 1;
            return (
              <span
                key={repeatIndex}
                className="inline-flex items-center"
                style={{
                  marginRight: `${gap}px`,
                  WebkitTextStroke: isOutlined ? "1px var(--fg-muted)" : "none",
                  color: isOutlined ? "transparent" : color,
                }}
              >
                <span>{text}</span>
                {separator || defaultSeparator}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

