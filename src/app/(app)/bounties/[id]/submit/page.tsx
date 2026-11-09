"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Lock,
  Code2,
  Mail,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BountySubmitPage(props: PageProps) {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-slate-500 font-mono">Loading submission form...</div>}>
      <BountySubmitContent {...props} />
    </React.Suspense>
  );
}

function BountySubmitContent({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const bounty = usePayGuardStore((state) => state.getBounty(id));
  const updateBountyStatus = usePayGuardStore((state) => state.updateBountyStatus);

  // Form State - STRICTLY EMPTY INITIAL VALUES (Hard Rule #0)
  const [freelancerEmail, setFreelancerEmail] = useState("");
  const [submissionText, setSubmissionText] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isFormValid =
    submissionText.trim().length > 0 &&
    freelancerEmail.trim().length > 0 &&
    validateEmail(freelancerEmail);

  const getDisabledReason = () => {
    if (!submissionText.trim() && !freelancerEmail.trim()) {
      return "Enter your deliverable code/text and PayPal email to continue";
    }
    if (!submissionText.trim()) {
      return "Deliverable submission cannot be empty";
    }
    if (!freelancerEmail.trim()) {
      return "PayPal sandbox receiver email is required";
    }
    if (!validateEmail(freelancerEmail)) {
      return "Please enter a valid email format";
    }
    return undefined;
  };

  const handleSubmit = () => {
    if (!validateEmail(freelancerEmail)) {
      setEmailError("Please enter a valid email format");
      return;
    }

    setEmailError(null);

    // Save submission data into store and mark as VERIFYING
    updateBountyStatus(bounty.id, "VERIFYING", {
      submissionText,
      freelancerEmail,
    });

    // Push directly to signature verification screen
    router.push(`/verification/${bounty.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/bounties/${bounty.id}`}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to bounty details</span>
        </Link>

        <span className="text-xs font-mono text-blue-400">
          Escrow Locked: ${bounty.amount} USD
        </span>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Submit Work for Verification
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload deliverable code or text. Gemini AI will audit criteria and immediately trigger the PayPal Payout.
        </p>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form (Empty by default) */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Freelancer PayPal Sandbox Email (Payout Receiver) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={freelancerEmail}
                    onChange={(e) => {
                      setFreelancerEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="name@example.com"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 font-mono transition"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {emailError}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 mt-1">
                  The PayPal Payouts API will disburse the ${bounty.amount} USD directly to this address upon audit approval.
                </p>
              </div>

              {/* Code / Deliverable Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Deliverable / Code / Content Submission <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    Plaintext / Python / JS
                  </span>
                </div>
                <div className="rounded-2xl border border-white/[0.08] bg-black/40 overflow-hidden focus-within:border-blue-500/40 transition">
                  <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>submission-payload</span>
                  </div>
                  <textarea
                    rows={12}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Paste your completed code or deliverable here..."
                    className="w-full bg-transparent p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center"
                disabled={!isFormValid}
                disabledReason={getDisabledReason()}
                onClick={handleSubmit}
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
                Verify &amp; Trigger Autonomous Payout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Pinned Bounty Context */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
              <div>
                <span className="font-mono text-xs text-blue-400 font-bold">
                  {bounty.id}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {bounty.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ${bounty.amount}
                </span>
                <div className="text-[10px] text-slate-500 uppercase font-mono">
                  in escrow
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Strict Acceptance Checklist
              </span>
              <div className="space-y-2">
                {bounty.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span className="font-mono text-blue-400 shrink-0 mt-0.5 font-bold">
                      {idx + 1}.
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>PayPal Escrow Order: {bounty.escrowOrderId.slice(0, 14)}...</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

