"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  Lock,
  Coins,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function DashboardPage() {
  const bounties = usePayGuardStore((state) => state.bounties);
  const activity = usePayGuardStore((state) => state.activity);

  // Compute Metrics
  const totalLocked = bounties
    .filter((b) => b.status === "FUNDED_IN_ESCROW" || b.status === "SUBMITTED" || b.status === "VERIFYING")
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);

  const activeCount = bounties.filter(
    (b) => b.status === "FUNDED_IN_ESCROW" || b.status === "SUBMITTED" || b.status === "VERIFYING"
  ).length;

  const releasedCount = bounties.filter((b) => b.status === "RELEASED_BY_AI").length;

  const auditedBounties = bounties.filter((b) => b.audit && typeof b.audit.score === "number");
  const avgScore =
    auditedBounties.length > 0
      ? Math.round(
          auditedBounties.reduce((sum, b) => sum + (b.audit?.score || 0), 0) /
            auditedBounties.length
        )
      : null;

  return (
    <div className="space-y-6 font-ui max-w-6xl mx-auto">
      {/* Minimal Header */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
          Dashboard
        </h1>

        <Link href="/bounties/new">
          <Button variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Create Bounty
          </Button>
        </Link>
      </div>

      {/* 4 Minimal Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Escrow */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <Lock className="w-3 h-3 text-[#007aff]" />
            <span>Total Escrow</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--fg)]">
            <AnimatedCounter value={totalLocked} prefix="$" decimals={2} />
          </div>
        </div>

        {/* Active Bounties */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <Coins className="w-3 h-3 text-[#007aff]" />
            <span>Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--fg)]">
            <AnimatedCounter value={activeCount} />
          </div>
        </div>

        {/* Released by AI */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Released by AI</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-500">
            <AnimatedCounter value={releasedCount} />
          </div>
        </div>

        {/* Avg AI Score */}
        <div className="p-4 sm:p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Avg AI Score</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--fg)]">
            {avgScore !== null ? `${avgScore}/100` : "—"}
          </div>
        </div>
      </div>

      {/* Main Grid: Bounties + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active Bounties */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--fg)]">Active Bounties</h2>
              <span className="text-[11px] font-mono text-[var(--fg-muted)] px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)]">
                {bounties.length}
              </span>
            </div>
            {bounties.length > 0 && (
              <Link href="/bounties" className="text-xs text-[#007aff] hover:underline transition">
                View all
              </Link>
            )}
          </div>

          <div className="space-y-2">
            {bounties.slice(0, 4).map((b) => (
              <Link key={b.id} href={`/bounties/${b.id}`} className="block group">
                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)] transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-[#007aff] shrink-0">
                      {b.id}
                    </span>
                    <span className="text-xs font-medium text-[var(--fg)] truncate group-hover:text-[#007aff] transition">
                      {b.title}
                    </span>
                    <div className="hidden sm:block shrink-0">
                      <StatusChip status={b.status} size="sm" />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-bold dark:text-emerald-400 text-emerald-600">
                      ${b.amount} USD
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--fg-muted)] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--fg)]">Recent Activity</h2>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] p-4 space-y-3">
            {activity.length === 0 ? (
              <div className="text-xs text-[var(--fg-muted)] py-4 text-center">
                No activity yet
              </div>
            ) : (
              activity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-[var(--border)]/40 last:border-0">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007aff] shrink-0" />
                    <span className="text-[var(--fg)] truncate font-medium">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--fg-muted)] shrink-0">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Minimal Ledger Table */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--fg)]">Ledger Preview</h2>
          <Link href="/ledger" className="text-xs text-[#007aff] hover:underline flex items-center gap-1">
            <span>Open AG Grid Ledger</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface)] border-b border-[var(--border)] text-[var(--fg-muted)] font-medium text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-normal">ID</th>
                <th className="py-3 px-4 font-normal">Task</th>
                <th className="py-3 px-4 font-normal">Amount</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Score</th>
                <th className="py-3 px-4 font-normal">Payout Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40 font-mono">
              {bounties.slice(0, 4).map((b) => (
                <tr key={b.id} className="hover:bg-[var(--surface)]/60 transition">
                  <td className="py-3 px-4 text-[#007aff] font-bold">{b.id}</td>
                  <td className="py-3 px-4 font-ui text-[var(--fg)] font-medium truncate max-w-xs">{b.title}</td>
                  <td className="py-3 px-4 dark:text-emerald-400 text-emerald-600 font-bold">${b.amount}</td>
                  <td className="py-3 px-4 font-ui">
                    <StatusChip status={b.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-[var(--fg)]">
                    {b.audit ? `${b.audit.score}/100` : "—"}
                  </td>
                  <td className="py-3 px-4 text-[var(--fg-muted)] truncate max-w-[120px]">
                    {b.payoutBatchId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
