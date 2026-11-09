"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeQuartz,
  colorSchemeDark,
} from "ag-grid-community";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock,
  Zap,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

ModuleRegistry.registerModules([AllCommunityModule]);
const gridDarkTheme = themeQuartz.withPart(colorSchemeDark);

/* ─── Types ─────────────────────────────────────────── */

interface Bounty {
  id: string;
  title: string;
  requirements: string;
  amount: string;
  status: "FUNDED_IN_ESCROW" | "RELEASED_BY_AI" | "REJECTED_NEEDS_WORK";
  escrowOrderId: string;
  payoutBatchId?: string;
  aiScore?: number;
  freelancerEmail?: string;
}

/* ─── Seed Data ─────────────────────────────────────── */

const INITIAL_BOUNTIES: Bounty[] = [
  {
    id: "BNT-101",
    title: "Write a Python Luhn Credit Card Validator Function",
    requirements:
      "1. Define a Python function named validate_card(number_str).\n2. Implement the Luhn checksum algorithm without external libraries.\n3. Include at least 2 assert test cases demonstrating valid and invalid numbers.",
    amount: "25.00",
    status: "FUNDED_IN_ESCROW",
    escrowOrderId: "PAYPAL_SANDBOX_ESCROW_89231",
  },
  {
    id: "BNT-102",
    title: "Draft a SaaS Refund Policy Summary (Under 80 Words)",
    requirements:
      "1. Must state a 14-day full refund window.\n2. Must mention that payments are processed via PayPal.\n3. Total word count must be strictly under 80 words.",
    amount: "15.00",
    status: "FUNDED_IN_ESCROW",
    escrowOrderId: "PAYPAL_SANDBOX_ESCROW_77412",
  },
];

/* ─── Reusable Animated Components ──────────────────── */

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        relative rounded-3xl border border-white/[0.06]
        bg-white/[0.03] backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        transition-all duration-300 hover:bg-white/[0.05]
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

function StatusPill({ status }: { status: Bounty["status"] }) {
  const config = {
    FUNDED_IN_ESCROW: { label: "In Escrow", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    RELEASED_BY_AI: { label: "Released by AI", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    REJECTED_NEEDS_WORK: { label: "Rejected", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${config.color}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute h-full w-full rounded-full bg-current opacity-75" />
        <span className="relative rounded-full h-1.5 w-1.5 bg-current" />
      </span>
      {config.label}
    </span>
  );
}

/* ─── Main App ──────────────────────────────────────── */

export default function PayGuardApp() {
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [selectedBountyId, setSelectedBountyId] = useState<string>("BNT-101");

  const [newTitle, setNewTitle] = useState("Build a Regex Email Validator in JS");
  const [newReqs, setNewReqs] = useState(
    "1. Function named isValidEmail(email).\n2. Returns boolean using regex.\n3. Rejects addresses missing an @ or domain extension."
  );
  const [newAmount, setNewAmount] = useState("20.00");

  const [freelancerEmail, setFreelancerEmail] = useState("sb-freelancer@personal.example.com");
  const [submissionText, setSubmissionText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const selectedBounty = bounties.find((b) => b.id === selectedBountyId) || bounties[0];

  /* ─── Handlers ──────────────────────────────────────── */

  const handleVerifyAndPayout = async () => {
    if (!submissionText.trim()) return;
    setIsVerifying(true);
    setLastResult(null);

    try {
      const res = await fetch("/api/verify-and-payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: selectedBounty.id,
          title: selectedBounty.title,
          requirements: selectedBounty.requirements,
          amount: selectedBounty.amount,
          freelancerEmail,
          submission: submissionText,
        }),
      });
      const data = await res.json();
      setLastResult(data);

      if (data.audit) {
        const batchId =
          data.payout?.data?.batch_header?.payout_batch_id ||
          (data.audit.approved ? `SANDBOX_PAYOUT_${Date.now()}` : undefined);

        setBounties((prev) =>
          prev.map((b) =>
            b.id === selectedBounty.id
              ? {
                  ...b,
                  status: data.audit.approved ? "RELEASED_BY_AI" : "REJECTED_NEEDS_WORK",
                  aiScore: data.audit.score,
                  payoutBatchId: batchId,
                  freelancerEmail,
                }
              : b
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const fillPassingDemo = () => {
    setSelectedBountyId("BNT-101");
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
    setSubmissionText(`def validate_card(number_str):
    # TODO: finish Luhn math later
    return len(number_str) == 16`);
  };

  const handleSimulatedLock = () => {
    const newId = `BNT-${100 + bounties.length + 1}`;
    const created: Bounty = {
      id: newId,
      title: newTitle,
      requirements: newReqs,
      amount: newAmount,
      status: "FUNDED_IN_ESCROW",
      escrowOrderId: `ESCROW_SIM_${Date.now()}`,
    };
    setBounties([created, ...bounties]);
    setSelectedBountyId(newId);
  };

  /* ─── AG Grid Config ──────────────────────────────────── */

  const columnDefs: ColDef<Bounty>[] = [
    { field: "id", headerName: "Bounty ID", maxWidth: 120, cellClass: "font-mono text-blue-400" },
    { field: "title", headerName: "Task Title", flex: 1 },
    { field: "amount", headerName: "Escrow ($ USD)", maxWidth: 140 },
    { field: "status", headerName: "Status", maxWidth: 170 },
    { field: "aiScore", headerName: "AI Score", maxWidth: 110 },
    { field: "escrowOrderId", headerName: "PayPal Order ID", flex: 1, cellClass: "font-mono text-slate-400" },
    { field: "payoutBatchId", headerName: "Payout Batch ID", flex: 1, cellClass: "font-mono text-emerald-400" },
  ];

  const paypalClientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "your_paypal_sandbox_client_id_here"
      ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      : "test";

  /* ─── Render ──────────────────────────────────────────── */

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
      }}
    >
      {/* ── Background Gradient Layer ── */}
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100 selection:bg-blue-500/30">
        {/* Ambient glow orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-600/[0.07] blur-[160px]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-600/[0.06] blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-500/[0.03] blur-[200px]" />
        </div>

        {/* ── Main Content ── */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 py-12 space-y-10">

          {/* ═══════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════ */}
          <FadeIn>
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/[0.06]">
              <div className="space-y-4">
                {/* Brand badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-widest uppercase"
                >
                  <ShieldCheck className="w-4 h-4" />
                  PayPal Orders v2 → Gemini 2.5 → PayPal Payouts v1
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
                  <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    PayGuard AI
                  </span>
                  <span className="block text-xl md:text-2xl font-medium text-slate-400 mt-3 tracking-normal">
                    Autonomous Escrow & Bounty Protocol
                  </span>
                </h1>

                <p className="text-slate-500 max-w-xl leading-relaxed">
                  Lock micro-bounty funds via PayPal Checkout. Gemini AI audits deliverables and triggers instant, trustless PayPal Payouts.
                </p>
              </div>

              {/* Judge quick-test card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl p-5 min-w-[260px]"
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
                  <Zap className="w-3.5 h-3.5" />
                  Judge Quick-Test
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                    Click &ldquo;Fill Passing Code&rdquo;
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">2</span>
                    Click &ldquo;Run Gemini Audit&rdquo;
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">3</span>
                    Watch PayPal Payout fire!
                  </div>
                </div>
              </motion.div>
            </header>
          </FadeIn>

          {/* ═══════════════════════════════════════════
              STATS ROW
          ═══════════════════════════════════════════ */}
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Escrow Locked", value: `$${bounties.reduce((s, b) => s + parseFloat(b.amount), 0).toFixed(2)}`, icon: <Lock className="w-4 h-4" />, color: "text-blue-400" },
                { label: "Active Bounties", value: bounties.filter((b) => b.status === "FUNDED_IN_ESCROW").length.toString(), icon: <TrendingUp className="w-4 h-4" />, color: "text-purple-400" },
                { label: "Released by AI", value: bounties.filter((b) => b.status === "RELEASED_BY_AI").length.toString(), icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-400" },
                { label: "Avg AI Score", value: lastResult?.audit ? `${lastResult.audit.score}/100` : "—", icon: <Sparkles className="w-4 h-4" />, color: "text-amber-400" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl p-4 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${stat.color}`}>
                    {stat.icon}
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold mt-2 text-white">{stat.value}</div>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          {/* ═══════════════════════════════════════════
              MAIN GRID
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-5 space-y-6">

              {/* Create & Fund New Bounty */}
              <GlassCard delay={0.25} className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Fund New Escrow</h2>
                    <p className="text-xs text-slate-500">Client locks bounty via PayPal Checkout</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                      Task Title
                    </label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                      Acceptance Criteria (Gemini will audit)
                    </label>
                    <textarea
                      rows={3}
                      value={newReqs}
                      onChange={(e) => setNewReqs(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-200 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                      Escrow Reward (USD)
                    </label>
                    <input
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all duration-200 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <PayPalButtons
                    key={paypalClientId}
                    style={{ layout: "horizontal", height: 42 }}
                    createOrder={async () => {
                      const res = await fetch("/api/paypal/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount: newAmount, title: newTitle }),
                      });
                      const order = await res.json();
                      return order.id;
                    }}
                    onApprove={async (data) => {
                      const res = await fetch("/api/paypal/capture-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderID: data.orderID }),
                      });
                      const capture = await res.json();
                      const newId = `BNT-${100 + bounties.length + 1}`;
                      const created: Bounty = {
                        id: newId,
                        title: newTitle,
                        requirements: newReqs,
                        amount: newAmount,
                        status: "FUNDED_IN_ESCROW",
                        escrowOrderId: capture.id || data.orderID,
                      };
                      setBounties([created, ...bounties]);
                      setSelectedBountyId(newId);
                    }}
                    onError={(err) => {
                      console.log("PayPal checkout info:", err);
                    }}
                    onCancel={() => {
                      console.log("PayPal checkout cancelled by user.");
                    }}
                  />

                  {/* Quick-lock shortcut button */}
                  <button
                    type="button"
                    onClick={handleSimulatedLock}
                    className="w-full text-xs text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Quick 1-Click Lock into Escrow (Sandbox Demo Shortcut)
                  </button>
                </div>
              </GlassCard>

              {/* Active Bounties List */}
              <GlassCard delay={0.35} className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Active Bounties</h2>
                  <span className="text-xs text-slate-500 bg-white/[0.05] px-2.5 py-1 rounded-full">
                    {bounties.length} total
                  </span>
                </div>

                <div className="space-y-2">
                  {bounties.map((b, i) => (
                    <motion.div
                      key={b.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: 0.4 + i * 0.05 }}
                      onClick={() => setSelectedBountyId(b.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                        selectedBountyId === b.id
                          ? "bg-blue-500/[0.1] border-blue-500/30 shadow-[0_0_24px_rgba(59,130,246,0.08)]"
                          : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[11px] font-mono font-semibold text-blue-400/80 tracking-wider">
                          {b.id}
                        </span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          ${b.amount}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-white/90 leading-snug">
                        {b.title}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <StatusPill status={b.status} />
                        <ChevronDown
                          className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
                            selectedBountyId === b.id ? "rotate-180 text-blue-400" : ""
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* Submission & AI Verification */}
              <GlassCard delay={0.3} className="p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/15 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Gemini Escrow Audit</h2>
                      <p className="text-xs text-slate-500">Structured JSON verification → PayPal Payouts</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={fillPassingDemo}
                      className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all duration-200"
                    >
                      ✓ Passing Code
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={fillFailingDemo}
                      className="text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl hover:bg-rose-500/20 transition-all duration-200"
                    >
                      ✗ Failing Code
                    </motion.button>
                  </div>
                </div>

                {/* Selected Bounty Context */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-mono text-blue-400/70 tracking-wider">{selectedBounty.id}</span>
                      <div className="font-semibold text-white mt-0.5">{selectedBounty.title}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-bold text-emerald-400 font-mono">${selectedBounty.amount}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">in escrow</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 pt-2 border-t border-white/[0.06]">
                    Acceptance Criteria
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedBounty.requirements}
                  </pre>
                </div>

                {/* Email + Submission */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                      Freelancer PayPal Sandbox Email
                    </label>
                    <input
                      value={freelancerEmail}
                      onChange={(e) => setFreelancerEmail(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 block mb-2">
                      Deliverable Submission
                    </label>
                    <textarea
                      rows={7}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Paste your code or deliverable here..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all duration-200 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: isVerifying ? 1 : 1.015 }}
                  whileTap={{ scale: isVerifying ? 1 : 0.985 }}
                  onClick={handleVerifyAndPayout}
                  disabled={isVerifying || !submissionText.trim()}
                  className={`
                    w-full rounded-2xl font-semibold py-4 px-6
                    flex items-center justify-center gap-2.5
                    transition-all duration-300 text-sm tracking-wide
                    ${
                      isVerifying
                        ? "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white opacity-80 cursor-wait"
                        : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 text-white shadow-[0_0_32px_rgba(59,130,246,0.25)] hover:shadow-[0_0_48px_rgba(59,130,246,0.35)] disabled:opacity-30 disabled:shadow-none"
                    }
                  `}
                >
                  {isVerifying ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Gemini is auditing &amp; communicating with PayPal…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Run Gemini Audit &amp; Trigger PayPal Payout
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </GlassCard>

              {/* ── AI Audit Result (Animated Appear) ── */}
              <AnimatePresence mode="wait">
                {lastResult?.audit && (
                  <motion.div
                    key={lastResult.audit.approved ? "approved" : "rejected"}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.97 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`rounded-3xl border p-6 space-y-5 backdrop-blur-xl ${
                      lastResult.audit.approved
                        ? "bg-emerald-500/[0.06] border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.08)]"
                        : "bg-rose-500/[0.06] border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.08)]"
                    }`}
                  >
                    {/* Verdict Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            lastResult.audit.approved ? "bg-emerald-500/20" : "bg-rose-500/20"
                          }`}
                        >
                          {lastResult.audit.approved ? (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-rose-400" />
                          )}
                        </motion.div>
                        <div>
                          <h3 className={`text-lg font-bold ${lastResult.audit.approved ? "text-emerald-300" : "text-rose-300"}`}>
                            {lastResult.audit.approved ? "Approved — Payout Dispatched" : "Rejected — Funds Locked"}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {lastResult.audit.approved
                              ? "PayPal Payouts API v1 automatically fired"
                              : "Escrow remains safe; submission needs revision"}
                          </p>
                        </div>
                      </div>

                      {/* Score circle */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.3 }}
                        className="relative w-16 h-16 shrink-0"
                      >
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                          <motion.circle
                            cx="18" cy="18" r="15.5" fill="none"
                            stroke={lastResult.audit.approved ? "#34d399" : "#fb7185"}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={`${(lastResult.audit.score / 100) * 97.4} 97.4`}
                            initial={{ strokeDasharray: "0 97.4" }}
                            animate={{ strokeDasharray: `${(lastResult.audit.score / 100) * 97.4} 97.4` }}
                            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-white leading-none">{lastResult.audit.score}</span>
                          <span className="text-[8px] text-slate-500 uppercase">score</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* AI Summary */}
                    <p className="text-sm text-slate-300 leading-relaxed">{lastResult.audit.summary}</p>

                    {/* Criteria Checklist */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                        Gemini Criteria Checklist
                      </div>
                      {lastResult.audit.criteriaChecklist?.map((c: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.5 + idx * 0.12 }}
                          className={`text-xs p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                            c.passed
                              ? "bg-emerald-500/[0.05] border-emerald-500/10"
                              : "bg-rose-500/[0.05] border-rose-500/10"
                          }`}
                        >
                          {c.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-semibold text-white/80">{c.criterion}</div>
                            <div className="text-slate-400 mt-0.5 leading-relaxed">{c.reason}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* PayPal Payout Receipt */}
                    {lastResult.payout && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-5 space-y-2"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          PayPal Sandbox Payouts API Receipt
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="space-y-1">
                            <div className="text-slate-500 text-[10px] uppercase">Batch ID</div>
                            <div className="text-blue-400 truncate">
                              {lastResult.payout?.data?.batch_header?.payout_batch_id || "SANDBOX_SIMULATED"}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500 text-[10px] uppercase">Batch Status</div>
                            <div className="text-emerald-400">
                              {lastResult.payout?.data?.batch_header?.batch_status || `HTTP ${lastResult.payout.status}`}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500 text-[10px] uppercase">Receiver</div>
                            <div className="text-slate-300 truncate">{freelancerEmail}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500 text-[10px] uppercase">Amount</div>
                            <div className="text-white font-semibold">${selectedBounty.amount} USD</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              AG GRID LEDGER
          ═══════════════════════════════════════════ */}
          <FadeIn delay={0.5}>
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Escrow &amp; Payout Ledger
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time PayPal Order IDs, Gemini scores, and Payout Batch IDs · Powered by AG Grid
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/15 font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </div>
              <div className="h-64 w-full">
                <AgGridReact theme={gridDarkTheme} rowData={bounties} columnDefs={columnDefs} />
              </div>
            </GlassCard>
          </FadeIn>

          {/* ═══════════════════════════════════════════
              FOOTER
          ═══════════════════════════════════════════ */}
          <FadeIn delay={0.6}>
            <footer className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-400">PayGuard AI</span>
                <span>PayPal Orders v2 · Payouts v1 · Gemini 2.5 Flash</span>
              </div>
              <div className="flex items-center gap-4">
                <span>AG Grid</span>
                <span>Next.js App Router</span>
                <span>PayPal Sandbox</span>
              </div>
            </footer>
          </FadeIn>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
