"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Copy,
  DollarSign,
  AlertCircle,
  FileCheck,
  Check,
  ExternalLink,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerificationResult } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STAGES = [
  "Locking submission payload & escrow context",
  "Gemini Flash analyzing deliverable against rules",
  "Checking acceptance criteria & assertions",
  "Authorizing PayPal Payouts v1 disbursement",
];

export default function VerificationSignaturePage(props: PageProps) {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-500 font-mono">Loading verification screen...</div>}>
      <VerificationSignatureContent {...props} />
    </React.Suspense>
  );
}

function VerificationSignatureContent({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const bounty = usePayGuardStore((state) => state.getBounty(id));
  const recordVerification = usePayGuardStore((state) => state.recordVerification);

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isAuditing, setIsAuditing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // If already audited, show stored audit immediately; otherwise run verification!
  const [auditResult, setAuditResult] = useState<VerificationResult | null>(
    bounty?.audit || null
  );
  const [payoutResult, setPayoutResult] = useState<any>(
    bounty?.payoutBatchId
      ? {
          data: {
            batch_header: {
              payout_batch_id: bounty.payoutBatchId,
              batch_status: bounty.payoutStatus || "SUCCESS",
            },
          },
        }
      : null
  );

  const runAudit = async () => {
    if (!bounty) return;
    if (!bounty.submissionText) {
      router.push(`/bounties/${bounty.id}/submit`);
      return;
    }

    setIsAuditing(true);
    setApiError(null);
    setCurrentStageIndex(0);

    // Simulate animated stage progression while API communicates
    const stageTimer1 = setTimeout(() => setCurrentStageIndex(1), 800);
    const stageTimer2 = setTimeout(() => setCurrentStageIndex(2), 1600);
    const stageTimer3 = setTimeout(() => setCurrentStageIndex(3), 2400);

    try {
      const res = await fetch("/api/verify-and-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: bounty.id,
          title: bounty.title,
          requirements: bounty.requirements.join("\n"),
          amount: bounty.amount,
          freelancerEmail: bounty.freelancerEmail || "freelancer@example.com",
          submission: bounty.submissionText,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.audit) {
        throw new Error(data.error || "Failed to execute verification audit");
      }

      setAuditResult(data.audit);
      setPayoutResult(data.payout);

      const batchId =
        data.payout?.data?.batch_header?.payout_batch_id ||
        (data.audit?.approved ? `SANDBOX_PAYOUT_${Date.now()}` : undefined);

      const payoutStatus =
        data.payout?.data?.batch_header?.batch_status ||
        (data.audit?.approved ? "SUCCESS" : undefined);

      // Record in persistent Zustand store
      recordVerification(
        bounty.id,
        data.audit,
        batchId,
        payoutStatus,
        bounty.freelancerEmail
      );
    } catch (err: any) {
      setApiError(err.message || "An unexpected error occurred during verification.");
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    // If not yet audited, trigger automatically on mount
    if (bounty && !bounty.audit && bounty.submissionText && !isAuditing) {
      runAudit();
    }
  }, [bounty?.id]);

  if (!bounty) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertCircle}
          title="Bounty Not Found"
          description={`No bounty with identifier ${id} was found.`}
          actionLabel="Return to Bounties"
          actionHref="/bounties"
        />
      </div>
    );
  }

  const copyBatchId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/bounties/${bounty.id}`}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to bounty</span>
        </Link>

        <span className="text-xs font-mono text-slate-500">
          Order ID: {bounty.escrowOrderId.slice(0, 14)}...
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-blue-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Gemini Autonomous Verification</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {bounty.title}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Escrow Value: ${bounty.amount} USD · Recipient: {bounty.freelancerEmail || "Not specified"}
        </p>
      </div>

      {/* Live Auditing Stage Indicator */}
      {isAuditing && (
        <GlassCard className="p-8 border-purple-500/20 bg-gradient-to-r from-purple-900/10 via-blue-900/10 to-transparent space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 animate-pulse">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Live Escrow Verification in Progress
              </h2>
              <p className="text-xs text-slate-400">
                Communicating with Gemini Flash &amp; PayPal Sandbox rails...
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {STAGES.map((stg, i) => {
              const isPast = currentStageIndex > i;
              const isCurrent = currentStageIndex === i;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                    isCurrent ? "text-white font-medium opacity-100" : isPast ? "text-slate-400 opacity-60" : "text-slate-600 opacity-30"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                      isPast
                        ? "bg-emerald-500/20 text-emerald-400"
                        : isCurrent
                        ? "bg-purple-500/20 text-purple-300 animate-pulse"
                        : "bg-white/[0.04] text-slate-600"
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span>{stg}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Error State with Retry */}
      {apiError && !isAuditing && (
        <GlassCard className="p-6 border-rose-500/20 bg-rose-500/[0.05] space-y-4">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-semibold">Verification Audit Error</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            {apiError}
          </p>
          <div className="pt-2">
            <Button variant="secondary" size="md" onClick={runAudit}>
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Verification
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Audit Verdict Banner & Breakdown */}
      {auditResult && !isAuditing && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`
              rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl space-y-6 shadow-2xl
              ${
                auditResult.approved
                  ? "bg-emerald-500/[0.05] border-emerald-500/25 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                  : "bg-rose-500/[0.05] border-rose-500/25 shadow-[0_0_50px_rgba(244,63,94,0.1)]"
              }
            `}
          >
            {/* Header / Score Ring */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    auditResult.approved ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {auditResult.approved ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : (
                    <XCircle className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h2
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${
                      auditResult.approved ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {auditResult.approved ? "Approved — PayPal Payout Dispatched" : "Rejected — Funds Remain in Escrow"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {auditResult.approved
                      ? "All criteria verified. Funds disbursed to freelancer PayPal address."
                      : "Submission does not fulfill 100% of acceptance criteria."}
                  </p>
                </div>
              </div>

              <div className="self-end sm:self-center">
                <ScoreRing
                  score={auditResult.score}
                  approved={auditResult.approved}
                  size={76}
                />
              </div>
            </div>

            {/* AI Summary */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Gemini Arbiter Verdict
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {auditResult.summary}
              </p>
            </div>

            {/* Criteria Staggered Breakdown */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Criteria Checklist ({auditResult.criteriaChecklist?.length || 0})
              </span>
              <div className="space-y-2">
                {auditResult.criteriaChecklist?.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
                      c.passed
                        ? "bg-emerald-500/[0.04] border-emerald-500/15"
                        : "bg-rose-500/[0.04] border-rose-500/15"
                    }`}
                  >
                    {c.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white">{c.criterion}</div>
                      <div className="text-slate-400 leading-relaxed font-mono text-[11px]">
                        {c.reason}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Official PayPal Payout Receipt (on approval) */}
            {auditResult.approved && (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>PayPal Sandbox Payouts API Receipt</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Payout Batch ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 truncate max-w-[200px]">
                        {payoutResult?.data?.batch_header?.payout_batch_id || bounty.payoutBatchId || "SANDBOX_SIMULATED"}
                      </span>
                      <button
                        onClick={() =>
                          copyBatchId(
                            payoutResult?.data?.batch_header?.payout_batch_id ||
                              bounty.payoutBatchId ||
                              ""
                          )
                        }
                        className="text-slate-500 hover:text-white"
                        title="Copy Batch ID"
                      >
                        {copiedBatch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Disbursement Status</span>
                    <span className="text-emerald-400 font-bold">
                      {payoutResult?.data?.batch_header?.batch_status || "SUCCESS"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Recipient Email</span>
                    <span className="text-slate-300 truncate max-w-[200px]">
                      {bounty.freelancerEmail || "Not specified"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block">Disbursed Amount</span>
                    <span className="text-white font-bold">${bounty.amount} USD</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Resubmit Action */}
            {!auditResult.approved && (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Revise your deliverable according to Gemini feedback and resubmit.
                </p>
                <Link href={`/bounties/${bounty.id}/submit`}>
                  <Button variant="primary" size="md">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Revise &amp; Resubmit Work
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <Link href={`/bounties/${bounty.id}`}>
              <Button variant="ghost" size="sm">
                View Bounty Details
              </Button>
            </Link>
            <Link href="/ledger">
              <Button variant="secondary" size="sm">
                Open AG Grid Ledger
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

