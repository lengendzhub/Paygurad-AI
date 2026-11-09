"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Coins,
  TableProperties,
  Clock,
  ExternalLink,
  X,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { AccentText } from "@/components/marketing/AccentText";

export default function DashboardPage() {
  const bounties = usePayGuardStore((state) => state.bounties);
  const activity = usePayGuardStore((state) => state.activity);
  const hasDismissedTour = usePayGuardStore((state) => state.hasDismissedTour);
  const dismissTour = usePayGuardStore((state) => state.dismissTour);

  // Compute metrics strictly from real store data
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
            Dashboard
          </h1>
          <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
            Real-time overview of active escrow reserves, verification audits, and automated disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/bounties/new">
            <Button variant="primary" size="md">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Bounty
            </Button>
          </Link>
        </div>
      </div>

      {/* First-Run Onboarding Banner (Dismissible, remembered in store) */}
      {!hasDismissedTour && bounties.length === 0 && (
        <GlassCard className="p-6 md:p-8 border-[#0088cc]/30 bg-[#0088cc]/5 relative overflow-hidden">
          <button
            onClick={dismissTour}
            className="absolute top-4 right-4 p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-full bg-[var(--surface-strong)] transition cursor-pointer"
            title="Dismiss Tour"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] text-xs font-ui uppercase tracking-wider font-semibold">
              First-Run Guide
            </div>
            <h2 className="font-display text-3xl font-normal text-[var(--fg)] tracking-tight">
              Create your first{" "}
              <AccentText preset="linear" className="font-normal">
                bounty
              </AccentText>
            </h2>
            <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
              Your system starts with zero stored records. In three steps, you can fund a live bounty via PayPal Sandbox, submit a deliverable, and watch Gemini certify the work and disburse payouts automatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-ui">
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[#0088cc] font-bold">1. Define Criteria</span>
                <p className="text-[var(--fg-muted)]">Specify acceptance requirements and amount.</p>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <span className="font-mono text-[#0088cc] font-bold">2. PayPal Checkout</span>
                <p className="text-[var(--fg-muted)]">Lock escrow securely via PayPal Orders v2.</p>
              </div>
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <span className="font-mono dark:text-emerald-400 text-emerald-600 font-bold">3. Autonomous Payout</span>
                <p className="text-[var(--fg-muted)]">Gemini audits work & releases PayPal Payout.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/bounties/new">
                <Button variant="primary" size="sm">
                  Create First Escrow Bounty
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Escrow Locked */}
        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-ui font-semibold uppercase tracking-wider text-[#0088cc]">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Total Escrow Locked
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            <AnimatedCounter
              value={totalLocked}
              prefix="$"
              decimals={2}
            />
          </div>
          <p className="text-xs font-ui text-[var(--fg-muted)]">
            {activeCount === 0 ? "No active funds held in escrow" : `${activeCount} active escrow reserves`}
          </p>
        </GlassCard>

        {/* Active Bounties */}
        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-ui font-semibold uppercase tracking-wider text-[#0088cc]">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              Active Bounties
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            <AnimatedCounter value={activeCount} />
          </div>
          <p className="text-xs font-ui text-[var(--fg-muted)]">
            {activeCount === 0 ? "Awaiting new bounty creation" : "Awaiting deliverable submission or audit"}
          </p>
        </GlassCard>

        {/* Released by AI */}
        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-ui font-semibold uppercase tracking-wider dark:text-emerald-400 text-emerald-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Released by AI
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            <AnimatedCounter value={releasedCount} />
          </div>
          <p className="text-xs font-ui text-[var(--fg-muted)]">
            {releasedCount === 0 ? "No payouts disbursed yet" : "Autonomous PayPal Payouts dispatched"}
          </p>
        </GlassCard>

        {/* Average AI Score */}
        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-ui font-semibold uppercase tracking-wider dark:text-amber-400 text-amber-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Avg AI Score
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            {avgScore !== null ? `${avgScore}/100` : "—"}
          </div>
          <p className="text-xs font-ui text-[var(--fg-muted)]">
            {auditedBounties.length === 0 ? "No completed audits yet" : `Based on ${auditedBounties.length} verification audits`}
          </p>
        </GlassCard>
      </div>

      {/* Main Grid: Active Escrows + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Active Escrows List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-[var(--fg)]">Active Escrow Bounties</h2>
              <p className="font-body text-xs text-[var(--fg-muted)]">Bounties awaiting work completion or audit</p>
            </div>
            {bounties.length > 0 && (
              <Link href="/bounties" className="font-ui text-xs text-[#0088cc] hover:underline transition">
                View all ({bounties.length})
              </Link>
            )}
          </div>

          {bounties.length === 0 ? (
            <EmptyState
              icon={Coins}
              title="No active bounties yet"
              description="Create a bounty and lock escrow funds via PayPal Checkout to start auditing freelancer deliverables."
              actionLabel="Create First Bounty"
              actionHref="/bounties/new"
            />
          ) : (
            <div className="space-y-3">
              {bounties.slice(0, 4).map((b) => (
                <Link key={b.id} href={`/bounties/${b.id}`}>
                  <GlassCard className="p-5 hover:border-[var(--border-strong)] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#0088cc]">
                          {b.id}
                        </span>
                        <StatusChip status={b.status} size="sm" />
                      </div>
                      <h3 className="font-ui text-sm font-semibold text-[var(--fg)]">{b.title}</h3>
                      <p className="font-body text-xs text-[var(--fg-muted)] line-clamp-1">
                        {b.requirements.length} acceptance criteria defined
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-base font-bold font-mono dark:text-emerald-400 text-emerald-600">
                          ${b.amount} USD
                        </div>
                        <div className="text-[10px] text-[var(--fg-subtle)] font-mono">
                          Order: {b.escrowOrderId.slice(0, 14)}...
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--fg-muted)]" />
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Activity Stream */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl text-[var(--fg)]">Recent Activity</h2>
              <p className="font-body text-xs text-[var(--fg-muted)]">Real-time escrow event audit log</p>
            </div>
          </div>

          {activity.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No activity recorded"
              description="Events like escrow funding, deliverable submissions, and payouts will appear here in real time."
              compact
            />
          ) : (
            <GlassCard className="p-5 space-y-4">
              <div className="space-y-3 font-body">
                {activity.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#0088cc] mt-1 shrink-0" />
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[var(--fg)] truncate">{item.title}</span>
                        <span className="text-[10px] text-[var(--fg-subtle)] font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-[var(--fg-muted)] text-[11px] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Ledger Compact Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[var(--fg)]">Escrow & Payout Ledger Preview</h2>
            <p className="font-body text-xs text-[var(--fg-muted)]">Permanent record of PayPal authorizations and disbursement batch IDs</p>
          </div>
          <Link href="/ledger">
            <Button variant="ghost" size="sm">
              Open Full AG Grid Ledger
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {bounties.length === 0 ? (
          <EmptyState
            icon={TableProperties}
            title="Ledger is currently empty"
            description="Once you fund an escrow bounty or run an AI verification audit, transaction rows will record here."
            actionLabel="Create Bounty to Seed Ledger"
            actionHref="/bounties/new"
            compact
          />
        ) : (
          <div className="overflow-x-auto rounded-[28px] border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs font-body">
              <thead className="bg-[var(--surface-strong)] border-b border-[var(--border)] text-[var(--fg-muted)] font-ui font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Bounty ID</th>
                  <th className="p-4">Task Title</th>
                  <th className="p-4">Escrow Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Payout Batch ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {bounties.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-[var(--surface-strong)] transition">
                    <td className="p-4 font-mono font-bold text-[#0088cc]">{b.id}</td>
                    <td className="p-4 text-[var(--fg)] font-medium truncate max-w-xs">{b.title}</td>
                    <td className="p-4 font-mono tabular-nums dark:text-emerald-400 text-emerald-600 font-bold">${b.amount}</td>
                    <td className="p-4">
                      <StatusChip status={b.status} size="sm" />
                    </td>
                    <td className="p-4 font-body tabular-nums">
                      {b.audit ? `${b.audit.score}/100` : "—"}
                    </td>
                    <td className="p-4 font-mono text-[var(--fg-muted)] truncate max-w-[140px]">
                      {b.payoutBatchId || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
