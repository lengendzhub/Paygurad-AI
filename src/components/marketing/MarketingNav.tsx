"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Command, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[var(--bg)]/85 border-b border-[var(--border)] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#007AFF] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1.5">
            <span className="font-ui font-semibold text-base tracking-tight text-[var(--fg)] block leading-none">
              PayGuard
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--fg-muted)] leading-none block">
              AI Escrow
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-1.5 text-xs font-ui font-medium rounded-full transition-all
                  ${
                    isActive
                      ? "bg-[var(--surface-strong)] text-[var(--fg)] border border-[var(--border-strong)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-strong)]"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-ui text-[var(--fg-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:text-[var(--fg)] hover:bg-[var(--surface-strong)] transition cursor-pointer"
              title="Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span>⌘K</span>
            </button>
          )}

          <Link href="/login?role=client">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-medium">
              Client Portal
            </Button>
          </Link>

          <Link href="/login?role=freelancer">
            <Button variant="primary" size="sm" className="hidden sm:inline-flex text-xs font-medium">
              Freelancer Portal
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg)] border-b border-[var(--border)] px-6 py-4 space-y-3 font-ui">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] py-1.5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <Link href="/login?role=client" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Client Portal
              </Button>
            </Link>
            <Link href="/login?role=freelancer" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button variant="primary" size="sm" className="w-full justify-center">
                Freelancer Portal
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
