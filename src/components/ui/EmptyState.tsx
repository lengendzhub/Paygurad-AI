"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./Button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface)]
        ${compact ? "p-8" : "p-12 md:p-16"}
      `}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] flex items-center justify-center mb-4 text-[#0088cc]">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="font-display text-2xl font-normal text-[var(--fg)] tracking-tight">
        {title}
      </h3>
      <p className="font-body text-sm md:text-base text-[var(--fg-muted)] max-w-sm mt-2 mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}

      {actionLabel && onAction && !actionHref && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
