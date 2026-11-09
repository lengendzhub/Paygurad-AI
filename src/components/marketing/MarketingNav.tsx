"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Command, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MarketingNavProps {
  onOpenCommand?: () => void;
}

export function MarketingNav({ onOpenCommand }: MarketingNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "Product", href: "/" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Security", href: "/security" },
    { label: "Roadmap", href: "/roadmap" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#0B0B0F]/80 border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-none">
              PayGuard
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 leading-none">
              AI Escrow
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-1.5 text-xs font-medium rounded-full transition-all
                  ${
                    isActive
                      ? "bg-white/[0.1] text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:text-white hover:bg-white/[0.08] transition"
              title="Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span>⌘K</span>
            </button>
          )}

          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              Launch App
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0F] border-b border-white/[0.08] px-6 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-300 hover:text-white py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full justify-center">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

