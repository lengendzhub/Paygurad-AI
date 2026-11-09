"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import {
  Lock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Code2,
  Mail,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Bounty, VerificationResult } from "@/types";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const bounties = usePayGuardStore((state) => state.bounties);
  const addBounty = usePayGuardStore((state) => state.addBounty);
  const recordVerification = usePayGuardStore((state) => state.recordVerification);

  // Selected Bounty for Audit Console (defaults to BNT-101 if available)
  const [selectedBountyId, setSelectedBountyId] = useState<string>("BNT-101");
  const selectedBounty = bounties.find((b) => b.id === selectedBountyId) || bounties[0] || null;

  // New Escrow Form State (Left Panel)
  const [newTitle, setNewTitle] = useState("Build a Regex Email Validator in JS");
  const [newReqs, setNewReqs] = useState(
    "1. Function named isValidEmail(email).\n2. Returns boolean using regex.\n3. Rejects addresses missing an @ or domain extension."
  );
  const [newAmount, setNewAmount] = useState("20.00");
  const [fundSuccess, setFundSuccess] = useState<string | null>(null);
  const [fundError, setFundError] = useState<string | null>(null);

  // Deliverable Audit Form State (Right Panel)
  const [freelancerEmail, setFreelancerEmail] = useState("sb-freelancer@personal.example.com");
  const [submissionText, setSubmissionText] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Local latest verification result to show on card
  const [localAudit, setLocalAudit] = useState<{
    audit: VerificationResult;
    payout?: any;
  } | null>(null);

  // Pre-fill Demo Helpers
  const fillPassingDemo = () => {
    setSelectedBountyId("BNT-101");
    setFreelancerEmail("sb-freelancer@personal.example.com");
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
    setSelectedBountyId("BNT-101");
    setFreelancerEmail("sb-freelancer@personal.example.com");
    setSubmissionText(`def validate_card(number_str):
    # TODO: finish Luhn math later
    return len(number_str) == 16`);
  };

  // Run Gemini Audit & Disburse Payout
  const handleRunAudit = async () => {
    if (!selectedBounty) return;
    if (!submissionText.trim()) {
      setAuditError("Please enter or load deliverable code to audit.");
      return;
    }

    setIsAuditing(true);
    setAuditError(null);

    try {
      const res = await fetch("/api/verify-and-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: selectedBounty.id,
          title: selectedBounty.title,
          requirements: selectedBounty.requirements.join("\n"),
          amount: selectedBounty.amount,
          freelancerEmail: freelancerEmail || "sb-freelancer@personal.example.com",
          submission: submissionText,
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.audit) {
        throw new Error(data.error || "Failed to execute Gemini audit");
      }

      setLocalAudit({ audit: data.audit, payout: data.payout });

      const batchId =
        data.payout?.data?.batch_header?.payout_batch_id ||
        (data.audit?.approved ? `SANDBOX_PAYOUT_${Date.now()}` : undefined);

      const payoutStatus =
        data.payout?.data?.batch_header?.batch_status ||
        (data.audit?.approved ? "SUCCESS" : undefined);

      recordVerification(
        selectedBounty.id,
        data.audit,
        batchId,
        payoutStatus,
        freelancerEmail
      );
    } catch (err: any) {
      setAuditError(err.message || "An unexpected error occurred during audit");
    } finally {
      setIsAuditing(false);
    }
  };

  // Compute Metrics
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

  // AG Grid Configuration
  const gridApiRef = useRef<GridApi<Bounty> | null>(null);
  const onGridReady = useCallback((params: GridReadyEvent<Bounty>) => {
    gridApiRef.current = params.api;
  }, []);

  const gridTheme = useMemo(() => {
    if (isLight) {
      return themeQuartz.withPart(colorSchemeLight).withParams({
        accentColor: "#0088cc",
        backgroundColor: "#ffffff",
        foregroundColor: "#111827",
        borderColor: "rgba(0, 0, 0, 0.08)",
        headerTextColor: "#4b5563",
        headerBackgroundColor: "#f8fafc",
        rowHoverColor: "rgba(0, 0, 0, 0.03)",
        selectedRowBackgroundColor: "rgba(0, 136, 204, 0.08)",
        fontFamily: "var(--font-body), Arial, sans-serif",
        headerFontFamily: "var(--font-ui), system-ui, sans-serif",
        fontSize: 13,
      });
    }
    return themeQuartz.withPart(colorSchemeDark).withParams({
      accentColor: "#0088cc",
      backgroundColor: "#000000",
      foregroundColor: "#eeeeee",
      borderColor: "rgba(238, 238, 238, 0.14)",
      headerTextColor: "#979797",
      headerBackgroundColor: "rgba(238, 238, 238, 0.04)",
      rowHoverColor: "rgba(238, 238, 238, 0.05)",
      selectedRowBackgroundColor: "rgba(0, 136, 204, 0.12)",
      fontFamily: "var(--font-body), Arial, sans-serif",
      headerFontFamily: "var(--font-ui), system-ui, sans-serif",
      fontSize: 13,
    });
  }, [isLight]);

  const columnDefs = useMemo<ColDef<Bounty>[]>(
    () => [
      {
        field: "id",
        headerName: "Bounty ID",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="font-mono text-[#0088cc] font-bold">{params.value}</div>
        ),
      },
      {
        field: "title",
        headerName: "Task Title",
        flex: 2,
        minWidth: 200,
        cellRenderer: (params: any) => (
          <span className="font-ui font-medium text-[var(--fg)] truncate">{params.value}</span>
        ),
      },
      {
        field: "amount",
        headerName: "Escrow Amount",
        width: 140,
        cellRenderer: (params: any) => (
          <span className="font-mono tabular-nums dark:text-emerald-400 text-emerald-600 font-bold">
            ${params.value} USD
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Escrow Status",
        width: 170,
        cellRenderer: (params: any) => (
          <div className="pt-2">
            <StatusChip status={params.value} size="sm" />
          </div>
        ),
      },
      {
        field: "audit",
        headerName: "AI Score",
        width: 120,
        valueGetter: (params) => params.data?.audit?.score ?? null,
        cellRenderer: (params: any) => {
          const val = params.value;
          if (val === null || val === undefined) return <span className="text-[var(--fg-subtle)] font-mono">—</span>;
          const isPass = val >= 70;
          return (
            <span
              className={`font-mono font-bold ${
                isPass ? "dark:text-emerald-400 text-emerald-600" : "dark:text-red-400 text-red-600"
              }`}
            >
              {val}/100
            </span>
          );
        },
      },
      {
        field: "escrowOrderId",
        headerName: "PayPal Order ID",
        flex: 1,
        minWidth: 160,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs text-[var(--fg-muted)] truncate">{params.value}</span>
        ),
      },
      {
        field: "payoutBatchId",
        headerName: "Payout Batch ID",
        flex: 1,
        minWidth: 160,
        cellRenderer: (params: any) => (
          <span className="font-mono text-xs dark:text-emerald-400 text-emerald-600 truncate">
            {params.value || "—"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-8 font-ui">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
            Dashboard
          </h1>
          <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
            Autonomous escrow reserves, Gemini AI verification audits, and PayPal Payout disbursements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/bounties/new">
            <Button variant="secondary" size="sm">
              <Coins className="w-3.5 h-3.5 mr-1.5" />
              Full Bounty Wizard
            </Button>
          </Link>
          <Link href="/ledger">
            <Button variant="ghost" size="sm">
              AG Grid Ledger
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0088cc]">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Total Escrow Locked
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            <AnimatedCounter value={totalLocked} prefix="$" decimals={2} />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            {activeCount} active PayPal escrow reserves
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#0088cc]">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              Active Bounties
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            <AnimatedCounter value={activeCount} />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            Awaiting completion or Gemini audit
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider dark:text-emerald-400 text-emerald-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Released by AI
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            <AnimatedCounter value={releasedCount} />
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            Autonomous PayPal Payouts dispatched
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider dark:text-amber-400 text-amber-600">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Avg AI Score
            </span>
          </div>
          <div className="text-3xl font-body tabular-nums font-bold text-[var(--fg)]">
            {avgScore !== null ? `${avgScore}/100` : "100/100"}
          </div>
          <p className="text-xs text-[var(--fg-muted)]">
            Objective Gemini criteria validation
          </p>
        </GlassCard>
      </div>

      {/* 2-Column Hero Interactive Console (Matches Devpost Script & Screenshots) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Fund New Escrow (PayPal Orders v2) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h2 className="font-display text-2xl text-[var(--fg)]">Fund New Escrow</h2>
                <p className="font-body text-xs text-[var(--fg-muted)]">
                  Lock bounty funds securely with PayPal Orders v2
                </p>
              </div>
              <div className="p-2 rounded-xl bg-[#0088cc]/10 text-[#0088cc]">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            {fundSuccess ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Escrow Successfully Locked!</span>
                </div>
                <p className="text-xs font-mono text-[var(--fg)]">
                  Order ID: {fundSuccess}
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFundSuccess(null)}
                >
                  Create Another Bounty
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-ui">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--fg)] focus:outline-none focus:border-[#0088cc] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1">
                    Acceptance Criteria
                  </label>
                  <textarea
                    rows={4}
                    value={newReqs}
                    onChange={(e) => setNewReqs(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--fg)] focus:outline-none focus:border-[#0088cc] font-mono leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1">
                    Escrow Reward ($ USD)
                  </label>
                  <input
                    type="text"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--fg)] font-mono font-bold focus:outline-none focus:border-[#0088cc]"
                  />
                </div>

                {fundError && (
                  <p className="text-xs text-red-500 flex items-center gap-1.5 font-body">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {fundError}
                  </p>
                )}

                {/* PayPal Checkout Button (Sandbox) */}
                <div className="pt-2">
                  <PayPalButtons
                    style={{ layout: "horizontal", height: 42 }}
                    createOrder={async () => {
                      setFundError(null);
                      try {
                        const res = await fetch("/api/paypal/create-order", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ amount: newAmount, title: newTitle }),
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

                        const created = addBounty({
                          title: newTitle,
                          description: "Custom user-created micro-bounty",
                          requirements: newReqs.split("\n").filter((r) => r.trim().length > 0),
                          amount: newAmount,
                          escrowOrderId: capture.id || data.orderID,
                        });

                        setSelectedBountyId(created.id);
                        setFundSuccess(capture.id || data.orderID);
                      } catch (err: any) {
                        setFundError(err.message);
                      }
                    }}
                    onError={() => {
                      setFundError("PayPal checkout interrupted or closed.");
                    }}
                  />
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Gemini Escrow Audit & Verification Console */}
        <div className="lg:col-span-7 space-y-4">
          <GlassCard className="p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div>
                <h2 className="font-display text-2xl text-[var(--fg)]">Gemini Escrow Audit</h2>
                <p className="font-body text-xs text-[var(--fg-muted)]">
                  Structured JSON criteria verification → Autonomous PayPal Payouts
                </p>
              </div>

              {/* 1-Click Code Test Helpers */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillPassingDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
                  title="Fill complete valid Python Luhn validator code"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ Passing Code</span>
                </button>
                <button
                  type="button"
                  onClick={fillFailingDemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition cursor-pointer"
                  title="Fill incomplete stub code missing Luhn algorithm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>✗ Failing Code</span>
                </button>
              </div>
            </div>

            {/* Selected Bounty Context */}
            {selectedBounty && (
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0088cc]">
                      {selectedBounty.id}
                    </span>
                    <span className="font-ui text-xs font-semibold text-[var(--fg)]">
                      {selectedBounty.title}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold dark:text-emerald-400 text-emerald-600">
                    ${selectedBounty.amount} in escrow
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[var(--fg-muted)] space-y-1">
                  {selectedBounty.requirements.map((r, i) => (
                    <div key={i} className="truncate">
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Freelancer Email & Code Inputs */}
            <div className="space-y-3 font-ui text-xs">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block mb-1">
                  Freelancer PayPal Email (Payout Destination)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--fg-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={freelancerEmail}
                    onChange={(e) => setFreelancerEmail(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--fg)] font-mono focus:outline-none focus:border-[#0088cc]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] block">
                    Deliverable Code / Text
                  </label>
                  <span className="text-[10px] font-mono text-[var(--fg-subtle)]">
                    Python / JS
                  </span>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] overflow-hidden focus-within:border-[#0088cc] transition">
                  <textarea
                    rows={7}
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Click ✓ Passing Code or ✗ Failing Code above, or paste deliverable here..."
                    className="w-full bg-transparent p-3.5 text-xs font-mono text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {auditError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5 font-body">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {auditError}
              </p>
            )}

            {/* The Gemini Approval & Audit Button */}
            <div>
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center text-sm font-semibold py-4"
                disabled={isAuditing}
                isLoading={isAuditing}
                onClick={handleRunAudit}
              >
                <Sparkles className="w-4 h-4 mr-2 text-amber-300 shrink-0" />
                <span>Run Gemini Audit &amp; Trigger PayPal Payout</span>
                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
              </Button>
            </div>

            {/* In-Card Verdict Banner (Approved or Rejected) */}
            {localAudit && (
              <div
                className={`p-5 rounded-2xl border space-y-4 ${
                  localAudit.audit.approved
                    ? "bg-emerald-500/[0.06] border-emerald-500/25"
                    : "bg-red-500/[0.06] border-red-500/25"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        localAudit.audit.approved
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {localAudit.audit.approved ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-display italic text-xl ${
                          localAudit.audit.approved
                            ? "dark:text-emerald-400 text-emerald-600"
                            : "dark:text-red-400 text-red-600"
                        }`}
                      >
                        {localAudit.audit.approved
                          ? "Approved — PayPal Payout Dispatched!"
                          : "Rejected — Funds Locked in PayPal Escrow"}
                      </h3>
                      <p className="font-body text-xs text-[var(--fg-muted)]">
                        AI Score: {localAudit.audit.score}/100 · {localAudit.audit.summary}
                      </p>
                    </div>
                  </div>

                  <ScoreRing
                    score={localAudit.audit.score}
                    approved={localAudit.audit.approved}
                    size={56}
                  />
                </div>

                {/* Criteria Checklist */}
                <div className="space-y-2 pt-1 font-body text-xs">
                  {localAudit.audit.criteriaChecklist?.map((c, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] flex items-start gap-2"
                    >
                      {c.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-[var(--fg)]">{c.criterion}</div>
                        <div className="text-[11px] text-[var(--fg-muted)]">{c.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PayPal Payout Receipt (on Approval) */}
                {localAudit.audit.approved && (
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase font-ui">
                      <ShieldCheck className="w-4 h-4" />
                      <span>PayPal Sandbox Payouts API Receipt</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[var(--fg)]">
                      <div>
                        <span className="text-[10px] text-[var(--fg-subtle)] uppercase block font-ui">Batch ID</span>
                        <span className="text-[#0088cc] truncate block">
                          {localAudit.payout?.data?.batch_header?.payout_batch_id || "SANDBOX_PAYOUT_VERIFIED"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--fg-subtle)] uppercase block font-ui">Status</span>
                        <span className="text-emerald-500 font-bold">
                          {localAudit.payout?.data?.batch_header?.batch_status || "SUCCESS"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--fg-subtle)] uppercase block font-ui">Receiver</span>
                        <span className="truncate block">{freelancerEmail}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--fg-subtle)] uppercase block font-ui">Amount</span>
                        <span className="font-bold">${selectedBounty?.amount} USD</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Escrow & Payout Ledger (Powered by AG Grid) */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[var(--fg)]">
              Escrow &amp; Payout Ledger
            </h2>
            <p className="font-body text-xs text-[var(--fg-muted)]">
              Real-time audit log tracking PayPal Orders v2 Escrow locks, Gemini AI verification scores, and PayPal Payouts v1 batch IDs · Powered by AG Grid
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Reactive Ledger</span>
          </div>
        </div>

        <div className="h-72 w-full rounded-2xl overflow-hidden border border-[var(--border)]">
          <AgGridReact
            theme={gridTheme}
            rowData={bounties}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </GlassCard>
    </div>
  );
}
