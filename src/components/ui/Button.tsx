"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  disabledReason?: string;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled,
  disabledReason,
  isLoading,
  className = "",
  onClick,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl gap-1.5 font-ui",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2 font-ui",
    lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-ui font-medium",
  }[size];

  const variantStyles = {
    // Primary: #0088cc fill, #000000 label (clean, no glow)
    primary:
      "bg-[#0088cc] text-[#000000] font-semibold hover:brightness-105 active:scale-[0.98]",
    // Secondary: transparent, 1px var(--border-strong)
    secondary:
      "bg-transparent border border-[var(--border-strong)] text-[var(--fg)] hover:bg-[var(--surface-strong)] hover:border-[var(--fg-muted)] active:scale-[0.98]",
    // Ghost: text only
    ghost:
      "bg-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] active:scale-[0.98]",
    // Danger: status red
    danger:
      "bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25 active:scale-[0.98]",
    // Emerald: status green
    emerald:
      "bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 active:scale-[0.98]",
  }[variant];

  const buttonElement = (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.015 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      onClick={disabled || isLoading ? undefined : onClick}
      className={`
        relative inline-flex items-center justify-center font-ui font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
        ${sizeStyles}
        ${variantStyles}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );

  if (disabled && disabledReason) {
    return (
      <div className="relative group inline-block">
        {buttonElement}
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs text-[#eeeeee] bg-[#000000]/95 border border-[var(--border-strong)] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 font-ui">
          {disabledReason}
        </div>
      </div>
    );
  }

  return buttonElement;
}
