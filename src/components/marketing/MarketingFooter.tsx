import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07070A] py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">PayGuard AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
            Autonomous Escrow & Work-Verification Protocol powered by PayPal Orders v2, PayPal Payouts v1, and Google Gemini.
          </p>
          <div className="text-[11px] text-slate-500 font-mono">
            Sandbox Environment Active
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/bounties" className="hover:text-white transition">
                Active Bounties
              </Link>
            </li>
            <li>
              <Link href="/bounties/new" className="hover:text-white transition">
                Create Bounty
              </Link>
            </li>
            <li>
              <Link href="/ledger" className="hover:text-white transition">
                AG Grid Ledger
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
            Architecture
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <Link href="/how-it-works" className="hover:text-white transition">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-white transition">
                Prompt Injection Defense
              </Link>
            </li>
            <li>
              <Link href="/roadmap" className="hover:text-white transition">
                Product Roadmap
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-white transition">
                Sandbox Credentials
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
            Protocols & APIs
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-mono">
            <li>PayPal Orders API v2</li>
            <li>PayPal Payouts API v1</li>
            <li>Google Gemini 3.5 Flash</li>
            <li>AG Grid Community v36</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>PayGuard AI Protocol. Open source and MIT Licensed.</span>
        <span>No real funds are transferred in sandbox mode.</span>
      </div>
    </footer>
  );
}

