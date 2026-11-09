"use client";

import React, { useState, useMemo, useEffect } from "react";
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

type StatusFilterType = "ALL" | "ACTIVE" | "RELEASED" | "REVISION";

export default function DashboardPage() {
  const bounties = usePayGuardStore((state) => state.bounties);
  const activity = usePayGuardStore((state) => state.activity);
  const fetchBountiesFromServer = usePayGuardStore((state) => state.fetchBountiesFromServer);

  useEffect(() => {
    fetchBountiesFromServer();
  }, [fetchBountiesFromServer]);

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("ALL");

  // Compute Metrics
  const totalLocked = bounties
    .filter((b) => b.status === "FUNDED_IN_ESCROW" || b.status === "SUBMITTED" || b.status === "VERIFYING")
    .reduce((sum, b) => sum + parseFloat(b.amount || "0"), 0);

  const activeCount = bounties.filter(
    (b) => b.status === "FUNDED_IN_ESCROW" || b.status === "SUBMITTED" || b.status === "VERIFYING"
  ).length;

  const releasedCount = bounties.filter((b) => b.status === "RELEASED_BY_AI").length;
  const revisionCount = bounties.filter((b) => b.status === "REJECTED_NEEDS_WORK").length;

  const auditedBounties = bounties.filter((b) => b.audit && typeof b.audit.score === "number");
  const avgScore =
    auditedBounties.length > 0
      ? Math.round(
          auditedBounties.reduce((sum, b) => sum + (b.audit?.score || 0), 0) /
            auditedBounties.length
        )
      : null;

  // Filter Bounties by Selected Status
  const filteredBounties = useMemo(() => {
    return bounties.filter((b) => {
      if (statusFilter === "ALL") return true;
      if (statusFilter === "ACTIVE") {
        return (
          b.status === "FUNDED_IN_ESCROW" ||
          b.status === "SUBMITTED" ||
          b.status === "VERIFYING"
        );
      }
      if (statusFilter === "RELEASED") {
        return b.status === "RELEASED_BY_AI";
      }
      if (statusFilter === "REVISION") {
        return b.status === "REJECTED_NEEDS_WORK";
      }
      return true;
    });
  }, [bounties, statusFilter]);

  const filterTabs = [
    { label: "All", value: "ALL" as const, count: bounties.length },
    { label: "Active", value: "ACTIVE" as const, count: activeCount },
    { label: "Released", value: "RELEASED" as const, count: releasedCount },
    { label: "Needs Revision", value: "REVISION" as const, count: revisionCount },
  ];

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

      {/* 4 Interactive Metric Cards (Click to filter) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Escrow */}
        <button
          type="button"
          onClick={() => setStatusFilter((prev) => (prev === "ACTIVE" ? "ALL" : "ACTIVE"))}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "ACTIVE"
              ? "border-[#007aff] bg-[#007aff]/10 shadow-sm"
              : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)]"
          }`}
          title="Filter by Active Escrows"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <Lock className="w-3 h-3 text-[#007aff]" />
            <span>Total Escrow</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--fg)] mt-1">
            <AnimatedCounter value={totalLocked} prefix="$" decimals={2} />
          </div>
        </button>

        {/* Active Bounties */}
        <button
          type="button"
          onClick={() => setStatusFilter((prev) => (prev === "ACTIVE" ? "ALL" : "ACTIVE"))}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "ACTIVE"
              ? "border-[#007aff] bg-[#007aff]/10 shadow-sm"
              : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)]"
          }`}
          title="Filter by Active Bounties"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <Coins className="w-3 h-3 text-[#007aff]" />
            <span>Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--fg)] mt-1">
            <AnimatedCounter value={activeCount} />
          </div>
        </button>

        {/* Released by AI */}
        <button
          type="button"
          onClick={() => setStatusFilter((prev) => (prev === "RELEASED" ? "ALL" : "RELEASED"))}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "RELEASED"
              ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
              : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)]"
          }`}
          title="Filter by Released Bounties"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Released by AI</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-500 mt-1">
            <AnimatedCounter value={releasedCount} />
          </div>
        </button>

        {/* Avg AI Score */}
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "border-[var(--border)] bg-[var(--surface-strong)]"
              : "border-[var(--border)] bg-[var(--surface-strong)] hover:border-[var(--border-strong)]"
          }`}
          title="Show all bounties"
        >
          <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--fg-muted)]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Avg AI Score</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-[var(--fg)] mt-1">
            {avgScore !== null ? `${avgScore}/100` : "—"}
          </div>
        </button>
      </div>

      {/* Main Grid: Bounties + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Bounties with Status Filter */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[var(--fg)]">Bounties</h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)] text-xs overflow-x-auto">
              {filterTabs.map((tab) => {
                const isActive = statusFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`px-2.5 py-1 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#007aff] text-white shadow-sm"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--surface-strong)] text-[var(--fg-muted)]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {filteredBounties.length === 0 ? (
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-center space-y-2">
                <p className="text-xs text-[var(--fg-muted)]">
                  No bounties currently matching this status filter.
                </p>
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className="text-xs text-[#007aff] font-semibold hover:underline cursor-pointer"
                >
                  Reset filter to view all
                </button>
              </div>
            ) : (
              filteredBounties.slice(0, 5).map((b) => (
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
              ))
            )}
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

      {/* Minimal Ledger Table with Matching Filter */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--fg)]">Ledger Preview</h2>
            {statusFilter !== "ALL" && (
              <span className="text-[10px] font-mono text-[#007aff] bg-[#007aff]/10 px-2 py-0.5 rounded-full border border-[#007aff]/20">
                Filtered: {statusFilter}
              </span>
            )}
          </div>
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
              {filteredBounties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-[var(--fg-muted)] font-ui">
                    No ledger entries matching this status.
                  </td>
                </tr>
              ) : (
                filteredBounties.slice(0, 5).map((b) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
