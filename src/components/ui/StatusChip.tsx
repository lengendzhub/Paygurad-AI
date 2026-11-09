import React from "react";
import { BountyStatus } from "@/types";

interface StatusChipProps {
  status: BountyStatus;
  size?: "sm" | "md";
}

export function StatusChip({ status, size = "md" }: StatusChipProps) {
  const config = {
    FUNDED_IN_ESCROW: {
      label: "In Escrow",
      color: "bg-[#0088cc]/15 text-[#0088cc] border-[#0088cc]/30",
      dot: "bg-[#0088cc]",
    },
    SUBMITTED: {
      label: "Submitted",
      color: "bg-[var(--surface-strong)] text-[var(--fg-muted)] border-[var(--border-strong)]",
      dot: "bg-[var(--fg-muted)]",
    },
    VERIFYING: {
      label: "Auditing",
      color: "dark:bg-amber-500/15 bg-amber-500/10 dark:text-amber-400 text-amber-700 dark:border-amber-500/30 border-amber-500/30",
      dot: "dark:bg-amber-400 bg-amber-600 animate-pulse",
    },
    RELEASED_BY_AI: {
      label: "Released by AI",
      color: "dark:bg-emerald-500/15 bg-emerald-500/10 dark:text-emerald-400 text-emerald-700 dark:border-emerald-500/30 border-emerald-500/30",
      dot: "dark:bg-emerald-400 bg-emerald-600",
    },
    REJECTED_NEEDS_WORK: {
      label: "Needs Revision",
      color: "dark:bg-red-500/15 bg-red-500/10 dark:text-red-400 text-red-700 dark:border-red-500/30 border-red-500/30",
      dot: "dark:bg-red-400 bg-red-600",
    },
  }[status] || {
    label: status,
    color: "bg-[var(--surface)] text-[var(--fg-muted)] border-[var(--border)]",
    dot: "bg-[var(--fg-muted)]",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-0.5 text-[11px] gap-1.5"
      : "px-3 py-1 text-xs gap-2";

  return (
    <span
      className={`inline-flex items-center font-ui font-medium rounded-full border uppercase tracking-wider ${sizeClasses} ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
