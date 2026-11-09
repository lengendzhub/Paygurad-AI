"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Sparkles,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
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
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-500 font-mono">Loading bounty details...</div>}>
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
      <div className="flex items-center justify-between">
        <Link
          href="/bounties"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to bounties</span>
        </Link>

        <span className="text-xs font-mono text-slate-500">
          Created: {new Date(bounty.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Main Header Card */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl">
                {bounty.id}
              </span>
              <StatusChip status={bounty.status} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {bounty.title}
            </h1>
            {bounty.description && (
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {bounty.description}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right shrink-0 bg-white/[0.02] sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-white/[0.06]">
            <div className="text-3xl font-bold font-mono text-emerald-400">
              ${bounty.amount}
            </div>
            <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">
              USD in Escrow
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="pt-4 border-t border-white/[0.06]">
          <Stepper steps={steps} currentStep={activeStep} />
        </div>
      </GlassCard>

      {/* Two-Column Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Requirements & Audit */}
        <div className="lg:col-span-7 space-y-6">
          {/* Criteria Checklist */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-base font-semibold text-white">
                Acceptance Criteria ({bounty.requirements.length})
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                Audited by Gemini
              </span>
            </div>

            <div className="space-y-2.5">
              {bounty.requirements.map((req, idx) => {
                const auditItem = bounty.audit?.criteriaChecklist?.find(
                  (c) => c.criterion === req
                );

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs"
                  >
                    {auditItem ? (
                      auditItem.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-white/[0.08] text-[10px] font-mono text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="text-slate-200 leading-relaxed">{req}</div>
                      {auditItem && (
                        <div className="text-[11px] text-slate-400 leading-relaxed font-mono">
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
              <h2 className="text-base font-semibold text-white">Freelancer Submission</h2>
              <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.06] font-mono text-xs text-slate-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
                  : "bg-rose-500/[0.04] border-rose-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {bounty.audit.approved ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400" />
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {bounty.audit.approved ? "Verification Certified" : "Revision Required"}
                    </h3>
                    <p className="text-xs text-slate-400">
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

              <p className="text-xs text-slate-300 leading-relaxed">
                {bounty.audit.summary}
              </p>
            </GlassCard>
          )}
        </div>

        {/* Right Column: Escrow Financial Details & Action */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Callout */}
          <GlassCard className="p-6 space-y-4 border-blue-500/20 bg-gradient-to-b from-blue-900/10 to-transparent">
            <h2 className="text-base font-semibold text-white">Deliverable Action</h2>

            {bounty.status === "FUNDED_IN_ESCROW" || bounty.status === "REJECTED_NEEDS_WORK" ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {bounty.status === "REJECTED_NEEDS_WORK"
                    ? "The deliverable was rejected by Gemini. Revise the code or text and submit again for autonomous audit."
                    : "The escrow funds are locked and waiting. Submit deliverable code to trigger Gemini AI verification."}
                </p>
                <Link href={`/bounties/${bounty.id}/submit`}>
                  <Button variant="primary" size="lg" className="w-full justify-center">
                    Submit Work for Audit
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : bounty.status === "RELEASED_BY_AI" ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Escrow disbursed! Payout executed via PayPal Payouts v1.</span>
                </div>
                <Link href={`/verification/${bounty.id}`}>
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    View Verification Receipt
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">Deliverable is pending or under audit.</p>
                <Link href={`/verification/${bounty.id}`}>
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Check Verification Screen
                  </Button>
                </Link>
              </div>
            )}
          </GlassCard>

          {/* Escrow Details */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-white">PayPal Escrow Ledger</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Escrow Value</span>
                <span className="font-mono font-bold text-white">${bounty.amount} USD</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Order ID</span>
                <div className="flex items-center gap-2 font-mono text-blue-400">
                  <span className="truncate max-w-[140px]">{bounty.escrowOrderId}</span>
                  <button
                    onClick={() => copyToClipboard(bounty.escrowOrderId)}
                    className="text-slate-500 hover:text-white transition"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                <span className="text-slate-400">Escrow Status</span>
                <StatusChip status={bounty.status} size="sm" />
              </div>
              {bounty.payoutBatchId && (
                <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04]">
                  <span className="text-slate-400">Payout Batch ID</span>
                  <div className="flex items-center gap-2 font-mono text-emerald-400">
                    <span className="truncate max-w-[140px]">{bounty.payoutBatchId}</span>
                    <button
                      onClick={() => copyToClipboard(bounty.payoutBatchId || "")}
                      className="text-slate-500 hover:text-white transition"
                      title="Copy Payout Batch ID"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              {bounty.freelancerEmail && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Recipient Email</span>
                  <span className="font-mono text-slate-300 truncate max-w-[160px]">
                    {bounty.freelancerEmail}
                  </span>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

