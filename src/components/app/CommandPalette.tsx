"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Coins,
  PlusCircle,
  TableProperties,
  Settings,
  HelpCircle,
  Shield,
  Milestone,
  Trash2,
  Search,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmClearData?: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onConfirmClearData,
}: CommandPaletteProps) {
  const router = useRouter();
  const bounties = usePayGuardStore((state) => state.bounties);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const navigateTo = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-[#12121A] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden z-10">
        <Command className="w-full">
          <div className="flex items-center px-4 border-b border-white/[0.08]">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
            <Command.Input
              placeholder="Type a command or search bounties..."
              className="w-full bg-transparent py-4 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-3 space-y-1">
            <Command.Empty className="p-4 text-center text-xs text-slate-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-2 py-1.5">
              <Command.Item
                onSelect={() => navigateTo("/dashboard")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/bounties")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <Coins className="w-4 h-4 text-purple-400" />
                <span>Active Bounties</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/bounties/new")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Create New Escrow Bounty</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/ledger")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <TableProperties className="w-4 h-4 text-cyan-400" />
                <span>AG Grid Ledger</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/settings")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>

            {bounties.length > 0 && (
              <Command.Group heading="Your Bounties" className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-2 py-1.5 mt-2">
                {bounties.map((b) => (
                  <Command.Item
                    key={b.id}
                    onSelect={() => navigateTo(`/bounties/${b.id}`)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-blue-400">{b.id}</span>
                      <span className="truncate max-w-xs">{b.title}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">${b.amount}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Documentation & Protocol" className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-2 py-1.5 mt-2">
              <Command.Item
                onSelect={() => navigateTo("/how-it-works")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>How It Works & Pipeline</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/security")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Prompt Injection Defense</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/roadmap")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl cursor-pointer transition"
              >
                <Milestone className="w-4 h-4 text-slate-400" />
                <span>Product Roadmap</span>
              </Command.Item>
            </Command.Group>

            {onConfirmClearData && (
              <Command.Group heading="Actions" className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest px-2 py-1.5 mt-2">
                <Command.Item
                  onSelect={() => {
                    onOpenChange(false);
                    onConfirmClearData();
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl cursor-pointer transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Local Data</span>
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

