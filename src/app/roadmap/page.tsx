"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  GitPullRequest,
  Receipt,
  Layers,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";
import { RevealStatement } from "@/components/marketing/RevealStatement";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";

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
    description:
      "Foundational integration connecting PayPal Orders v2 for escrow locks, Google Gemini for structured criteria evaluation, and PayPal Payouts v1 for instant disbursals.",
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
    description:
      "Allowing enterprise clients and contractors to establish staggered delivery milestones with independent verification gates for each stage.",
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
    description:
      "Automatic verification directly from git events. Opening or merging pull requests triggers Gemini code audits and releases escrow without leaving GitHub.",
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
    description:
      "Native synchronization with PayPal Invoicing API v2 and automated dispute resolution with comprehensive Gemini audit evidence packages.",
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

  useScrollRefresh();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col selection:bg-[#0088cc]/30 selection:text-white overflow-x-hidden">
      <MarketingNav />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full space-y-16">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0088cc]/10 border border-[#0088cc]/20 text-[#0088cc] text-xs font-ui uppercase tracking-wider">
            Protocol Evolution
          </div>
          <div>
            <RevealStatement preset="enter">
              Product Roadmap Timeline
            </RevealStatement>
          </div>
          <p className="font-body text-base text-[var(--fg-muted)] leading-relaxed">
            From single-bounty automated escrow to multi-milestone enterprise contracts, PayPal dispute synchronization, and GitHub CI/CD automation.
          </p>
        </div>

        {/* Timeline with #0088cc spine */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#0088cc]/40 space-y-10">
          {ROADMAP.map((item) => {
            const isExpanded = expandedId === item.id;
            const Icon = item.icon;

            const statusBadge = {
              COMPLETED: {
                label: "Shipped & Active",
                color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
              },
              IN_PROGRESS: {
                label: "In Active Development",
                color: "bg-[#0088cc]/10 text-[#0088cc] border-[#0088cc]/30",
              },
              PLANNED: {
                label: "Planned Architecture",
                color: "bg-[var(--surface-strong)] text-[var(--fg-muted)] border-[var(--border)]",
              },
            }[item.status];

            return (
              <div key={item.id} className="relative group">
                {/* Node on spine */}
                <div
                  className={`
                    absolute -left-[31px] sm:-left-[39px] top-6 w-5 h-5 rounded-full border-2
                    flex items-center justify-center transition-all duration-300
                    ${
                      item.status === "COMPLETED"
                        ? "border-emerald-500 bg-emerald-500 text-black"
                        : item.status === "IN_PROGRESS"
                        ? "border-[#0088cc] bg-[#0088cc] text-black"
                        : "border-[var(--border-strong)] bg-[var(--bg)] text-[var(--fg-subtle)]"
                    }
                  `}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                {/* Card */}
                <div
                  className={`
                    rounded-[28px] border bg-[var(--surface)] backdrop-blur-xl transition-all duration-300 overflow-hidden
                    ${
                      isExpanded
                        ? "border-[#0088cc]/40 bg-[var(--surface-strong)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)]"
                    }
                  `}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? "" : item.id)}
                    className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-4 cursor-pointer font-ui"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-mono tracking-wider text-[var(--fg-muted)]">
                          {item.quarter}
                        </span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl text-[var(--fg)] leading-snug">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed max-w-2xl">
                        {item.description}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[var(--surface-strong)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] shrink-0 mt-1">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-[#0088cc]" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-2 border-t border-[var(--border)] bg-[var(--surface)]/50">
                      <h4 className="font-ui text-xs font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
                        Technical Deliverables
                      </h4>
                      <ul className="space-y-2.5 font-body text-sm text-[var(--fg-muted)]">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0088cc] mt-2 shrink-0" />
                            <span>{detail}</span>
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

        <div className="text-center pt-8">
          <Link href="/dashboard">
            <Button variant="primary" size="lg">
              <span>Launch App in Sandbox</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
