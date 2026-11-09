"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import {
  Lock,
  FileCheck,
  Cpu,
  DollarSign,
  TableProperties,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/Button";
import { CommandPalette } from "@/components/app/CommandPalette";
import { HeroGradient } from "@/components/marketing/HeroGradient";
import { MarqueeRibbon } from "@/components/marketing/MarqueeRibbon";
import { RevealStatement } from "@/components/marketing/RevealStatement";
import { AccentText } from "@/components/marketing/AccentText";
import { PipelineChip } from "@/components/marketing/PipelineChip";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LandingPreloader } from "@/components/marketing/LandingPreloader";
import { useScrollRefresh } from "@/hooks/useScrollRefresh";

export default function LandingPage() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Hook to refresh GSAP ScrollTrigger
  useScrollRefresh();

  // Tilt state for Bento cards
  const [tiltStyle, setTiltStyle] = useState<{ [key: number]: string }>({});

  const handleCardMouseMove = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTiltStyle((prev) => ({
      ...prev,
      [index]: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
    }));
  };

  const handleCardMouseLeave = (index: number) => {
    setTiltStyle((prev) => ({
      ...prev,
      [index]: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    }));
  };

  const steps = [
    {
      num: "01",
      title: "Lock Client Funds in Escrow",
      desc: "Client defines acceptance criteria and commits reward funds. PayPal Orders API v2 securely holds the authorization in an isolated escrow container.",
      api: "PayPal Orders v2",
      icon: Lock,
    },
    {
      num: "02",
      title: "Freelancer Submits Deliverable",
      desc: "Freelancer inspects pinned criteria and submits work along with their sandbox PayPal email directly through the isolated boundary.",
      api: "Submission Envelope",
      icon: FileCheck,
    },
    {
      num: "03",
      title: "Gemini Audits Against Criteria",
      desc: "Gemini Flash evaluates the deliverable against each criterion individually, producing structured JSON reasoning and a confidence score.",
      api: "Gemini Structured Output",
      icon: Cpu,
    },
    {
      num: "04",
      title: "Autonomous Disbursal on 100% Pass",
      desc: "Upon passing all acceptance criteria, the PayPal Payouts API v1 triggers automatic disbursement directly to the freelancer.",
      api: "PayPal Payouts v1",
      icon: DollarSign,
    },
    {
      num: "05",
      title: "Immutable Live Audit Trail",
      desc: "Every order capture, criteria score, and payout batch transaction ID is logged into the reactive AG Grid ledger for permanent auditability.",
      api: "AG Grid Ledger",
      icon: TableProperties,
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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col selection:bg-[#0088cc]/30 selection:text-white overflow-x-hidden">
      {/* Landing Page Load & Entrance Sequence */}
      <LandingPreloader onComplete={() => setIsLoaded(true)} />

      <MarketingNav onOpenCommand={() => setCommandOpen(true)} />

      {/* ── 1. ATTENTION (HERO SECTION) ── */}
      <section className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-[var(--bg)] pt-20 pb-16 px-6 lg:px-12">
        {/* Soft atmospheric gradient lighting in #78C5EF and #51A0D5 */}
        <HeroGradient />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 z-10 my-auto">
          {/* Left Text Block with Staggered Cascading Entrance */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div>
              <PipelineChip />
            </div>

            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-[var(--fg)]">
              Escrow that{" "}
              <AccentText preset="hero" className="italic font-normal">
                thinks.
              </AccentText>
            </h1>

            <p className="font-body text-base sm:text-lg md:text-xl text-[var(--fg-muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Autonomous Escrow & Work-Verification Protocol. Funds locked via PayPal Orders v2,
              audited criterion-by-criterion by Gemini, disbursed instantly via PayPal Payouts v1.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  <span>Launch App</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Verification Card Mockup (Abstract Skeleton Only, NO Fake Data) */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.96 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div
              ref={cardRef}
              className="w-full max-w-md rounded-[28px] border border-[var(--border)] bg-[var(--surface)] backdrop-blur-2xl p-6 sm:p-7 relative overflow-hidden transition-all duration-300"
            >
              {/* Header with abstract indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc] animate-pulse" />
                  <span className="font-ui text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                    Escrow Verification
                  </span>
                </div>
                <span className="font-ui text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#0088cc]/30 text-[#0088cc] bg-[#0088cc]/10">
                  Protocol Active
                </span>
              </div>

              {/* Abstract Score Ring Skeleton */}
              <div className="my-6 flex items-center justify-between gap-6 p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-[var(--border)] border-t-[#0088cc] flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#0088cc]" />
                  </div>
                  <div>
                    <div className="font-ui text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                      Confidence Score
                    </div>
                    <div className="font-display text-xl text-[var(--fg)] mt-0.5">
                      Gemini Arbiter
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-ui text-[11px] uppercase tracking-wider text-[var(--fg-subtle)]">
                    Status
                  </div>
                  <div className="font-ui text-xs font-semibold dark:text-emerald-400 text-emerald-600">
                    Verified
                  </div>
                </div>
              </div>

              {/* 3 Criteria Check Bars (Abstract skeleton shapes) */}
              <div className="space-y-3">
                <div className="font-ui text-xs uppercase tracking-wider text-[var(--fg-subtle)] mb-1">
                  Acceptance Criteria Check
                </div>
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <div className="w-5 h-5 rounded-full border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 dark:text-emerald-400 text-emerald-600" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2 rounded bg-[var(--fg-subtle)]/40 w-3/4" />
                      <div className="h-1.5 rounded bg-[var(--fg-subtle)]/20 w-1/2" />
                    </div>
                    <span className="font-ui text-[10px] dark:text-emerald-400 text-emerald-600 uppercase font-semibold">
                      Pass
                    </span>
                  </div>
                ))}
              </div>

              {/* Payout Bar Skeleton */}
              <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#0088cc]" />
                  <span className="font-ui text-xs uppercase tracking-wider text-[var(--fg-muted)]">
                    Disbursement
                  </span>
                </div>
                <span className="font-ui text-xs text-[#0088cc] font-semibold">
                  PayPal Payouts v1
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <div className="flex justify-center pt-8 z-10">
          <span className="text-[10px] font-ui uppercase tracking-widest text-[var(--fg-subtle)] flex items-center gap-1.5">
            Scroll to explore
            <ChevronDown className="w-3 h-3 animate-bounce" />
          </span>
        </div>
      </section>

      {/* ── 2. SCROLL VELOCITY MARQUEE RIBBON ── */}
      <MarqueeRibbon />

      {/* ── 3. INTEREST (THE TRUST GAP) ── */}
      <section className="py-28 px-6 lg:px-12 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* ScrollReveal Scrub Statement */}
          <div className="text-center">
            <RevealStatement preset="scrub">
              Clients won&apos;t pay before they see the work. Freelancers won&apos;t deliver before they see the money. PayGuard AI closes that gap.
            </RevealStatement>
          </div>

          {/* Trust Gap Split Architecture Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Buyer Side */}
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between">
              <div>
                <span className="font-ui text-xs uppercase tracking-wider text-[var(--fg-muted)] block mb-3">
                  The Client Perspective
                </span>
                <h3 className="font-display text-2xl text-[var(--fg)] mb-3">
                  Protected from Non-Delivery
                </h3>
                <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
                  Funds are authorized in PayPal escrow upfront. If the freelancer fails to meet the formal acceptance criteria, funds are never released.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border)] font-ui text-xs text-[#0088cc]">
                PayPal Orders API v2
              </div>
            </div>

            {/* Protocol Arbiter Middle */}
            <div className="rounded-[28px] border border-[#0088cc]/40 bg-[#0088cc]/5 p-8 flex flex-col justify-between relative">
              <div>
                <span className="font-ui text-xs uppercase tracking-wider text-[#0088cc] font-semibold block mb-3">
                  PayGuard Protocol
                </span>
                <h3 className="font-display text-2xl text-[var(--fg)] mb-3">
                  Autonomous Gemini Arbiter
                </h3>
                <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
                  Evaluates each requirement individually using structured JSON output. Zero human delays, zero subjective platform bias, 100% objective validation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0088cc]/20 font-ui text-xs text-[#0088cc] font-semibold">
                Google Gemini 3.5 Flash
              </div>
            </div>

            {/* Freelancer Side */}
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between">
              <div>
                <span className="font-ui text-xs uppercase tracking-wider text-[var(--fg-muted)] block mb-3">
                  The Freelancer Perspective
                </span>
                <h3 className="font-display text-2xl text-[var(--fg)] mb-3">
                  Guaranteed Instant Payout
                </h3>
                <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
                  Freelancers inspect funded escrow before writing a single line of code. Deliver code that passes criteria, and payouts hit your PayPal instantly.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border)] font-ui text-xs text-[#0088cc]">
                PayPal Payouts API v1
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. DESIRE (PINNED 5-STEP PROTOCOL STORY) ── */}
      <section className="py-28 px-6 lg:px-12 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-ui text-xs uppercase tracking-wider text-[#0088cc] block mb-2">
              Step-by-Step Architecture
            </span>
            <RevealStatement preset="enter">
              How Autonomous Escrow Operates
            </RevealStatement>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-all p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <span className="font-ui text-3xl font-bold text-[#0088cc]/40">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/10 border border-[#0088cc]/30 flex items-center justify-center text-[#0088cc] shrink-0">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-[var(--fg)]">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-[var(--fg-muted)] max-w-xl mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  <div className="font-ui text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[var(--border-strong)] text-[var(--fg-muted)] shrink-0 self-end md:self-center">
                    {step.api}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. STATS STRIP (FACTUAL DESIGN METRICS ONLY) ── */}
      <section className="py-20 px-6 lg:px-12 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center font-ui">
          <div className="space-y-1">
            <div className="font-body tabular-nums text-4xl sm:text-5xl font-bold text-[var(--fg)]">
              <AnimatedCounter value={3} />
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              PayPal Core APIs
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-body tabular-nums text-4xl sm:text-5xl font-bold text-[#0088cc]">
              <AnimatedCounter value={0} />
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              Human Steps in Payout
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-body tabular-nums text-4xl sm:text-5xl font-bold text-[var(--fg)]">
              <AnimatedCounter value={100} suffix="%" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              Isolated Criteria Audits
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-body tabular-nums text-4xl sm:text-5xl font-bold text-[#0088cc]">
              <AnimatedCounter value={0} />
            </div>
            <div className="text-xs uppercase tracking-wider text-[var(--fg-muted)]">
              Fake or Seeded Accounts
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BENTO GRID (WITH POINTER TILT CUE) ── */}
      <section className="py-28 px-6 lg:px-12 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-ui text-xs uppercase tracking-wider text-[#0088cc] block mb-2">
              Engineered for Resilience
            </span>
            <RevealStatement preset="enter">
              Institutional-Grade Autonomous Escrow
            </RevealStatement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(1, e)}
              onMouseLeave={() => handleCardMouseLeave(1)}
              style={{
                transform: tiltStyle[1] || "perspective(1000px)",
                transition: "transform 0.15s ease-out",
              }}
              className="md:col-span-2 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between"
            >
              <div>
                <Shield className="w-8 h-8 text-[#0088cc] mb-4" />
                <h3 className="font-display text-3xl text-[var(--fg)] mb-2">
                  Prompt-Injection Isolation Envelope
                </h3>
                <p className="font-body text-base text-[var(--fg-muted)] leading-relaxed">
                  Freelancer deliverables are treated as untrusted user payloads. They are quarantined in a sandboxed schema evaluator that Gemini tests against strict boolean criteria. No conversational overrides can hijack the disbursement trigger.
                </p>
              </div>
              <div className="mt-8 font-ui text-xs uppercase tracking-wider text-[#0088cc]">
                Security First Protocol
              </div>
            </div>

            {/* Bento Card 2 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(2, e)}
              onMouseLeave={() => handleCardMouseLeave(2)}
              style={{
                transform: tiltStyle[2] || "perspective(1000px)",
                transition: "transform 0.15s ease-out",
              }}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between"
            >
              <div>
                <Zap className="w-8 h-8 text-[#0088cc] mb-4" />
                <h3 className="font-display text-2xl text-[var(--fg)] mb-2">
                  Sub-Second Audits
                </h3>
                <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
                  Evaluations execute via Google Gemini 3.5 Flash, providing comprehensive code analysis, automated test verification, and structured confidence scores in seconds.
                </p>
              </div>
              <div className="mt-8 font-ui text-xs uppercase tracking-wider text-[#0088cc]">
                Real-Time Verification
              </div>
            </div>

            {/* Bento Card 3 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(3, e)}
              onMouseLeave={() => handleCardMouseLeave(3)}
              style={{
                transform: tiltStyle[3] || "perspective(1000px)",
                transition: "transform 0.15s ease-out",
              }}
              className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between"
            >
              <div>
                <TableProperties className="w-8 h-8 text-[#0088cc] mb-4" />
                <h3 className="font-display text-2xl text-[var(--fg)] mb-2">
                  AG Grid Ledger
                </h3>
                <p className="font-body text-sm text-[var(--fg-muted)] leading-relaxed">
                  Full institutional record-keeping. Filter, sort, and inspect every captured escrow order and batch payout ID with deep audit drawer trails.
                </p>
              </div>
              <div className="mt-8 font-ui text-xs uppercase tracking-wider text-[#0088cc]">
                Complete Traceability
              </div>
            </div>

            {/* Bento Card 4 */}
            <div
              onMouseMove={(e) => handleCardMouseMove(4, e)}
              onMouseLeave={() => handleCardMouseLeave(4)}
              style={{
                transform: tiltStyle[4] || "perspective(1000px)",
                transition: "transform 0.15s ease-out",
              }}
              className="md:col-span-2 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col justify-between"
            >
              <div>
                <Lock className="w-8 h-8 text-[#0088cc] mb-4" />
                <h3 className="font-display text-3xl text-[var(--fg)] mb-2">
                  Non-Custodial Sandbox Architecture
                </h3>
                <p className="font-body text-base text-[var(--fg-muted)] leading-relaxed">
                  PayGuard never touches client or freelancer funds directly. All custody is maintained within PayPal's official merchant infrastructure using OAuth2 credentials and certified endpoint handshakes.
                </p>
              </div>
              <div className="mt-8 font-ui text-xs uppercase tracking-wider text-[#0088cc]">
                Certified PayPal Integration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ (ACCORDION) ── */}
      <section className="py-28 px-6 lg:px-12 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-ui text-xs uppercase tracking-wider text-[#0088cc] block mb-2">
              Common Questions
            </span>
            <RevealStatement preset="enter">
              Frequently Asked Questions
            </RevealStatement>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer font-ui"
                  >
                    <span className="font-semibold text-base sm:text-lg text-[var(--fg)]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--fg-muted)] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#0088cc]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-[var(--border)] text-sm sm:text-base font-body text-[var(--fg-muted)] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. ACTION (FINAL CTA) ── */}
      <section className="py-32 px-6 lg:px-12 relative overflow-hidden bg-[var(--bg)] text-center">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <RevealStatement preset="enter">
            Ready for autonomous, dispute-free bounties?
          </RevealStatement>

          <p className="font-body text-base sm:text-lg text-[var(--fg-muted)] max-w-xl mx-auto leading-relaxed">
            Create your first escrow bounty in PayPal Sandbox, define acceptance criteria, and experience automated AI verification.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span>Launch App</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Protocol Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
}
