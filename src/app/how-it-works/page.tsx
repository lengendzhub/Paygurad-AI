"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
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
import { RevealStatement } from "@/components/marketing/RevealStatement";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";

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
      "The freelancer reviews pinned acceptance rules and uploads raw code or deliverables along with their verified sandbox PayPal email to receive funds.",
    requestFields: ["bountyId", "title", "requirements", "amount", "freelancerEmail", "submission"],
    responseFields: ["audit.approved", "audit.score", "payout.data.batch_header"],
  },
  {
    id: "gemini",
    title: "Gemini Structured Arbiter",
    role: "Autonomous Acceptance Verification",
    api: "Google Gemini Flash API (models.generateContent)",
    explanation:
      "Evaluates deliverables with structured JSON schema output. Validates functional logic and criteria compliance in an isolated security envelope.",
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

  useScrollRefresh();

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col selection:bg-[#007AFF]/30 selection:text-white">
      <MarketingNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 md:py-24">
        {/* Title Header with ScrollReveal enter */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="font-ui text-xs font-semibold uppercase tracking-wider text-[#007AFF]">
            Protocol Architecture
          </span>
          <div>
            <RevealStatement preset="enter">
              Interactive Protocol Flow
            </RevealStatement>
          </div>
          <p className="font-body text-base text-[var(--fg-muted)] leading-relaxed">
            Click any component node in the pipeline to inspect technical payloads and API specifications.
          </p>

          {/* Simulation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-ui">
            <Button
              variant={simState === "running_pass" ? "emerald" : "secondary"}
              size="sm"
              onClick={() => runSimulation("pass")}
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Simulate 100% Pass Flow
            </Button>
            <Button
              variant={simState === "running_fail" ? "danger" : "secondary"}
              size="sm"
              onClick={() => runSimulation("fail")}
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              Simulate Revision Flow
            </Button>
            {simState !== "idle" && (
              <Button variant="ghost" size="sm" onClick={resetSimulation}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Interactive Diagram Pipeline */}
        <div className="relative mb-20 overflow-x-auto pb-8 pt-4">
          <div className="min-w-[900px] flex items-center justify-between relative px-4">
            {/* Animated Dash Connector SVG */}
            <svg className="absolute left-16 right-16 top-1/2 -translate-y-1/2 w-[calc(100%-128px)] h-4 pointer-events-none -z-0">
              <line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="#007AFF"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="animate-[dash_1s_linear_infinite]"
              />
              <style jsx>{`
                @keyframes dash {
                  to {
                    stroke-dashoffset: -12;
                  }
                }
              `}</style>
            </svg>

            {FLOW_NODES.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isSimActive = activeSimIndex === index;
              const isSimPassed = simState === "running_pass" && activeSimIndex >= index;
              const isSimFailed =
                simState === "running_fail" && index === 3 && activeSimIndex >= 3;

              const icons = [Lock, Lock, FileCheck, Cpu, DollarSign];
              const Icon = icons[index];

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`
                    relative z-10 w-44 rounded-[28px] border p-5 cursor-pointer backdrop-blur-xl transition-all duration-300
                    ${
                      isSelected
                        ? "border-[#007AFF] bg-[var(--surface-strong)] -translate-y-1"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-strong)]"
                    }
                    ${
                      isSimActive
                        ? "ring-2 ring-[#007AFF] scale-105"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-ui text-[10px] font-mono tracking-widest text-[var(--fg-subtle)]">
                      0{index + 1}
                    </span>
                    {isSimFailed ? (
                      <XCircle className="w-4 h-4 dark:text-red-400 text-red-600" />
                    ) : isSimPassed ? (
                      <CheckCircle2 className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#007AFF]/60" />
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 border border-[#007AFF]/25 flex items-center justify-center text-[#007AFF] mb-3">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  <h3 className="font-display text-lg text-[var(--fg)] leading-snug">
                    {node.title}
                  </h3>
                  <p className="font-ui text-[11px] text-[var(--fg-muted)] mt-1 truncate">
                    {node.role}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Technical Inspector Panel */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between pb-6 border-b border-[var(--border)]">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-ui text-xs font-semibold uppercase tracking-wider text-[#007AFF]">
                      Technical Specification
                    </span>
                    <span className="text-xs font-mono text-[var(--fg-subtle)] bg-[var(--surface-strong)] px-2.5 py-0.5 rounded-full border border-[var(--border)]">
                      {selectedNode.api}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl text-[var(--fg)] mt-1">
                    {selectedNode.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-strong)] hover:bg-[var(--surface)] text-[var(--fg-muted)] hover:text-[var(--fg)] flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div>
                  <h4 className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-2">
                    Plain-Language Architecture
                  </h4>
                  <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
                    {selectedNode.explanation}
                  </p>
                </div>

                <div>
                  <h4 className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-2 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#007AFF]" />
                    Sent Payload Keys
                  </h4>
                  <div className="space-y-1.5 font-mono text-xs text-[var(--fg-muted)] bg-[var(--surface-strong)] p-3.5 rounded-2xl border border-[var(--border)]">
                    {selectedNode.requestFields.map((f, i) => (
                      <div key={i} className="truncate">
                        → {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-2 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 dark:text-emerald-400 text-emerald-600" />
                    Response / Handshake
                  </h4>
                  <div className="space-y-1.5 font-mono text-xs text-[var(--fg-muted)] bg-[var(--surface-strong)] p-3.5 rounded-2xl border border-[var(--border)]">
                    {selectedNode.responseFields.map((f, i) => (
                      <div key={i} className="truncate">
                        ← {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Step CTA */}
        <div className="mt-16 text-center">
          <Link href="/security">
            <Button variant="secondary" size="md">
              <span>Inspect Prompt Injection Defense Architecture</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
