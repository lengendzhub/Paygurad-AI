import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] py-16 px-6 font-body">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#007AFF] flex items-center justify-center text-[#000000]">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-ui font-bold text-[var(--fg)] tracking-tight">PayGuard AI</span>
          </div>
          <p className="text-xs text-[var(--fg-muted)] leading-relaxed max-w-xs">
            Autonomous Escrow & Work-Verification Protocol powered by PayPal Orders v2, PayPal Payouts v1, and Google Gemini.
          </p>
          <div className="text-[11px] text-[var(--fg-subtle)] font-mono">
            Sandbox Environment Active
          </div>
        </div>

        <div>
          <h4 className="text-xs font-ui font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-xs font-ui text-[var(--fg-muted)]">
            <li>
              <Link href="/dashboard" className="hover:text-[var(--fg)] transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/bounties" className="hover:text-[var(--fg)] transition">
                Active Bounties
              </Link>
            </li>
            <li>
              <Link href="/bounties/new" className="hover:text-[var(--fg)] transition">
                Create Bounty
              </Link>
            </li>
            <li>
              <Link href="/ledger" className="hover:text-[var(--fg)] transition">
                AG Grid Ledger
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-ui font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
            Architecture
          </h4>
          <ul className="space-y-2 text-xs font-ui text-[var(--fg-muted)]">
            <li>
              <Link href="/how-it-works" className="hover:text-[var(--fg)] transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-[var(--fg)] transition">
                Prompt Injection Defense
              </Link>
            </li>
            <li>
              <Link href="/roadmap" className="hover:text-[var(--fg)] transition">
                Product Roadmap
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-ui font-semibold uppercase tracking-wider text-[var(--fg-muted)] mb-3">
            Protocols & APIs
          </h4>
          <ul className="space-y-2 text-xs text-[var(--fg-muted)] font-mono">
            <li>PayPal Orders API v2</li>
            <li>PayPal Payouts API v1</li>
            <li>Google Gemini 3.5 Flash</li>
            <li>AG Grid Community v36</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--fg-subtle)] gap-4 font-ui">
        <span>PayGuard AI Protocol. Open source and MIT Licensed.</span>
        <span>No real funds are transferred in sandbox mode.</span>
      </div>
    </footer>
  );
}
