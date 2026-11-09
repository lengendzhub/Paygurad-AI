"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)]
        hover:bg-[var(--surface-strong)] hover:border-[var(--border-strong)]
        text-[var(--fg-muted)] hover:text-[var(--fg)]
        flex items-center justify-center transition-all cursor-pointer
        ${className}
      `}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

