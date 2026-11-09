"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollRevealProps {
  children: string;
  mode?: "scrub" | "enter";
  splitBy?: "words" | "chars";
  effect?: "fade" | "rise";
  stagger?: number;
  duration?: number;
  smoothing?: number;
  baseOpacity?: number;
  baseOffset?: number;
  baseRotation?: number;
  enableBlur?: boolean;
  blurStrength?: number;
  highlightColor?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  containerClassName?: string;
  textClassName?: string;
}

export function ScrollReveal({
  children,
  mode = "enter",
  splitBy = "words",
  effect = "fade",
  stagger = 0.04,
  duration = 0.8,
  smoothing = 0.3,
  baseOpacity = 0.15,
  baseOffset = 20,
  baseRotation = 0,
  enableBlur = false,
  blurStrength = 8,
  highlightColor = "#007AFF",
  rotationEnd = "bottom 80%",
  wordAnimationEnd = "bottom 65%",
  containerClassName = "",
  textClassName = "font-display",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const spanElements = el.querySelectorAll(".scroll-reveal-item");
    if (!spanElements.length) return;

    if (mode === "scrub") {
      // Scrub mode: progressive revelation on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: wordAnimationEnd,
          scrub: smoothing,
        },
      });

      tl.fromTo(
        spanElements,
        {
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : "none",
          rotateX: baseRotation,
          y: baseOffset,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          rotateX: 0,
          y: 0,
          stagger,
          ease: "none",
        }
      );

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.trigger === el) st.kill();
        });
      };
    } else {
      // Enter mode: trigger once when entering viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      tl.fromTo(
        spanElements,
        {
          opacity: 0,
          y: effect === "rise" ? 24 : 0,
          filter: enableBlur ? `blur(${blurStrength}px)` : "none",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          stagger,
          ease: "power2.out",
        }
      );

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.trigger === el) st.kill();
        });
      };
    }
  }, [
    mode,
    splitBy,
    effect,
    stagger,
    duration,
    smoothing,
    baseOpacity,
    baseOffset,
    baseRotation,
    enableBlur,
    blurStrength,
    rotationEnd,
    wordAnimationEnd,
  ]);

  // Split text into tokens
  const tokens = splitBy === "words" ? children.split(" ") : children.split("");

  return (
    <h2
      ref={containerRef}
      className={`relative inline-block leading-snug tracking-tight text-[var(--fg)] ${textClassName} ${containerClassName}`}
      aria-label={children}
    >
      {tokens.map((token, i) => (
        <span
          key={i}
          className="scroll-reveal-item inline-block will-change-transform will-change-opacity"
          style={{ marginRight: splitBy === "words" ? "0.28em" : "0.02em" }}
        >
          {token}
        </span>
      ))}
    </h2>
  );
}

