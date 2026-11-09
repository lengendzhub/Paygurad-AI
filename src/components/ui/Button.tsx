"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

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
    sm: "px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-medium",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#0A84FF] via-[#2F80ED] to-[#BF5AF2] text-white shadow-[0_0_24px_rgba(10,132,255,0.3)] hover:shadow-[0_0_36px_rgba(10,132,255,0.45)] hover:brightness-105 active:scale-[0.98]",
    secondary:
      "bg-white/[0.05] border border-white/[0.08] text-slate-200 hover:bg-white/[0.09] hover:border-white/[0.14] hover:text-white active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.05] active:scale-[0.98]",
    danger:
      "bg-rose-500/15 border border-rose-500/25 text-rose-300 hover:bg-rose-500/25 active:scale-[0.98]",
    emerald:
      "bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/25 active:scale-[0.98]",
  }[variant];

  const buttonElement = (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.015 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      onClick={disabled || isLoading ? undefined : onClick}
      className={`
        relative inline-flex items-center justify-center font-medium
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
        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs text-slate-300 bg-black/90 border border-white/10 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50">
          {disabledReason}
        </div>
      </div>
    );
  }

  return buttonElement;
}

