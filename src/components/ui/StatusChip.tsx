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
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      dot: "bg-blue-400",
    },
    SUBMITTED: {
      label: "Submitted",
      color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      dot: "bg-indigo-400",
    },
    VERIFYING: {
      label: "Auditing",
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      dot: "bg-amber-400 animate-pulse",
    },
    RELEASED_BY_AI: {
      label: "Released by AI",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
    REJECTED_NEEDS_WORK: {
      label: "Needs Revision",
      color: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      dot: "bg-rose-400",
    },
  }[status] || {
    label: status,
    color: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    dot: "bg-slate-400",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2.5 py-0.5 text-[11px] gap-1.5"
      : "px-3 py-1 text-xs gap-2";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border uppercase tracking-wider ${sizeClasses} ${config.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}

