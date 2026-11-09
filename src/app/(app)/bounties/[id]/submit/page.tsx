"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileQuestion,
  Lock,
  Code2,
  Mail,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FormFieldError } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BountySubmitPage(props: PageProps) {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-[var(--fg-muted)] font-mono">Loading submission form...</div>}>
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

  const fillPassingDemo = () => {
    setFreelancerEmail((prev) => prev || "sb-freelancer@personal.example.com");
    if (emailError) setEmailError(null);
    setSubmissionText(`def validate_card(number_str: str) -> bool:
    digits = [int(d) for d in number_str if d.isdigit()]
    checksum = 0
    reverse_digits = digits[::-1]
    for i, d in enumerate(reverse_digits):
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        checksum += d
    return checksum % 10 == 0

# Unit Tests
assert validate_card("4532015112830366") == True
assert validate_card("4532015112830367") == False`);
  };

  const fillFailingDemo = () => {
    setFreelancerEmail((prev) => prev || "sb-freelancer@personal.example.com");
    if (emailError) setEmailError(null);
    setSubmissionText(`def validate_card(number_str):
    # TODO: finish Luhn math later
    return len(number_str) == 16`);
  };

  if (!bounty) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={FileQuestion}
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
      return "Enter PayPal recipient address";
    }
    if (!validateEmail(freelancerEmail)) {
      return "Enter a valid email address (e.g. name@example.com)";
    }
    return undefined;
  };

  const handleSubmit = () => {
    if (!validateEmail(freelancerEmail)) {
      setEmailError("Please enter a valid PayPal email address");
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
    <div className="max-w-6xl mx-auto space-y-8 py-4 font-ui">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/bounties/${bounty.id}`}
          className="inline-flex items-center gap-2 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to bounty details</span>
        </Link>

        <span className="text-xs font-mono text-[#007AFF]">
          Escrow Locked: ${bounty.amount} USD
        </span>
      </div>

      <div>
        <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
          Submit Work for Verification
        </h1>
        <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
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
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1.5">
                  Freelancer PayPal Sandbox Email (Payout Receiver) <span className="dark:text-red-400 text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--fg-subtle)] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={freelancerEmail}
                    onChange={(e) => {
                      setFreelancerEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="name@example.com"
                    className={`w-full bg-[var(--surface)] border rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none font-mono transition ${
                      emailError ? "border-rose-500/50 focus:border-rose-500" : "border-[var(--border)] focus:border-[#007AFF]"
                    }`}
                  />
                </div>
                <FormFieldError message={emailError || undefined} />
                <p className="text-[11px] font-body text-[var(--fg-muted)] mt-1">
                  The PayPal Payouts API will disburse the ${bounty.amount} USD directly to this address upon audit approval.
                </p>
              </div>

              {/* Code / Deliverable Input */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block">
                    Deliverable / Code / Content Submission <span className="dark:text-red-400 text-red-600">*</span>
                  </label>

                  {/* 1-Click Test Code Helpers */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={fillPassingDemo}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-ui bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
                      title="Load fully verified passing code with unit tests"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>✓ Passing Code</span>
                    </button>
                    <button
                      type="button"
                      onClick={fillFailingDemo}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-ui bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
                      title="Load incomplete code missing tests to verify rejection"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>✗ Failing Code</span>
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] overflow-hidden focus-within:border-[#007AFF] transition">
                  <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between text-xs font-mono text-[var(--fg-muted)]">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-[#007AFF]" />
                      <span>submission-payload</span>
                    </div>
                    <span className="text-[11px] text-[var(--fg-subtle)]">
                      Python / JS / Text
                    </span>
                  </div>
                  <textarea
                    rows={12}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Paste your completed code or deliverable here (or click ✓ Passing Code / ✗ Failing Code above)..."
                    className="w-full bg-transparent p-4 text-xs font-mono text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Action Button: Run Gemini Audit & Trigger PayPal Payout */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm font-semibold py-4"
                disabled={!isFormValid}
                disabledReason={getDisabledReason()}
                onClick={handleSubmit}
              >
                <Sparkles className="w-4 h-4 mr-2 text-amber-300 shrink-0" />
                <span>Run Gemini Audit &amp; Trigger PayPal Payout</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Pinned Bounty Context */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-[var(--border)] pb-3">
              <div>
                <span className="font-mono text-xs text-[#007AFF] font-bold">
                  {bounty.id}
                </span>
                <h3 className="font-display text-xl text-[var(--fg)] mt-0.5">
                  {bounty.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono tabular-nums dark:text-emerald-400 text-emerald-600">
                  ${bounty.amount}
                </span>
                <div className="text-[10px] text-[var(--fg-subtle)] uppercase font-mono">
                  in escrow
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block">
                Strict Acceptance Checklist
              </span>
              <div className="space-y-2 font-body">
                {bounty.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--fg)]"
                  >
                    <span className="font-mono text-[#007AFF] shrink-0 mt-0.5 font-bold">
                      {idx + 1}.
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--fg-muted)] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />
              <span>PayPal Escrow Order: {bounty.escrowOrderId.slice(0, 14)}...</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
