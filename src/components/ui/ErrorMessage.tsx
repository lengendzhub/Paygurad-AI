"use client";

import React from "react";
import { AlertCircle, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Humanizes raw technical error strings into clear, respectful language.
 */
export function toHumanErrorMessage(raw?: string | null): string {
  if (!raw) return "";

  const lower = raw.toLowerCase();

  if (
    lower.includes("popup") ||
    lower.includes("cancel") ||
    lower.includes("closed") ||
    lower.includes("interrupted")
  ) {
    return "Checkout was closed before completion. No funds were deducted.";
  }

  if (lower.includes("missing paypal") || lower.includes("credentials in .env.local")) {
    return "PayPal Sandbox credentials are not configured in .env.local. Add your PayPal sandbox client ID and secret to enable live escrow.";
  }

  if (lower.includes("paypal auth failed")) {
    return "PayPal authentication could not be completed with the sandbox credentials provided.";
  }

  if (lower.includes("create escrow order") || lower.includes("create-order")) {
    return "Unable to connect to PayPal sandbox right now. Please verify your connection and try again.";
  }

  if (lower.includes("capture") || lower.includes("capture-order")) {
    return "PayPal authorization could not be completed. Please check your sandbox account balance and retry.";
  }

  if (lower.includes("rate limit") || lower.includes("quota") || lower.includes("429")) {
    return "Verification service is busy right now. Please wait a moment and try again.";
  }

  if (lower.includes("verification audit") || lower.includes("verify-and-payout")) {
    return "Automated criteria review could not be completed. Your funds remain securely in escrow.";
  }

  if (lower.includes("network") || lower.includes("fetch") || lower.includes("failed to fetch")) {
    return "Network connection lost. Please check your internet connection.";
  }

  // If already a clean sentence, keep it; otherwise soften raw exceptions
  if (raw.length > 120 && (raw.includes("at ") || raw.includes("Error:"))) {
    return "A temporary service error occurred. Please try again in a few seconds.";
  }

  return raw;
}

interface ErrorBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/**
 * Apple-grade quiet error banner with calm typography and zero loud AI-boilerplate styling.
 */
export function ErrorBanner({
  title = "Checkout not completed",
  message,
  onDismiss,
  onRetry,
  retryLabel = "Try Again",
  className = "",
}: ErrorBannerProps) {
  const humanMessage = toHumanErrorMessage(message);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border-strong)] font-ui ${className}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 stroke-[2]" />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="text-xs font-semibold text-[var(--fg)] tracking-tight">
                {title}
              </div>
              <p className="text-xs text-[var(--fg-muted)] font-body leading-relaxed">
                {humanMessage}
              </p>

              {onRetry && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007AFF] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{retryLabel}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss message"
              className="p-1 rounded-lg text-[var(--fg-subtle)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface FormFieldErrorProps {
  message?: string;
  className?: string;
}

/**
 * Minimalist inline form field error without shouting alert icons.
 */
export function FormFieldError({ message, className = "" }: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`text-xs text-rose-400 font-ui mt-1.5 flex items-center gap-1.5 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
      <span>{message}</span>
    </motion.p>
  );
}
