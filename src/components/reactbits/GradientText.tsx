"use client";

import React, { useRef, useState } from "react";

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  borderWidth?: number;
  glow?: number;
  followPointer?: boolean;
  pauseOnHover?: boolean;
  yoyo?: boolean;
  variant?: "flow" | "linear";
}

export function GradientText({
  children,
  className = "",
  colors = ["#007AFF", "#eeeeee", "#979797"],
  animationSpeed = 8,
  showBorder = false,
  borderWidth = 1.5,
  glow = 0,
  followPointer = false,
  pauseOnHover = false,
  yoyo = false,
  variant = "linear",
}: GradientTextProps) {
  const [pointerOffset, setPointerOffset] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const gradientString = colors.join(", ");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!followPointer || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPointerOffset({ x, y });
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundImage:
      variant === "flow" && followPointer
        ? `radial-gradient(circle at ${pointerOffset.x}% ${pointerOffset.y}%, ${gradientString})`
        : `linear-gradient(135deg, ${gradientString})`,
    backgroundSize: "300% 300%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation:
      pauseOnHover && isHovered
        ? "none"
        : `gradientFlow ${animationSpeed}s ease ${yoyo ? "alternate" : "infinite"}`,
  };

  return (
    <span
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-block ${className}`}
    >
      <style jsx>{`
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {showBorder && (
        <span
          className="absolute -inset-1 rounded-full pointer-events-none before:content-['']"
          style={{
            padding: `${borderWidth}px`,
            background: `linear-gradient(135deg, ${gradientString})`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0.8,
          }}
        />
      )}

      <span style={backgroundStyle} className="inline-block">
        {children}
      </span>
    </span>
  );
}

