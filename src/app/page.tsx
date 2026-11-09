"use client";

import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  DollarSign,
  Send,
  Lock,
  ArrowRight,
  ExternalLink,
  Code2,
  Cpu,
  RefreshCw
} from "lucide-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

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

export default function PayGuardApp() {
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [selectedBountyId, setSelectedBountyId] = useState<string>("BNT-101");

  // New Bounty Form State
  const [newTitle, setNewTitle] = useState("Build a Regex Email Validator in JS");
  const [newReqs, setNewReqs] = useState(
    "1. Function named isValidEmail(email).\n2. Returns boolean using regex.\n3. Rejects addresses missing an @ or domain extension."
  );
  const [newAmount, setNewAmount] = useState("20.00");

  // Freelancer Submission State
  const [freelancerEmail, setFreelancerEmail] = useState("sb-freelancer@personal.example.com");
  const [submissionText, setSubmissionText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const selectedBounty = bounties.find((b) => b.id === selectedBountyId) || bounties[0];

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

  const columnDefs: ColDef<Bounty>[] = [
    { field: "id", headerName: "Bounty ID", maxWidth: 120 },
    { field: "title", headerName: "Task Title", flex: 1 },
    { field: "amount", headerName: "Escrow ($ USD)", maxWidth: 140 },
    {
      field: "status",
      headerName: "Escrow Status",
      maxWidth: 200,
      cellRenderer: (params: any) => {
        const val = params.value;
        if (val === "RELEASED_BY_AI") {
          return <span className="text-emerald-400 font-bold">RELEASED BY AI</span>;
        }
        if (val === "REJECTED_NEEDS_WORK") {
          return <span className="text-rose-400 font-semibold">REJECTED (IN ESCROW)</span>;
        }
        return <span className="text-blue-400 font-semibold">FUNDED IN ESCROW</span>;
      },
    },
    { field: "aiScore", headerName: "Gemini Score", maxWidth: 130 },
    { field: "escrowOrderId", headerName: "PayPal Order ID", flex: 1 },
    { field: "payoutBatchId", headerName: "PayPal Payout Batch ID", flex: 1 },
  ];

  const paypalClientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "your_paypal_sandbox_client_id_here"
      ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      : "test";

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
      }}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                PayPal Orders v2 + Payouts v1 + Gemini 2.5 Flash
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mt-1 tracking-tight text-white">
                PayGuard AI: Autonomous Escrow & Bounty Agent
              </h1>
              <p className="text-slate-400 mt-1 max-w-2xl text-sm md:text-base">
                Lock client funds via PayPal Checkout. Gemini 2.5 Flash autonomously audits code & deliverables, directly releasing instant funds via the PayPal Payouts API.
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs space-y-1 shadow-md">
              <div className="font-semibold text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Judge Quick-Test Mode
              </div>
              <div className="text-slate-300">1. Click &quot;1-Click Fill Passing Code&quot; on the right</div>
              <div className="text-slate-300">2. Click &quot;Run Gemini Audit &amp; Trigger Autonomous PayPal Payout&quot;</div>
            </div>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Create & Select Escrow Bounties */}
            <div className="lg:col-span-5 space-y-6">
              {/* Create & Fund New Bounty with PayPal */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Lock className="w-5 h-5 text-blue-400" />
                    1. Client: Fund New Escrow Bounty
                  </h2>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono">
                    PayPal Orders v2
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Task Title</label>
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition"
                      placeholder="e.g. Build an authentication webhook"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      Strict Acceptance Criteria (Audited by Gemini)
                    </label>
                    <textarea
                      rows={3}
                      value={newReqs}
                      onChange={(e) => setNewReqs(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition font-mono text-xs"
                      placeholder="Numbered acceptance rules..."
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Escrow Reward (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500">$</span>
                      <input
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 transition font-mono"
                        placeholder="25.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Official PayPal Sandbox Checkout Button */}
                <div className="pt-2 space-y-2">
                  <PayPalButtons
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
                  />

                  {/* Instant 1-Click Simulation Button for Testing Without PayPal Popup */}
                  <button
                    type="button"
                    onClick={handleSimulatedLock}
                    className="w-full text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-950/60 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Quick 1-Click Lock into Escrow (Sandbox Demo Shortcut)
                  </button>
                </div>
              </div>

              {/* Active Bounties List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Active Escrow Bounties</h2>
                  <span className="text-xs text-slate-400 font-mono">{bounties.length} Loaded</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {bounties.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBountyId(b.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition text-left ${
                        selectedBountyId === b.id
                          ? "bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono font-bold text-blue-400">{b.id}</span>
                        <span className="text-sm font-bold text-emerald-400">${b.amount} USD</span>
                      </div>
                      <div className="font-medium mt-1 text-sm text-slate-200">{b.title}</div>
                      <div className="text-xs text-slate-400 mt-2 flex justify-between items-center">
                        <span
                          className={`font-semibold ${
                            b.status === "RELEASED_BY_AI"
                              ? "text-emerald-400"
                              : b.status === "REJECTED_NEEDS_WORK"
                              ? "text-rose-400"
                              : "text-blue-300"
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {b.escrowOrderId.slice(0, 16)}...
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Freelancer Work Submission & Gemini Verification Agent */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    2. Freelancer Submission &amp; Gemini Escrow Audit
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={fillPassingDemo}
                      className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-900 transition font-medium flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      1-Click Fill Passing Code
                    </button>
                    <button
                      onClick={fillFailingDemo}
                      className="text-xs bg-rose-950 text-rose-300 border border-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-900 transition font-medium flex items-center gap-1 shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      1-Click Fill Failing Code
                    </button>
                  </div>
                </div>

                {/* Selected Bounty Details */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-400 text-sm">{selectedBounty.title}</span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-xs">
                      ${selectedBounty.amount} Escrow Locked
                    </span>
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    {selectedBounty.requirements}
                  </pre>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">
                      Freelancer PayPal Sandbox Email (Receiver of Payouts API)
                    </label>
                    <input
                      value={freelancerEmail}
                      onChange={(e) => setFreelancerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white focus:outline-none focus:border-blue-500 transition text-xs"
                      placeholder="freelancer-sandbox@personal.example.com"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-slate-400 font-medium">Deliverable / Code / Text Submission</label>
                      <span className="text-[11px] text-slate-500">Python / JS / Text</span>
                    </div>
                    <textarea
                      rows={8}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Paste your code or deliverable here (or use 1-Click buttons above)..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition leading-relaxed"
                    />
                  </div>
                </div>

                <button
                  onClick={handleVerifyAndPayout}
                  disabled={isVerifying || !submissionText.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/20 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Gemini 2.5 Flash is Auditing &amp; Communicating with PayPal Sandbox...
                    </span>
                  ) : (
                    <>
                      Run Gemini Audit &amp; Trigger Autonomous PayPal Payout
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Live AI Audit + PayPal Payout Output */}
                {lastResult?.audit && (
                  <div
                    className={`p-5 rounded-xl border space-y-4 transition duration-300 ${
                      lastResult.audit.approved
                        ? "bg-emerald-950/30 border-emerald-600 shadow-emerald-950/40 shadow-lg"
                        : "bg-rose-950/30 border-rose-600 shadow-rose-950/40 shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-lg">
                        {lastResult.audit.approved ? (
                          <>
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <span className="text-emerald-300">
                              APPROVED — PayPal Payout Dispatched!
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-6 h-6 text-rose-400" />
                            <span className="text-rose-300">
                              REJECTED — Funds Remain Locked in PayPal Escrow
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-sm font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-slate-200">
                        AI Score: {lastResult.audit.score}/100
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">{lastResult.audit.summary}</p>

                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Verification Checklist
                      </div>
                      {lastResult.audit.criteriaChecklist?.map((c: any, idx: number) => (
                        <div
                          key={idx}
                          className="text-xs bg-slate-950/80 p-3 rounded-lg flex items-start gap-2.5 border border-slate-800"
                        >
                          {c.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="font-semibold text-slate-200">{c.criterion}</div>
                            <div className="text-slate-400 mt-0.5">{c.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {lastResult.payout && (
                      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 shadow-inner">
                        <div className="text-blue-400 font-semibold flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          PayPal Sandbox Payouts API Response (/v1/payments/payouts):
                        </div>
                        <div className="text-slate-300">
                          Batch ID:{" "}
                          <span className="text-emerald-400 font-bold">
                            {lastResult.payout?.data?.batch_header?.payout_batch_id ||
                              "SANDBOX_SIMULATED_IF_PAYOUTS_UNENABLED"}
                          </span>
                        </div>
                        <div className="text-slate-300">
                          Batch Status:{" "}
                          <span className="text-blue-300 font-medium">
                            {lastResult.payout?.data?.batch_header?.batch_status ||
                              `HTTP ${lastResult.payout.status}`}
                          </span>
                        </div>
                        <div className="text-slate-400">Receiver: {freelancerEmail}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sponsor Integration: AG Grid Live Escrow & Payouts Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Live Escrow &amp; Autonomous Payout Ledger (Powered by AG Grid)
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time audit log tracking PayPal Orders v2 Escrow locks, Gemini AI verification scores, and PayPal Payouts v1 batch IDs.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Real-Time Reactive
              </div>
            </div>

            <div className="ag-theme-quartz-dark h-64 w-full rounded-xl overflow-hidden border border-slate-800">
              <AgGridReact rowData={bounties} columnDefs={columnDefs} />
            </div>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
