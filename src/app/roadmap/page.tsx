"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Milestone,
  CheckCircle2,
  Clock,
  Sparkles,
  GitPullRequest,
  Receipt,
  Layers,
  ChevronDown,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";

interface RoadmapItem {
  id: string;
  quarter: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PLANNED";
  title: string;
  description: string;
  details: string[];
  icon: any;
}

const ROADMAP: RoadmapItem[] = [
  {
    id: "phase-1",
    quarter: "Phase 1 · Current Architecture",
    status: "COMPLETED",
    title: "Dual PayPal API Core & Gemini Arbiter",
    description: "Foundational integration connecting PayPal Orders v2 for escrow locks, Google Gemini for structured criteria evaluation, and PayPal Payouts v1 for instant disbursals.",
    details: [
      "PayPal Orders API v2 OAuth2 client checkout",
      "PayPal Payouts API v1 autonomous server-side disbursal",
      "Google Gemini Flash typed JSON schema evaluation",
      "AG Grid reactive audit ledger",
    ],
    icon: CheckCircle2,
  },
  {
    id: "phase-2",
    quarter: "Phase 2 · Q2 2027",
    status: "IN_PROGRESS",
    title: "Multi-Milestone Escrow Schedules (25 / 50 / 25)",
    description: "Allowing enterprise clients and contractors to establish staggered delivery milestones with independent verification gates for each stage.",
    details: [
      "Staggered milestone funding into segregated sub-escrow buffers",
      "Milestone 1: Prototype / Architecture Signoff (25%)",
      "Milestone 2: Functional Deliverable (50%)",
      "Milestone 3: Production Hardening & Documentation (25%)",
    ],
    icon: Layers,
  },
  {
    id: "phase-3",
    quarter: "Phase 3 · Q3 2027",
    status: "PLANNED",
    title: "GitHub Webhook & CI/CD Pipeline Automation",
    description: "Automatic verification directly from git events. Opening or merging pull requests triggers Gemini code audits and releases escrow without leaving GitHub.",
    details: [
      "GitHub App webhook for pull_request events",
      "Automated unit test assertion execution in sandboxed runners",
      "PR status checks posted directly into GitHub conversation",
      "Automatic bounty release upon green merge to main branch",
    ],
    icon: GitPullRequest,
  },
  {
    id: "phase-4",
    quarter: "Phase 4 · Q4 2027",
    status: "PLANNED",
    title: "PayPal Disputes & Invoicing Protocol",
    description: "Native synchronization with PayPal Invoicing API v2 and automated dispute resolution with comprehensive Gemini audit evidence packages.",
    details: [
      "Automated PDF escrow invoice generation via PayPal Invoicing API",
      "Dispute packet generation for PayPal Resolution Center",
      "PYUSD (PayPal USD Stablecoin) settlement rail option",
    ],
    icon: Receipt,
  },
];

export default function RoadmapPage() {
  const [expandedId, setExpandedId] = useState<string>("phase-1");

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F7] flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      <MarketingNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full space-y-16">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider">
            Protocol Evolution
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Product Roadmap
          </h1>
          <p className="text-base text-slate-400 leading-relaxed">
            The strategic milestones advancing PayGuard from single micro-bounties to autonomous multi-stage enterprise escrow contracts.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="space-y-6 relative">
          <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-white/[0.08] -z-0 hidden sm:block" />

          {ROADMAP.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="relative pl-0 sm:pl-16 transition-all"
              >
                {/* Node Dot */}
                <div
                  className={`
                    absolute left-4 top-6 -translate-x-1/2 w-5 h-5 rounded-full border-2 hidden sm:flex items-center justify-center
                    ${
                      item.status === "COMPLETED"
                        ? "bg-emerald-500 border-emerald-400"
                        : item.status === "IN_PROGRESS"
                        ? "bg-blue-500 border-blue-400 animate-pulse"
                        : "bg-[#101018] border-slate-600"
                    }
                  `}
                />

                <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.04] transition p-6 sm:p-8 space-y-4">
                  <div
                    onClick={() => setExpandedId(isExpanded ? "" : item.id)}
                    className="flex items-start justify-between cursor-pointer select-none"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                          {item.quarter}
                        </span>
                        <span
                          className={`
                            text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border
                            ${
                              item.status === "COMPLETED"
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                : item.status === "IN_PROGRESS"
                                ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                : "bg-slate-500/15 text-slate-400 border-slate-500/30"
                            }
                          `}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mt-1">
                        {item.title}
                      </h3>
                    </div>

                    <button className="text-slate-400 hover:text-white p-1">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {isExpanded && (
                    <div className="pt-4 border-t border-white/[0.06] space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                        Deliverable Specifications
                      </div>
                      <ul className="space-y-2 text-xs text-slate-400">
                        {item.details.map((d, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}

