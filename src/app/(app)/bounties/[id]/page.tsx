"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  FileQuestion,
  Sparkles,
  Share2,
  Check,
  UserCheck,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { Stepper } from "@/components/ui/Stepper";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { Bounty } from "@/types";

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
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const userRole = usePayGuardStore((state) => state.userRole);
  const setUserRole = usePayGuardStore((state) => state.setUserRole);

  const isFreelancer =
    roleParam === "freelancer" || (roleParam !== "client" && userRole === "freelancer");
  const { id } = use(params);

  const localBounty = usePayGuardStore((state) => state.getBounty(id));
  const fetchBountyById = usePayGuardStore((state) => state.fetchBountyById);

  const [bounty, setBounty] = useState<Bounty | undefined>(localBounty);
  const [loading, setLoading] = useState(!localBounty);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  useEffect(() => {
    if (roleParam === "freelancer" && userRole !== "freelancer") {
      setUserRole("freelancer");
    } else if (roleParam === "client" && userRole !== "client") {
      setUserRole("client");
    }
  }, [roleParam, userRole, setUserRole]);

  useEffect(() => {
    if (localBounty) {
      setBounty(localBounty);
      setLoading(false);
    } else {
      setLoading(true);
      fetchBountyById(id).then((serverBounty) => {
        setBounty(serverBounty);
        setLoading(false);
      });
    }
  }, [id, localBounty, fetchBountyById]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-3 font-ui">
        <div className="w-8 h-8 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-[var(--fg-muted)] font-mono">Loading escrow record from server registry...</p>
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={FileQuestion}
          title="Bounty Not Found"
          description={`No bounty with identifier ${id} was found on the server or in local cache.`}
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

  const copyInviteLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteUrl = `${origin}/bounties/${bounty.id}?role=freelancer`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyOrder = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 font-ui">
      {/* Top Navigation & Role Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-ui">
        <Link
          href="/bounties"
          className="inline-flex items-center gap-2 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to bounties</span>
        </Link>

        {/* Role Separation Controls */}
        <div className="flex items-center gap-2.5">
          {isFreelancer ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Freelancer View</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUserRole("client");
                  router.push(`/bounties/${bounty.id}?role=client`);
                }}
                className="text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] underline underline-offset-4 cursor-pointer"
              >
                Switch to Client View
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/30 font-medium">
                Client View
              </span>
              <button
                type="button"
                onClick={copyInviteLink}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[#007aff] text-white hover:bg-[#007aff]/90 transition cursor-pointer shadow-sm"
                title="Copy shareable link for freelancer to open in their own browser"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Invite Link Copied!" : "Copy Freelancer Invite Link"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserRole("freelancer");
                  router.push(`/bounties/${bounty.id}?role=freelancer`);
                }}
                className="text-xs text-[var(--fg-muted)] hover:text-emerald-400 underline underline-offset-4 cursor-pointer ml-1"
              >
                Preview as Freelancer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#007AFF] bg-[#007AFF]/10 border border-[#007AFF]/20 px-3 py-1 rounded-xl">
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
            <div className="text-3xl font-bold font-mono tabular-nums text-emerald-500">
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

            <div className="space-y-3 font-body">
              {bounty.requirements.map((req, idx) => {
                const auditItem = bounty.audit?.criteriaChecklist?.[idx];
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] flex items-start gap-3 text-xs"
                  >
                    {auditItem ? (
                      auditItem.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
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
                  : "bg-rose-500/[0.04] border-rose-500/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {bounty.audit.approved ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400" />
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
          <GlassCard className="p-6 space-y-4 border-[#007AFF]/30 bg-[#007AFF]/5">
            <h2 className="font-display text-2xl text-[var(--fg)]">
              {isFreelancer ? "Deliverable Action" : "Escrow Status & Handoff"}
            </h2>

            {bounty.status === "FUNDED_IN_ESCROW" || bounty.status === "REJECTED_NEEDS_WORK" ? (
              <div className="space-y-3">
                <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                  {isFreelancer
                    ? `The client committed $${bounty.amount} USD to PayPal Escrow. Deliver your solution matching the acceptance checklist above to initiate the autonomous AI review.`
                    : `Escrow funds ($${bounty.amount} USD) are locked in PayPal. Share the invite link with your freelancer to begin development.`}
                </p>

                {/* Freelancer CTA */}
                <Link href={`/bounties/${bounty.id}/submit`}>
                  <Button variant="primary" size="lg" className="w-full justify-center">
                    <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                    Submit Work for Gemini AI Audit
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                {/* Client Quick Share CTA */}
                {!isFreelancer && (
                  <button
                    type="button"
                    onClick={copyInviteLink}
                    className="w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] text-xs font-semibold text-[var(--fg)] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-[#007aff]" />}
                    <span>{copiedLink ? "Freelancer Link Copied!" : "Copy Shareable Link for Freelancer"}</span>
                  </button>
                )}

                {bounty.submissionText && (
                  <Link href={`/verification/${bounty.id}`}>
                    <Button variant="secondary" size="md" className="w-full justify-center mt-2">
                      <Sparkles className="w-4 h-4 mr-2 text-[#007AFF]" />
                      Run Gemini AI Verification &amp; Payout
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : bounty.status === "RELEASED_BY_AI" ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Autonomous Payout Disbursed</span>
                </div>
                <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                  This bounty passed 100% of acceptance criteria. Payout was executed via PayPal Payouts API v1.
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
                <span className="text-[var(--fg-subtle)] uppercase tracking-wider block font-ui text-[10px]">
                  PayPal Orders v2 Capture ID
                </span>
                <div className="flex items-center justify-between font-mono mt-1 p-2 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)]">
                  <span className="truncate text-[var(--fg)]">{bounty.escrowOrderId}</span>
                  <button
                    onClick={() => copyOrder(bounty.escrowOrderId)}
                    className="p-1 rounded text-[var(--fg-subtle)] hover:text-[var(--fg)] transition cursor-pointer shrink-0"
                    title="Copy Capture ID"
                  >
                    {copiedOrder ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {bounty.payoutBatchId && (
                <div>
                  <span className="text-[var(--fg-subtle)] uppercase tracking-wider block font-ui text-[10px]">
                    PayPal Payouts Batch ID
                  </span>
                  <div className="font-mono mt-1 p-2 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] text-emerald-500 truncate">
                    {bounty.payoutBatchId}
                  </div>
                </div>
              )}

              {bounty.freelancerEmail && (
                <div>
                  <span className="text-[var(--fg-subtle)] uppercase tracking-wider block font-ui text-[10px]">
                    Freelancer Payout Email
                  </span>
                  <div className="font-mono mt-1 text-[var(--fg)]">{bounty.freelancerEmail}</div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
