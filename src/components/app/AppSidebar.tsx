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
import { SandboxBadge } from "./SandboxBadge";

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
      <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between border-r border-white/[0.08] bg-[#0A0A0E] p-6 min-h-screen sticky top-0">
        <div className="space-y-6">
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

          {/* Sandbox Indicator */}
          <div>
            <SandboxBadge />
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
                        ? "bg-gradient-to-r from-blue-600/20 to-purple-600/10 text-white border border-blue-500/30 shadow-[0_0_16px_rgba(59,130,246,0.15)]"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-white/[0.06]">
          {onOpenCommand && (
            <button
              onClick={onOpenCommand}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Command className="w-3.5 h-3.5" />
                Quick Commands
              </span>
              <kbd className="text-[10px] bg-white/[0.08] px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>
          )}

          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 text-xs text-slate-500 hover:text-slate-300 transition"
          >
            <span>Marketing Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0F]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 flex items-center justify-around">
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
                flex flex-col items-center gap-1 p-2 rounded-xl transition text-[10px] font-medium
                ${isActive ? "text-blue-400" : "text-slate-400 hover:text-white"}
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

