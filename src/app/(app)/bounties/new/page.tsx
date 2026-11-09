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
  HelpCircle,
  ShieldCheck,
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
  const [isFunding, setIsFunding] = useState(false);
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
      <div className="space-y-4">
        <button
          onClick={() => (currentStep === 0 ? router.push("/bounties") : handleBack())}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{currentStep === 0 ? "Back to bounties" : "Previous step"}</span>
        </button>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Create Escrow Bounty</h1>
          <p className="text-sm text-slate-400 mt-1">
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
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Bounty Details</h2>
              <p className="text-xs text-slate-400">Basic identification and escrow value</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition"
                />
                {errors.title && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Task Summary & Context (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the expected deliverable..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Escrow Bounty Amount (USD) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                    $
                  </span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-8 pr-4 py-3 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition"
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/[0.06]">
              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={!title.trim() || !amount.trim()}
                disabledReason="Enter a title and reward amount to continue"
              >
                Continue to Criteria
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CRITERIA BUILDER */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Acceptance Criteria Builder</h2>
              <p className="text-xs text-slate-400">
                Gemini AI will rigorously audit freelancer deliverables against every item defined below.
              </p>
            </div>

            <div className="space-y-3">
              {criteria.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] font-mono text-slate-400 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateCriterion(index, e.target.value)}
                    placeholder="Measurable requirement (e.g. Include at least 2 unit tests)..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 transition"
                  />
                  {criteria.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriterion(index)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="Remove criterion"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {errors.criteria && (
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.criteria}
                </p>
              )}

              <button
                type="button"
                onClick={addCriterion}
                className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 py-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Another Criterion
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
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
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Review Escrow Commitment</h2>
              <p className="text-xs text-slate-400">
                Confirm your task details before proceeding to PayPal Checkout.
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.025] border border-white/[0.08] p-5 space-y-4">
              <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400">
                    Bounty Overview
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{title}</h3>
                  {description && (
                    <p className="text-xs text-slate-400 mt-1">{description}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-emerald-400">
                    ${parseFloat(amount || "0").toFixed(2)}
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono uppercase">
                    USD Escrow
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Acceptance Criteria ({criteria.filter((c) => c.trim().length > 0).length})
                </span>
                <div className="space-y-1.5">
                  {criteria
                    .filter((c) => c.trim().length > 0)
                    .map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]"
                      >
                        <span className="font-mono text-blue-400">{i + 1}.</span>
                        <span>{c}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <Button variant="ghost" size="md" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNext}>
                Proceed to PayPal Escrow
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: FUND VIA PAYPAL CHECKOUT (HARD RULE #0: REAL PAYPAL FLOW ONLY) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Authorize Escrow via PayPal</h2>
              <p className="text-xs text-slate-400">
                Authorize ${parseFloat(amount || "0").toFixed(2)} USD via the official PayPal Sandbox Checkout.
              </p>
            </div>

            {fundError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <div className="font-semibold">PayPal Escrow Error</div>
                  <div>{fundError}</div>
                </div>
              </div>
            )}

            {fundSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Escrow Successfully Locked!</h3>
                  <p className="text-xs text-slate-300">
                    Bounty ID: <span className="font-mono text-blue-400">{fundSuccess.id}</span> · Order:{" "}
                    <span className="font-mono text-emerald-400">{fundSuccess.escrowOrderId}</span>
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push(`/bounties/${fundSuccess.id}`)}
                  >
                    View Bounty Details
                    <ArrowRight className="w-4 h-4" />
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
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-blue-300 flex items-center gap-1.5">
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
                    onError={(err) => {
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

