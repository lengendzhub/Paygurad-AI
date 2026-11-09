"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Coins,
  PlusCircle,
  TableProperties,
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
        className="fixed inset-0 dark:bg-black/75 bg-black/35 backdrop-blur-md"
        onClick={() => onOpenChange(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl dark:bg-[#000000] bg-[#ffffff] border border-[var(--border-strong)] rounded-[28px] shadow-2xl overflow-hidden z-10 font-ui">
        <Command className="w-full">
          <div className="flex items-center px-4 border-b border-[var(--border)]">
            <Search className="w-4 h-4 text-[var(--fg-muted)] shrink-0 mr-3" />
            <Command.Input
              placeholder="Type a command or search bounties..."
              className="w-full bg-transparent py-4 text-sm text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none"
            />
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-3 space-y-1">
            <Command.Empty className="p-4 text-center text-xs text-[var(--fg-muted)]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-[11px] font-semibold text-[var(--fg-subtle)] uppercase tracking-widest px-2 py-1.5">
              <Command.Item
                onSelect={() => navigateTo("/dashboard")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <LayoutDashboard className="w-4 h-4 text-[#007AFF]" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/bounties")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <Coins className="w-4 h-4 text-[#007AFF]" />
                <span>Active Bounties</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/bounties/new")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <PlusCircle className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
                <span>Create New Escrow Bounty</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/ledger")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <TableProperties className="w-4 h-4 text-[#007AFF]" />
                <span>Escrow & Payout Ledger</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Architecture & Docs" className="text-[11px] font-semibold text-[var(--fg-subtle)] uppercase tracking-widest px-2 py-1.5 mt-2">
              <Command.Item
                onSelect={() => navigateTo("/how-it-works")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <HelpCircle className="w-4 h-4 text-[#007AFF]" />
                <span>Interactive Protocol Flow</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/security")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <Shield className="w-4 h-4 text-[#007AFF]" />
                <span>Prompt Injection Defense Architecture</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("/roadmap")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
              >
                <Milestone className="w-4 h-4 text-[#007AFF]" />
                <span>Product Roadmap Timeline</span>
              </Command.Item>
            </Command.Group>

            {bounties.length > 0 && (
              <Command.Group heading="Active Bounties" className="text-[11px] font-semibold text-[var(--fg-subtle)] uppercase tracking-widest px-2 py-1.5 mt-2">
                {bounties.map((b) => (
                  <Command.Item
                    key={b.id}
                    onSelect={() => navigateTo(`/bounties/${b.id}`)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface-strong)] rounded-xl cursor-pointer transition"
                  >
                    <span className="truncate max-w-[280px]">{b.title}</span>
                    <span className="font-mono text-xs text-[#007AFF]">${b.amount}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {onConfirmClearData && (
              <Command.Group heading="Danger Zone" className="text-[11px] font-semibold text-red-500 uppercase tracking-widest px-2 py-1.5 mt-2">
                <Command.Item
                  onSelect={() => {
                    onOpenChange(false);
                    onConfirmClearData();
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm dark:text-red-400 text-red-600 hover:bg-red-500/10 rounded-xl cursor-pointer transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Purge All Local Data</span>
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
