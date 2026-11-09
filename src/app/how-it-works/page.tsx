"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  Cpu,
  DollarSign,
  ArrowRight,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  X,
  Code2,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";

interface NodeDetail {
  id: string;
  title: string;
  role: string;
  api: string;
  explanation: string;
  requestFields: string[];
  responseFields: string[];
}

const FLOW_NODES: NodeDetail[] = [
  {
    id: "client",
    title: "Client Initiator",
    role: "Bounty Definition & Escrow Authorization",
    api: "PayPal Orders API v2 (/v2/checkout/orders)",
    explanation:
      "The client defines strict acceptance criteria and authorizes payment through PayPal Checkout. Funds are authorized and locked in escrow rather than paid out immediately.",
    requestFields: ["intent: CAPTURE", "purchase_units[].amount.value", "purchase_units[].description"],
    responseFields: ["order.id", "order.status: COMPLETED", "order.payer.email_address"],
  },
  {
    id: "escrow",
    title: "PayPal Escrow Container",
    role: "Non-Custodial Holding Facility",
    api: "PayPal Capture API (/v2/checkout/orders/{id}/capture)",
    explanation:
      "Captures the client's authorized funds into PayPal's secure settlement buffer. The money cannot be reclaimed arbitrarily while an active bounty audit is in progress.",
    requestFields: ["orderID", "authorization_header"],
    responseFields: ["capture.id", "capture.status: COMPLETED", "seller_receivable_breakdown"],
  },
  {
    id: "freelancer",
    title: "Freelancer Portal",
    role: "Deliverable Submission",
    api: "Internal Verification Gateway (/api/verify-and-payout)",
    explanation:
      "The freelancer reviews pinned acceptance rules and uploads raw code, files, or text along with their verified PayPal email to receive funds.",
    requestFields: ["bountyId", "title", "requirements", "amount", "freelancerEmail", "submission"],
    responseFields: ["audit.approved", "audit.score", "payout.data.batch_header"],
  },
  {
    id: "gemini",
    title: "Gemini Structured Arbiter",
    role: "Autonomous Acceptance Verification",
    api: "Google Gemini Flash API (models.generateContent)",
    explanation:
      "Evaluates deliverables with structured JSON schema output. Validates functional logic, criteria compliance, and lack of placeholders with mathematical rigor.",
    requestFields: ["model", "contents", "config.responseMimeType: application/json", "config.responseSchema"],
    responseFields: ["approved: boolean", "score: integer", "summary: string", "criteriaChecklist[]"],
  },
  {
    id: "payout",
    title: "PayPal Payout Engine",
    role: "Instant Automated Settlement",
    api: "PayPal Payouts API v1 (/v1/payments/payouts)",
    explanation:
      "If and only if Gemini outputs approved === true, the backend server programmatically executes an instant payout directly into the freelancer's PayPal email.",
    requestFields: ["sender_batch_header.sender_batch_id", "items[].recipient_type: EMAIL", "items[].receiver", "items[].amount.value"],
    responseFields: ["batch_header.payout_batch_id", "batch_header.batch_status", "links"],
  },
];

export default function HowItWorksPage() {
  const [selectedNode, setSelectedNode] = useState<NodeDetail | null>(FLOW_NODES[0]);
  const [simState, setSimState] = useState<"idle" | "running_pass" | "running_fail">("idle");
  const [activeSimIndex, setActiveSimIndex] = useState<number>(-1);

  const runSimulation = (mode: "pass" | "fail") => {
    setSimState(mode === "pass" ? "running_pass" : "running_fail");
    setActiveSimIndex(0);

    const interval = setInterval(() => {
      setActiveSimIndex((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          return 4;
        }
        return prev + 1;
      });
    }, 900);
  };

  const resetSimulation = () => {
    setSimState("idle");
    setActiveSimIndex(-1);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F7] flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      <MarketingNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full space-y-16">
        {/* Title */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider">
            Protocol Mechanics
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            How PayGuard Automates Escrow
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            Click on any node in the protocol diagram to inspect the underlying PayPal and Gemini API contracts. Run the interactive simulation engine to observe state transitions.
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          <span className="text-xs text-slate-400 font-medium">Protocol Simulator:</span>
          <Button
            variant="emerald"
            size="sm"
            onClick={() => runSimulation("pass")}
            disabled={simState !== "idle"}
          >
            <Play className="w-3.5 h-3.5" />
            Simulate 100% Pass Flow
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => runSimulation("fail")}
            disabled={simState !== "idle"}
          >
            <Play className="w-3.5 h-3.5" />
            Simulate Rejection Flow
          </Button>
          {simState !== "idle" && (
            <Button variant="ghost" size="sm" onClick={resetSimulation}>
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>

        {/* Diagram & Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Diagram */}
          <div className="lg:col-span-7 space-y-4">
            {FLOW_NODES.map((node, idx) => {
              const isSelected = selectedNode?.id === node.id;
              const isSimActive = activeSimIndex === idx;
              const isSimPassed = activeSimIndex > idx;
              const isSimFailedEnd = simState === "running_fail" && activeSimIndex >= 3 && idx === 4;

              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`
                      p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4
                      ${
                        isSelected
                          ? "bg-blue-600/15 border-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.15)]"
                          : "bg-white/[0.025] border-white/[0.07] hover:bg-white/[0.045] hover:border-white/[0.12]"
                      }
                      ${isSimActive ? "ring-2 ring-purple-500 bg-purple-500/20" : ""}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                          isSimActive
                            ? "bg-purple-600 text-white animate-pulse"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-white/[0.06] text-slate-400"
                        }`}
                      >
                        0{idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{node.title}</h3>
                        <p className="text-xs text-slate-400">{node.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSimActive && (
                        <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                          Processing
                        </span>
                      )}
                      {isSimFailedEnd && (
                        <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Halted (Locked)
                        </span>
                      )}
                      {simState === "running_pass" && isSimPassed && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                        {node.api.split(" ")[0]}
                      </span>
                    </div>
                  </div>

                  {idx < FLOW_NODES.length - 1 && (
                    <div className="w-[2px] h-4 bg-white/[0.1] mx-auto my-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Inspector Panel */}
          <div className="lg:col-span-5 sticky top-24">
            {selectedNode ? (
              <div className="rounded-3xl border border-white/[0.1] bg-[#101018] p-6 space-y-6 shadow-2xl">
                <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">
                      API Inspector
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {selectedNode.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono bg-white/[0.05] border border-white/[0.1] px-2 py-1 rounded-lg text-slate-400">
                    Node {FLOW_NODES.findIndex((n) => n.id === selectedNode.id) + 1}/5
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-slate-400">
                    Endpoint Rail
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono text-xs text-purple-300 break-all">
                    {selectedNode.api}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-slate-400">
                    Functionality
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedNode.explanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-slate-400">
                    Request Schema Properties
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-slate-300 space-y-1">
                    {selectedNode.requestFields.map((f, i) => (
                      <div key={i} className="text-blue-300">
                        → {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-mono tracking-wider text-slate-400">
                    Response Schema Properties
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-xs text-slate-300 space-y-1">
                    {selectedNode.responseFields.map((f, i) => (
                      <div key={i} className="text-emerald-300">
                        ← {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/[0.1] p-10 text-center text-sm text-slate-500">
                Select a node to inspect schema details
              </div>
            )}
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

