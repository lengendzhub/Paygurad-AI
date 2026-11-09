"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  AlertCircle,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { Stepper } from "@/components/ui/Stepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScoreRing } from "@/components/ui/ScoreRing";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BountyDetailPage(props: PageProps) {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-[var(--fg-muted)] font-mono">Loading bounty details...</div>}>
      <BountyDetailContent {...props} />
    </React.Suspense>
  );
}

function BountyDetailContent({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const bounty = usePayGuardStore((state) => state.getBounty(id));

  if (!bounty) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertCircle}
          title="Bounty Not Found"
          description={`No bounty with identifier ${id} was found in your local store. It may have been cleared or never created.`}
          actionLabel="Return to Bounties"
          actionHref="/bounties"
        />
      </div>
    );
  }

  // Stepper logic
  let activeStep = 0;
  if (bounty.status === "SUBMITTED") activeStep = 1;
  if (bounty.status === "VERIFYING") activeStep = 2;
  if (bounty.status === "RELEASED_BY_AI" || bounty.status === "REJECTED_NEEDS_WORK") activeStep = 3;

  const steps = [
    { id: "funded", label: "Escrow Funded" },
    { id: "submitted", label: "Work Submitted" },
    { id: "audited", label: "AI Audit" },
    { id: "settled", label: bounty.status === "RELEASED_BY_AI" ? "Payout Released" : "Settlement" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between font-ui">
        <Link
          href="/bounties"
          className="inline-flex items-center gap-2 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to bounties</span>
        </Link>

        <span className="text-xs font-mono text-[var(--fg-subtle)]">
          Created: {new Date(bounty.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Main Header Card */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#0088cc] bg-[#0088cc]/10 border border-[#0088cc]/20 px-3 py-1 rounded-xl">
                {bounty.id}
              </span>
              <StatusChip status={bounty.status} />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--fg)]">
              {bounty.title}
            </h1>
            {bounty.description && (
              <p className="font-body text-sm text-[var(--fg-muted)] max-w-2xl leading-relaxed">
                {bounty.description}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right shrink-0 bg-[var(--surface-strong)] sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-[var(--border)]">
            <div className="text-3xl font-bold font-mono tabular-nums dark:text-emerald-400 text-emerald-600">
              ${bounty.amount}
            </div>
            <div className="text-[10px] uppercase font-mono text-[var(--fg-subtle)] tracking-wider">
              USD in Escrow
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="pt-4 border-t border-[var(--border)]">
          <Stepper steps={steps} currentStep={activeStep} />
        </div>
      </GlassCard>

      {/* Two-Column Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Requirements & Audit */}
        <div className="lg:col-span-7 space-y-6">
          {/* Criteria Checklist */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h2 className="font-display text-2xl text-[var(--fg)]">
                Acceptance Criteria ({bounty.requirements.length})
              </h2>
              <span className="text-[11px] font-mono text-[var(--fg-muted)]">
                Audited by Gemini
              </span>
            </div>

            <div className="space-y-2.5 font-body">
              {bounty.requirements.map((req, idx) => {
                const auditItem = bounty.audit?.criteriaChecklist?.find(
                  (c) => c.criterion === req
                );

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] flex items-start gap-3 text-xs"
                  >
                    {auditItem ? (
                      auditItem.passed ? (
                        <CheckCircle2 className="w-4 h-4 dark:text-emerald-400 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 dark:text-red-400 text-red-600 shrink-0 mt-0.5" />
                      )
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-[var(--border)] text-[10px] font-mono text-[var(--fg-muted)] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="text-[var(--fg)] leading-relaxed">{req}</div>
                      {auditItem && (
                        <div className="text-[11px] text-[var(--fg-muted)] leading-relaxed font-mono">
                          {auditItem.reason}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Submission Preview if exists */}
          {bounty.submissionText && (
            <GlassCard className="p-6 space-y-3">
              <h2 className="font-display text-2xl text-[var(--fg)]">Freelancer Submission</h2>
              <div className="p-4 rounded-2xl dark:bg-black/60 bg-black/5 border border-[var(--border)] font-mono text-xs text-[var(--fg)] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {bounty.submissionText}
              </div>
            </GlassCard>
          )}

          {/* Audit Result if exists */}
          {bounty.audit && (
            <GlassCard
              className={`p-6 space-y-4 border ${
                bounty.audit.approved
                  ? "bg-emerald-500/[0.04] border-emerald-500/20"
                  : "bg-red-500/[0.04] border-red-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {bounty.audit.approved ? (
                    <CheckCircle2 className="w-6 h-6 dark:text-emerald-400 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 dark:text-red-400 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-display text-2xl text-[var(--fg)]">
                      {bounty.audit.approved ? "Verification Certified" : "Revision Required"}
                    </h3>
                    <p className="font-body text-xs text-[var(--fg-muted)]">
                      Gemini structured criteria evaluation
                    </p>
                  </div>
                </div>

                <ScoreRing
                  score={bounty.audit.score}
                  approved={bounty.audit.approved}
                  size={60}
                />
              </div>

              <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                {bounty.audit.summary}
              </p>
            </GlassCard>
          )}
        </div>

        {/* Right Column: Escrow Financial Details & Action */}
        <div className="lg:col-span-5 space-y-6 font-ui">
          {/* Action Callout */}
          <GlassCard className="p-6 space-y-4 border-[#0088cc]/30 bg-[#0088cc]/5">
            <h2 className="font-display text-2xl text-[var(--fg)]">Deliverable Action</h2>

            {bounty.status === "FUNDED_IN_ESCROW" || bounty.status === "REJECTED_NEEDS_WORK" ? (
              <div className="space-y-3">
                <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                  {bounty.status === "REJECTED_NEEDS_WORK"
                    ? "The deliverable was rejected by Gemini. Revise the code or text and submit again for autonomous audit."
                    : "The escrow funds are locked and waiting. Submit deliverable code to trigger Gemini AI verification."}
                </p>
                <Link href={`/bounties/${bounty.id}/submit`}>
                  <Button variant="primary" size="lg" className="w-full justify-center">
                    Submit Work for Audit
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ) : bounty.status === "RELEASED_BY_AI" ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs dark:text-emerald-400 text-emerald-700 font-medium">
                  Autonomous Payout Disbursed
                </div>
                <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                  This bounty passed 100% of acceptance criteria and payout was disbursed via PayPal Payouts API v1.
                </p>
                {bounty.audit && (
                  <Link href={`/verification/${bounty.id}`}>
                    <Button variant="secondary" size="md" className="w-full justify-center">
                      View Verification Audit
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-body text-xs text-[var(--fg-muted)]">
                  Verification audit currently in progress.
                </p>
              </div>
            )}
          </GlassCard>

          {/* PayPal Escrow Metadata */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="font-display text-2xl text-[var(--fg)]">Escrow Container</h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-[var(--fg-subtle)] uppercase tracking-wider block mb-1">
                  PayPal Order ID
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] font-mono text-[var(--fg)]">
                  <span className="truncate">{bounty.escrowOrderId}</span>
                  <button
                    onClick={() => copyToClipboard(bounty.escrowOrderId)}
                    className="p-1 text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {bounty.payoutBatchId && (
                <div>
                  <span className="text-[11px] text-[var(--fg-subtle)] uppercase tracking-wider block mb-1">
                    PayPal Payout Batch ID
                  </span>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] font-mono dark:text-emerald-400 text-emerald-600">
                    <span className="truncate">{bounty.payoutBatchId}</span>
                    <button
                      onClick={() => copyToClipboard(bounty.payoutBatchId!)}
                      className="p-1 text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
                      title="Copy Payout Batch ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {bounty.freelancerEmail && (
                <div>
                  <span className="text-[11px] text-[var(--fg-subtle)] uppercase tracking-wider block mb-1">
                    Recipient PayPal Sandbox Email
                  </span>
                  <div className="p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] font-mono text-[var(--fg)] truncate">
                    {bounty.freelancerEmail}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
