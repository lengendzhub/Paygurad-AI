"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  PlusCircle,
  TableProperties,
  Settings,
  ShieldCheck,
  Command,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AppSidebarProps {
  onOpenCommand?: () => void;
}

export function AppSidebar({ onOpenCommand }: AppSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Bounties", href: "/bounties", icon: Coins },
    { label: "Create Bounty", href: "/bounties/new", icon: PlusCircle },
    { label: "Ledger", href: "/ledger", icon: TableProperties },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[var(--bg)] p-6 min-h-screen sticky top-0 font-ui">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#007AFF] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-base tracking-tight text-[var(--fg)] block leading-none">
                  PayGuard
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[var(--fg-muted)] leading-none block">
                  AI Escrow
                </span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/bounties"
                  ? pathname.startsWith("/bounties") && pathname !== "/bounties/new"
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-[#007AFF]/15 text-[#007AFF] border border-[#007AFF]/30 font-semibold"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#007AFF]" : "text-[var(--fg-muted)]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-[var(--border)]">
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-[var(--fg-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:text-[var(--fg)] hover:bg-[var(--surface-strong)] transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5" />
                Quick Commands
              </span>
              <kbd className="text-[10px] bg-[var(--surface-strong)] px-1.5 py-0.5 rounded font-mono border border-[var(--border)]">
                ⌘K
              </kbd>
            </button>
          )}

          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition"
          >
            <span>Marketing Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)]/95 backdrop-blur-xl border-t border-[var(--border)] px-4 py-2 flex items-center justify-around font-ui">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/bounties"
              ? pathname.startsWith("/bounties") && pathname !== "/bounties/new"
              : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-xl transition text-[11px] font-medium
                ${isActive ? "text-[#007AFF]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
