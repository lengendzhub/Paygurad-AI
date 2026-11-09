"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck } from "lucide-react";

interface LandingPreloaderProps {
  onComplete?: () => void;
}

export function LandingPreloader({ onComplete }: LandingPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing protocol environment...");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Smooth progress simulation over ~900ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate through middle
        const increment = prev < 30 ? 6 : prev < 75 ? 12 : 18;
        const next = Math.min(100, prev + increment);

        if (next > 70) {
          setStatusText("Finalizing Gemini arbiter & PayPal rails...");
        } else if (next > 30) {
          setStatusText("Configuring autonomous escrow containers...");
        }

        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="landing-preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--fg)] select-none pointer-events-none"
        >
          {/* Subtle ambient lighting */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #78C5EF 0%, #51A0D5 40%, transparent 75%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Animated Brand Icon */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0088cc] flex items-center justify-center text-[#000000]">
                <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
            </motion.div>

            {/* Typography */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-1 mb-6"
            >
              <span className="font-ui font-semibold text-lg sm:text-xl tracking-tight block">
                PayGuard
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--fg-muted)] block">
                Autonomous Escrow Protocol
              </span>
            </motion.div>

            {/* Hairline Progress Bar */}
            <div className="w-56 sm:w-64 space-y-2.5">
              <div className="h-[2px] w-full bg-[var(--border)] rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#78C5EF] to-[#0088cc] rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>

              {/* Status & Counter */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[var(--fg-muted)]">
                <span className="truncate max-w-[190px]">{statusText}</span>
                <span className="tabular-nums font-semibold text-[var(--fg)]">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

