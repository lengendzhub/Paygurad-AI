"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";

export default function NewBountyWizardPage() {
  const router = useRouter();
  const addBounty = usePayGuardStore((state) => state.addBounty);

  const [currentStep, setCurrentStep] = useState(0);

  // Form State - STRICTLY EMPTY INITIAL VALUES (Hard Rule #0)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [criteria, setCriteria] = useState<string[]>([""]);

  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Funding State
  const [fundSuccess, setFundSuccess] = useState<any>(null);
  const [fundError, setFundError] = useState<string | null>(null);

  const steps = [
    { id: 0, label: "Details" },
    { id: 1, label: "Criteria" },
    { id: 2, label: "Review" },
    { id: 3, label: "Fund Escrow" },
  ];

  /* Criteria handlers */
  const addCriterion = () => {
    setCriteria([...criteria, ""]);
  };

  const removeCriterion = (index: number) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const updateCriterion = (index: number, val: string) => {
    const updated = [...criteria];
    updated[index] = val;
    setCriteria(updated);
  };

  const moveCriterion = (from: number, to: number) => {
    if (to < 0 || to >= criteria.length) return;
    const updated = [...criteria];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setCriteria(updated);
  };

  /* Step Validation */
  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      if (!title.trim()) newErrors.title = "Task title is required";
      if (!amount.trim()) {
        newErrors.amount = "Reward amount is required";
      } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        newErrors.amount = "Please enter a valid amount greater than $0.00";
      }
    }

    if (step === 1) {
      const validCriteria = criteria.filter((c) => c.trim().length > 0);
      if (validCriteria.length === 0) {
        newErrors.criteria = "At least one clear acceptance criterion is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Stepper Header */}
      <div className="space-y-4 font-ui">
        <button
          onClick={() => (currentStep === 0 ? router.push("/bounties") : handleBack())}
          className="inline-flex items-center gap-2 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{currentStep === 0 ? "Back to bounties" : "Previous step"}</span>
        </button>

        <div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
            Create Escrow Bounty
          </h1>
          <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
            Define requirements and commit escrow funds via PayPal Orders v2.
          </p>
        </div>

        <div className="pt-4 pb-2">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Step Content */}
      <GlassCard className="p-6 sm:p-8 space-y-6">
        {/* STEP 1: DETAILS */}
        {currentStep === 0 && (
          <div className="space-y-5 font-ui">
            <div>
              <h2 className="font-display text-2xl text-[var(--fg)]">Bounty Details</h2>
              <p className="font-body text-xs text-[var(--fg-muted)]">Basic identification and escrow value</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1.5">
                  Task Title <span className="dark:text-red-400 text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-body text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[#007AFF] transition"
                />
                {errors.title && (
                  <p className="text-xs dark:text-red-400 text-red-600 mt-1 flex items-center gap-1 font-body">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1.5">
                  Task Summary & Context (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the expected deliverable..."
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-body text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[#007AFF] transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1.5">
                  Escrow Bounty Amount (USD) <span className="dark:text-red-400 text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] font-mono text-sm">
                    $
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-8 pr-4 py-3 text-sm font-body tabular-nums text-[var(--fg)] font-mono placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[#007AFF] transition"
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs dark:text-red-400 text-red-600 mt-1 flex items-center gap-1 font-body">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[var(--border)]">
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={!title.trim() || !amount.trim()}
                disabledReason="Enter a title and reward amount to continue"
              >
                Continue to Criteria
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CRITERIA BUILDER */}
        {currentStep === 1 && (
          <div className="space-y-5 font-ui">
            <div>
              <h2 className="font-display text-2xl text-[var(--fg)]">Acceptance Criteria Builder</h2>
              <p className="font-body text-xs text-[var(--fg-muted)]">
                Gemini AI will rigorously audit freelancer deliverables against every item defined below.
              </p>
            </div>

            <div className="space-y-3 font-body">
              {criteria.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--surface-strong)] border border-[var(--border)] text-[11px] font-mono text-[var(--fg-muted)] flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCriterion(index, e.target.value)}
                    placeholder="Measurable requirement..."
                    className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[#007AFF] transition"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveCriterion(index, index - 1)}
                      disabled={index === 0}
                      className="p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] disabled:opacity-20 transition cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCriterion(index, index + 1)}
                      disabled={index === criteria.length - 1}
                      className="p-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] disabled:opacity-20 transition cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {criteria.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCriterion(index)}
                        className="p-1.5 text-[var(--fg-muted)] hover:text-red-500 transition cursor-pointer"
                        title="Remove criterion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {errors.criteria && (
                <p className="text-xs dark:text-red-400 text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.criteria}
                </p>
              )}

              <button
                type="button"
                onClick={addCriterion}
                className="inline-flex items-center gap-2 text-xs font-ui font-semibold text-[#007AFF] hover:underline py-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Another Criterion
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <Button variant="ghost" size="md" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={criteria.filter((c) => c.trim().length > 0).length === 0}
                disabledReason="Add at least one non-empty criterion to continue"
              >
                Review Summary
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {currentStep === 2 && (
          <div className="space-y-6 font-ui">
            <div>
              <h2 className="font-display text-2xl text-[var(--fg)]">Review Escrow Commitment</h2>
              <p className="font-body text-xs text-[var(--fg-muted)]">
                Confirm your task details before proceeding to PayPal Checkout.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-[var(--border)] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#007AFF]">
                    Bounty Overview
                  </span>
                  <h3 className="font-display text-xl font-normal text-[var(--fg)] mt-0.5">{title}</h3>
                  {description && (
                    <p className="font-body text-xs text-[var(--fg-muted)] mt-1">{description}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono tabular-nums dark:text-emerald-400 text-emerald-600">
                    ${parseFloat(amount || "0").toFixed(2)}
                  </span>
                  <div className="text-[10px] text-[var(--fg-subtle)] font-mono uppercase">
                    USD Escrow
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)] block">
                  Acceptance Criteria ({criteria.filter((c) => c.trim().length > 0).length})
                </span>
                <div className="space-y-1.5 font-body">
                  {criteria
                    .filter((c) => c.trim().length > 0)
                    .map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-[var(--fg)] bg-[var(--surface)] p-2.5 rounded-xl border border-[var(--border)]"
                      >
                        <span className="font-mono text-[#007AFF]">{i + 1}.</span>
                        <span>{c}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <Button variant="ghost" size="md" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNext}>
                Proceed to PayPal Escrow
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: FUND VIA PAYPAL CHECKOUT (HARD RULE #0: REAL PAYPAL FLOW ONLY) */}
        {currentStep === 3 && (
          <div className="space-y-6 font-ui">
            <div>
              <h2 className="font-display text-2xl text-[var(--fg)]">Authorize Escrow via PayPal</h2>
              <p className="font-body text-xs text-[var(--fg-muted)]">
                Authorize ${parseFloat(amount || "0").toFixed(2)} USD via the official PayPal Sandbox Checkout.
              </p>
            </div>

            {fundError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 dark:text-red-400 text-red-600 text-xs flex items-start gap-2.5 font-body">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 dark:text-red-400 text-red-600" />
                <div>
                  <div className="font-semibold">PayPal Escrow Error</div>
                  <div>{fundError}</div>
                </div>
              </div>
            )}

            {fundSuccess ? (
              <div className="p-6 rounded-[28px] bg-emerald-500/10 border border-emerald-500/25 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 dark:text-emerald-400 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-2xl text-[var(--fg)]">Escrow Successfully Locked!</h3>
                  <p className="font-body text-xs text-[var(--fg-muted)]">
                    Bounty ID: <span className="font-mono text-[#007AFF]">{fundSuccess.id}</span> · Order:{" "}
                    <span className="font-mono dark:text-emerald-400 text-emerald-600">{fundSuccess.escrowOrderId}</span>
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push(`/bounties/${fundSuccess.id}`)}
                  >
                    View Bounty Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => router.push("/dashboard")}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#007AFF]/10 border border-[#007AFF]/20 text-xs text-[var(--fg-muted)] space-y-1 font-body">
                  <div className="font-semibold text-[#007AFF] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    PayPal Orders v2 Non-Custodial Lock
                  </div>
                  <p>
                    Funds will be locked in the PayPal sandbox escrow buffer. The freelancer cannot access funds until Gemini audits and certifies all acceptance criteria.
                  </p>
                </div>

                {/* REAL PAYPAL BUTTON ONLY (No Demo Shortcuts) */}
                <div className="pt-2">
                  <PayPalButtons
                    style={{ layout: "horizontal", height: 44 }}
                    createOrder={async () => {
                      setFundError(null);
                      try {
                        const res = await fetch("/api/paypal/create-order", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ amount, title }),
                        });
                        const order = await res.json();
                        if (!res.ok || order.error) {
                          throw new Error(order.error || "Failed to create escrow order");
                        }
                        return order.id;
                      } catch (err: any) {
                        setFundError(err.message);
                        throw err;
                      }
                    }}
                    onApprove={async (data) => {
                      try {
                        const res = await fetch("/api/paypal/capture-order", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderID: data.orderID }),
                        });
                        const capture = await res.json();
                        if (!res.ok || capture.error) {
                          throw new Error(capture.error || "Failed to capture escrow order");
                        }

                        // Store in real persistent Zustand store
                        const newBounty = addBounty({
                          title,
                          description,
                          requirements: criteria.filter((c) => c.trim().length > 0),
                          amount,
                          escrowOrderId: capture.id || data.orderID,
                        });

                        setFundSuccess(newBounty);
                      } catch (err: any) {
                        setFundError(err.message);
                      }
                    }}
                    onError={() => {
                      setFundError("PayPal popup interrupted or canceled.");
                    }}
                  />
                </div>

                <div className="flex justify-start pt-2">
                  <Button variant="ghost" size="sm" onClick={handleBack}>
                    Back to Review
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
