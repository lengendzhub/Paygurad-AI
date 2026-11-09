"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  PlusCircle,
  TableProperties,
  ShieldCheck,
  Command,
  ExternalLink,
  UserCheck,
  Building2,
  Laptop,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePayGuardStore } from "@/lib/store";

interface AppSidebarProps {
  onOpenCommand?: () => void;
}

export function AppSidebar({ onOpenCommand }: AppSidebarProps) {
  const pathname = usePathname();
  const userRole = usePayGuardStore((state) => state.userRole);
  const userEmail = usePayGuardStore((state) => state.userEmail);
  const setUserRole = usePayGuardStore((state) => state.setUserRole);

  const navItems =
    userRole === "client"
      ? [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Bounties", href: "/bounties", icon: Coins },
          { label: "Create Bounty", href: "/bounties/new", icon: PlusCircle },
          { label: "Ledger", href: "/ledger", icon: TableProperties },
        ]
      : [
          { label: "Available Bounties", href: "/bounties", icon: Coins },
          { label: "My Workspace", href: "/dashboard", icon: LayoutDashboard },
          { label: "Ledger", href: "/ledger", icon: TableProperties },
        ];

  const toggleRole = () => {
    setUserRole(userRole === "client" ? "freelancer" : "client");
  };

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-[var(--border)] bg-[var(--bg)] p-6 min-h-screen sticky top-0 font-ui">
        <div className="space-y-6">
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

          {/* Persona Card with 1-click Switcher */}
          <div className="p-3.5 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--fg-muted)]">
                Active Persona
              </span>
              <Link
                href="/login"
                className="text-[10px] text-[#007aff] hover:underline font-medium"
              >
                Change
              </Link>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    userRole === "client"
                      ? "bg-[#007aff]/15 text-[#007aff]"
                      : "bg-emerald-500/15 text-emerald-400"
                  }`}
                >
                  {userRole === "client" ? (
                    <Building2 className="w-4 h-4 stroke-[2]" />
                  ) : (
                    <Laptop className="w-4 h-4 stroke-[2]" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[var(--fg)] truncate leading-none">
                    {userRole === "client" ? "Client (Funder)" : "Freelancer"}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--fg-muted)] truncate mt-0.5">
                    {userEmail || (userRole === "client" ? "client@payguard.ai" : "freelancer@payguard.ai")}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleRole}
                className="text-[10px] font-medium px-2 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition cursor-pointer shrink-0"
                title={`Switch to ${userRole === "client" ? "Freelancer" : "Client"}`}
              >
                Switch
              </button>
            </div>
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
            href="/login"
            className="flex items-center justify-between px-3.5 py-2 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              Change Persona
            </span>
            <span className="text-[10px] font-mono text-[var(--fg-subtle)]">Portal</span>
          </Link>

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
        <Link
          href="/login"
          className="flex flex-col items-center gap-1 p-2 rounded-xl transition text-[11px] font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
        >
          <UserCheck className="w-5 h-5" />
          <span>Role</span>
        </Link>
      </div>
    </>
  );
}
