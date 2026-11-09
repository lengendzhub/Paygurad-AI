"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  ArrowRight,
  Lock,
  FileCheck,
  DollarSign,
  TableProperties,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";
import { CommandPalette } from "@/components/app/CommandPalette";

export default function LandingPage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      step: "01",
      title: "Lock Client Funds in Escrow",
      desc: "Client defines strict acceptance criteria and commits reward funds. PayPal Orders API v2 securely holds the authorization in an isolated escrow container.",
      icon: Lock,
      chip: "PayPal Orders v2",
    },
    {
      step: "02",
      title: "Freelancer Submits Deliverable",
      desc: "Freelancer inspects pinned criteria and attaches raw code, technical documentation, or deliverable text directly through the isolated submission portal.",
      icon: FileCheck,
      chip: "Client Sandbox",
    },
    {
      step: "03",
      title: "Gemini AI Audits Against Criteria",
      desc: "Gemini Flash evaluates the deliverable against each criterion individually, producing structured JSON reasoning with a 0 to 100 quality confidence score.",
      icon: Cpu,
      chip: "Structured JSON Output",
    },
    {
      step: "04",
      title: "Autonomous Disbursal on 100% Pass",
      desc: "The instant Gemini certifies all acceptance requirements are satisfied, the PayPal Payouts API v1 triggers automatic disbursement to the freelancer's PayPal address.",
      icon: DollarSign,
      chip: "PayPal Payouts v1",
    },
    {
      step: "05",
      title: "Immutable Live Audit Trail",
      desc: "Every order capture, criteria score, and payout batch transaction ID is logged into the reactive AG Grid ledger for permanent auditability.",
      icon: TableProperties,
      chip: "AG Grid Community",
    },
  ];

  const faqs = [
    {
      q: "How does PayGuard prevent prompt injection in freelancer submissions?",
      a: "Deliverables are encapsulated inside an isolated data envelope and evaluated strictly against formal JSON schema rules. The model cannot alter payment triggers through conversational injection because the backend enforces hard boolean schema boundaries.",
    },
    {
      q: "What happens if a submission does not meet all criteria?",
      a: "Escrow funds remain securely locked inside the client's PayPal escrow container. The freelancer receives an itemized breakdown of failed criteria with clear reasons and can revise and resubmit.",
    },
    {
      q: "Does PayGuard hold custody of user funds?",
      a: "No. PayGuard is non-custodial. Funds are held directly in PayPal's escrow infrastructure via PayPal Orders v2 and transferred via PayPal Payouts v1.",
    },
    {
      q: "Why use Gemini Flash instead of a standard human arbiter?",
      a: "Human arbiters take days or weeks, charge 5% to 20% platform commissions, and suffer from subjective bias. Gemini audits deliverables against quantifiable criteria in under two seconds with zero platform cut.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F4F4F7] flex flex-col selection:bg-blue-500/30 overflow-x-hidden">
      <MarketingNav onOpenCommand={() => setCommandOpen(true)} />

      {/* Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600/[0.08] blur-[180px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/[0.06] blur-[160px]" />
        <div className="absolute bottom-1/4 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-600/[0.05] blur-[160px]" />
      </div>

      {/* ── 1. ATTENTION (HERO) ── */}
      <section className="relative pt-24 md:pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Clickable Pipeline Chip */}
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white hover:bg-white/[0.08] hover:border-blue-500/30 transition-all group shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>PayPal Orders v2</span>
            <span className="text-slate-500">→</span>
            <span className="text-purple-300 font-semibold">Gemini Flash</span>
            <span className="text-slate-500">→</span>
            <span>PayPal Payouts v1</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Hero H1 - strictly 2 lines max with wide container */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Escrow that thinks.
            <span className="block bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mt-2">
              Autonomous verification and payout.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Replace subjective dispute tickets and human delays. Lock client funds via PayPal Checkout, audit deliverables with Gemini structured reasoning, and disburse payouts in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Launch Escrow Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Protocol Architecture
              </Button>
            </Link>
          </div>

          {/* Abstract Hero Mockup (Zero Demo Data / Shapes Only) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-12 max-w-3xl mx-auto"
          >
            <div className="rounded-3xl border border-white/[0.1] bg-[#101018]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  <span className="text-xs font-mono text-slate-500 ml-2">
                    payguard-protocol-runtime
                  </span>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Autonomous Engine Active
                </div>
              </div>

              {/* Abstract Flow Visual */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-blue-400">Escrow Container</div>
                  <div className="h-4 w-3/4 bg-white/[0.08] rounded" />
                  <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
                  <div className="h-6 w-full rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-300 font-mono">
                    Orders v2 Lock
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-purple-400">Gemini Arbiter</div>
                  <div className="h-4 w-5/6 bg-white/[0.08] rounded" />
                  <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
                  <div className="h-6 w-full rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[10px] text-purple-300 font-mono">
                    Schema Verification
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-emerald-400">Settlement Rail</div>
                  <div className="h-4 w-2/3 bg-white/[0.08] rounded" />
                  <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
                  <div className="h-6 w-full rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-300 font-mono">
                    Payouts v1 Batch
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. THE TRUST GAP (INTEREST) ── */}
      <section className="py-24 px-6 border-t border-white/[0.06] bg-[#08080C]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              The Trust Gap in Modern Gig Work
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Traditional micro-bounties force either the client or the freelancer to bear 100% of the counterparty risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-rose-500/[0.03] border border-rose-500/20 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-rose-300">Without Autonomous Escrow</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  Clients pay upfront for incomplete code, stubbed functions, or abandoned tasks.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  Freelancers deliver honest work and face delayed approvals, chargebacks, or ghosting.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">•</span>
                  Centralized dispute mediation takes weeks and imposes 10% to 20% platform commission cuts.
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-emerald-500/[0.03] border border-emerald-500/20 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-300">With PayGuard Autonomous Arbiter</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  Funds are locked into non-custodial PayPal escrow before work commences.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  Gemini Flash evaluates deliverables against unambiguous acceptance criteria deterministically.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  PayPal Payouts dispatches instantly upon verification with 0 human bottlenecks.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. PINNED 5-STEP PROTOCOL (DESIRE) ── */}
      <section className="py-28 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              The 5-Step Autonomous Lifecycle
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              How funds move from client checkout to automated settlement without subjective intervention.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-6 sm:p-8 rounded-3xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.045] hover:border-white/[0.1] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-600 shrink-0">
                      {s.step}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-400 shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                          {s.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 bg-white/[0.05] border border-white/[0.08] px-3 py-1 rounded-full shrink-0">
                    {s.chip}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. FACTUAL STATS STRIP ── */}
      <section className="py-16 px-6 border-y border-white/[0.06] bg-[#07070B]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white">3</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">PayPal APIs Connected</div>
            <div className="text-[11px] text-slate-500 font-mono">Orders v2, Payouts v1, OAuth2</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white">0</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Human Dispute Steps</div>
            <div className="text-[11px] text-slate-500 font-mono">Fully Autonomous Verification</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white">100%</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Structured JSON Output</div>
            <div className="text-[11px] text-slate-500 font-mono">Strict Schema Validation</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold font-mono text-white">&lt; 3s</div>
            <div className="text-xs uppercase tracking-wider text-slate-400">Average Audit Latency</div>
            <div className="text-[11px] text-slate-500 font-mono">Gemini Flash Inference</div>
          </div>
        </div>
      </section>

      {/* ── 5. GAPLESS BENTO GRID ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Engineered for Autonomous Certainty
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Every component works to ensure financial disbursement is tied strictly to quantifiable deliverables.
            </p>
          </div>

          {/* Bento Grid with grid-flow-dense and mathematically interlocking cells */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">Dual PayPal API Handshake</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Most platforms use a single checkout flow. PayGuard couples client-side PayPal Orders v2 escrow captures with server-side PayPal Payouts v1 programmatic dispatches, bridging consumer checkout with enterprise disbursement.
              </p>
            </div>

            <div className="md:col-span-1 p-8 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">Schema Enforcement</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gemini outputs typed boolean results per criterion. No conversational drift, no hallucinated approvals.
              </p>
            </div>

            <div className="md:col-span-1 p-8 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
                <TableProperties className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">AG Grid Ledger</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enterprise real-time audit grid recording order IDs, confidence scores, and payout batch receipts.
              </p>
            </div>

            <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.025] border border-white/[0.08] space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">Zero Seed, Zero Demo Mandate</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                PayGuard ships with zero preloaded records or fake values. Every single bounty, escrow transaction, and ledger item is created exclusively by real user action through PayPal Sandbox.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PROTOCOL FAQ ── */}
      <section className="py-20 px-6 border-t border-white/[0.06] bg-[#08080C]">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-400">Technical inquiries regarding escrow mechanics and verification boundaries.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-blue-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FINAL ACTION (CTA) ── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto text-center rounded-3xl p-12 md:p-16 bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Ready to experience autonomous escrow?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Create your first escrow bounty in seconds using PayPal Sandbox, verify deliverables with Gemini, and disburse real-time batch payouts.
          </p>
          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Enter PayGuard Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
