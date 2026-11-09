"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Code2,
  ArrowRight,
  Lock,
  CheckCircle2,
  Zap,
  UserCheck,
  Building2,
  Laptop,
  Check,
} from "lucide-react";
import { usePayGuardStore, UserRole } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion } from "motion/react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-xs font-mono text-[var(--fg-muted)]">Loading presentation portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get("role") as UserRole | null;
  const redirectTarget = searchParams.get("redirect") || "";

  const currentUserRole = usePayGuardStore((state) => state.userRole);
  const setUserRole = usePayGuardStore((state) => state.setUserRole);

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    initialRoleParam === "freelancer" ? "freelancer" : "client"
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const destination = redirectTarget || (initialRoleParam === "freelancer" ? "/bounties?role=freelancer" : "/dashboard");
    if (typeof window !== "undefined") {
      window.location.replace(destination);
    }
  }, [initialRoleParam, redirectTarget]);

  const handleLogin = (role: UserRole) => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setSelectedRole(role);

    const email = role === "client" ? "client@payguard.ai" : "freelancer@payguard.ai";
    setUserRole(role, email);

    // Synchronously write to localStorage to guarantee instant hydration without page reloads
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("payguard_store_v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.state) {
            parsed.state.userRole = role;
            parsed.state.userEmail = email;
            localStorage.setItem("payguard_store_v2", JSON.stringify(parsed));
          }
        }
      } catch {
        // ignore storage errors
      }
    }

    const destination =
      redirectTarget ||
      (role === "client" ? "/dashboard" : "/bounties?role=freelancer");

    // Immediate browser navigation avoids Next.js 16 partial prefetch router stalls
    if (typeof window !== "undefined") {
      window.location.assign(destination);
    } else {
      router.push(destination);
    }

    setTimeout(() => {
      setIsLoggingIn(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col font-body selection:bg-[#007AFF]/30 selection:text-white">
      {/* Top Header */}
      <header className="w-full border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#007AFF] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-base tracking-tight text-[var(--fg)] block leading-none">
                PayGuard
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--fg-muted)] leading-none block">
                Presentation Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-ui text-[var(--fg-muted)] hover:text-[var(--fg)] transition"
            >
              Back to Overview
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:py-16">
        <div className="max-w-4xl w-full space-y-10">
          {/* Header Title */}
          <div className="text-center space-y-3 font-ui">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#007aff]/10 text-[#007aff] border border-[#007aff]/25">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Role-Separated Presentation Mode</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--fg)]">
              Sign In to PayGuard AI
            </h1>
            <p className="font-body text-sm text-[var(--fg-muted)] max-w-xl mx-auto">
              Select a dedicated persona to demonstrate either the Client escrow authorization workflow or the Freelancer deliverable submission and settlement lifecycle.
            </p>
          </div>

          {/* Persona Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* CLIENT CARD */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleLogin("client")}
              className={`rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                selectedRole === "client"
                  ? "border-[#007aff] bg-[#007aff]/5 ring-2 ring-[#007aff]/20 shadow-lg"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[#007aff]/60 hover:bg-[#007aff]/5"
              }`}
            >
              {selectedRole === "client" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#007aff] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#007aff]/15 border border-[#007aff]/30 flex items-center justify-center text-[#007aff]">
                    <Building2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#007aff] block font-semibold">
                      Client Portal
                    </span>
                    <h2 className="font-display text-2xl font-normal text-[var(--fg)]">
                      Escrow Funder
                    </h2>
                  </div>
                </div>

                <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                  Post requirements, lock funds in PayPal Orders v2 sandbox escrow buffer, generate shareable freelancer invite links, and review automated Gemini AI audit results.
                </p>

                {/* Workflow capabilities */}
                <div className="space-y-2 pt-2 border-t border-[var(--border)] font-ui">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--fg-subtle)] block">
                    Included Client Capabilities
                  </span>
                  <div className="space-y-1.5 text-xs text-[var(--fg)] font-medium">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#007aff] shrink-0" />
                      <span>Commit escrow with PayPal Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#007aff] shrink-0" />
                      <span>Configure Gemini AI acceptance criteria</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007aff] shrink-0" />
                      <span>Generate shareable freelancer invite links</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Credential */}
                <div className="p-3 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] font-mono text-xs flex items-center justify-between">
                  <span className="text-[var(--fg-muted)]">Demo Account</span>
                  <span className="text-[var(--fg)] font-semibold">client@payguard.ai</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogin("client");
                  }}
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#007AFF] hover:bg-[#0066d6] active:scale-[0.98] text-white font-ui font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>
                    {isLoggingIn && selectedRole === "client"
                      ? "Opening Dashboard..."
                      : "Sign In as Client"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>

            {/* FREELANCER CARD */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleLogin("freelancer")}
              className={`rounded-[28px] border p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                selectedRole === "freelancer"
                  ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20 shadow-lg"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-emerald-500/60 hover:bg-emerald-500/5"
              }`}
            >
              {selectedRole === "freelancer" && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center dark:text-emerald-400 text-emerald-600">
                    <Laptop className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 block font-semibold">
                      Freelancer Portal
                    </span>
                    <h2 className="font-display text-2xl font-normal text-[var(--fg)]">
                      Deliverable Submitter
                    </h2>
                  </div>
                </div>

                <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
                  Inspect locked escrow guarantees before starting work, submit completed code deliverables, trigger Gemini 3.5 Flash audits, and receive instant PayPal payouts.
                </p>

                {/* Workflow capabilities */}
                <div className="space-y-2 pt-2 border-t border-[var(--border)] font-ui">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--fg-subtle)] block">
                    Included Freelancer Capabilities
                  </span>
                  <div className="space-y-1.5 text-xs text-[var(--fg)] font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Verify escrow guarantee before coding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Submit deliverables to Gemini Arbiter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Receive automated PayPal Payouts v1</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Credential */}
                <div className="p-3 rounded-xl bg-[var(--surface-strong)] border border-[var(--border)] font-mono text-xs flex items-center justify-between">
                  <span className="text-[var(--fg-muted)]">Demo Account</span>
                  <span className="text-[var(--fg)] font-semibold">freelancer@payguard.ai</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogin("freelancer");
                  }}
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-ui font-semibold text-base flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>
                    {isLoggingIn && selectedRole === "freelancer"
                      ? "Opening Workspace..."
                      : "Sign In as Freelancer"}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Presentation Note */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center font-ui text-xs text-[var(--fg-muted)] space-y-1">
            <p className="font-semibold text-[var(--fg)]">
              Demonstration Workflow Tip
            </p>
            <p>
              To demonstrate the full lifecycle live, open one browser window as <span className="text-[#007aff] font-semibold">Client</span> to fund a bounty, copy the invite link, and open it in a separate tab or incognito window as <span className="text-emerald-400 font-semibold">Freelancer</span> to submit work and claim the automated payout.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
