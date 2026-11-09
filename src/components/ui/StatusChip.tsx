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
      color: "bg-[#007aff]/10 text-[#007aff] border-[#007aff]/25",
      dot: "bg-[#007aff]",
    },
    SUBMITTED: {
      label: "Submitted",
      color: "bg-[var(--surface-strong)] text-[var(--fg-muted)] border-[var(--border)]",
      dot: "bg-[var(--fg-muted)]",
    },
    VERIFYING: {
      label: "Auditing",
      color: "bg-amber-500/10 text-amber-400 border-amber-500/25",
      dot: "bg-amber-400 animate-pulse",
    },
    RELEASED_BY_AI: {
      label: "Released by AI",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      dot: "bg-emerald-400",
    },
    REJECTED_NEEDS_WORK: {
      label: "Needs Revision",
      color: "bg-rose-500/10 text-rose-400 border-rose-500/25",
      dot: "bg-rose-400",
    },
  }[status] || {
    label: status,
    color: "bg-[var(--surface)] text-[var(--fg-muted)] border-[var(--border)]",
    dot: "bg-[var(--fg-muted)]",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px] gap-1.5"
      : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-ui font-medium rounded-md border whitespace-nowrap transition-colors ${sizeClasses} ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}
