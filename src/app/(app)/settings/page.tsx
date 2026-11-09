"use client";

import React, { useState } from "react";
import {
  Key,
  BookOpen,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const clearAllData = usePayGuardStore((state) => state.clearAllData);
  const bountiesCount = usePayGuardStore((state) => state.bounties.length);
  const activityCount = usePayGuardStore((state) => state.activity.length);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClear = () => {
    clearAllData();
    setConfirmModalOpen(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  const glossary = [
    {
      term: "Escrow (Non-Custodial)",
      definition:
        "Funds authorized and locked in PayPal's infrastructure via PayPal Orders v2. The client cannot unilaterally cancel while an audit is active, and the freelancer cannot withdraw until Gemini certifies the deliverable.",
    },
    {
      term: "PayPal Orders API v2 (Capture)",
      definition:
        "The standard checkout rail used by the client to approve escrow funding in sandbox. A capture locks the funds into the merchant's sandbox escrow buffer.",
    },
    {
      term: "PayPal Payouts API v1",
      definition:
        "The server-side disbursement rail. Programmatically moves money from the merchant's sandbox balance to the freelancer's PayPal email in a single batch call.",
    },
    {
      term: "Structured ResponseSchema",
      definition:
        "A Gemini API configuration enforcing strict JSON output typed to Type.OBJECT with mandatory boolean pass/fail properties and integer quality scores.",
    },
    {
      term: "Criteria Checklist",
      definition:
        "The itemized acceptance criteria defined by the client during bounty setup. Every item is verified independently by Gemini Flash with specific pass/fail reasons.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 font-ui">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
          Settings
        </h1>
        <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
          Theme preferences, sandbox API configuration status, protocol reference glossary, and local data management.
        </p>
      </div>

      {clearedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
          <span>All local browser data has been purged successfully. Store is now empty.</span>
        </div>
      )}

      {/* Theme Preference */}
      <GlassCard className="p-6 space-y-4">
        <div>
          <h2 className="font-display text-2xl text-[var(--fg)]">Appearance & Theme</h2>
          <p className="font-body text-xs text-[var(--fg-muted)]">Select active interface theme mode</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setTheme("dark")}
            className={`
              flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-ui font-semibold transition cursor-pointer border
              ${
                resolvedTheme === "dark"
                  ? "bg-[#007AFF] text-black border-[#007AFF]"
                  : "bg-[var(--surface)] text-[var(--fg-muted)] border-[var(--border)] hover:bg-[var(--surface-strong)] hover:text-[var(--fg)]"
              }
            `}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Mode (Default)</span>
          </button>

          <button
            onClick={() => setTheme("light")}
            className={`
              flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-ui font-semibold transition cursor-pointer border
              ${
                resolvedTheme === "light"
                  ? "bg-[#007AFF] text-black border-[#007AFF]"
                  : "bg-[var(--surface)] text-[var(--fg-muted)] border-[var(--border)] hover:bg-[var(--surface-strong)] hover:text-[var(--fg)]"
              }
            `}
          >
            <Sun className="w-4 h-4" />
            <span>Light Mode</span>
          </button>
        </div>
      </GlassCard>

      {/* 1. Sandbox Credential Status (Never expose raw secrets) */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 border border-[#007AFF]/20 flex items-center justify-center text-[#007AFF]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-[var(--fg)]">Sandbox API Status</h2>
            <p className="font-body text-xs text-[var(--fg-muted)]">Environment connectivity across PayPal and Google AI Studio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-muted)]">PayPal Client ID</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[var(--fg)] font-bold truncate">Configured in .env.local</div>
            <div className="text-[10px] text-[var(--fg-subtle)]">Public Client ID active</div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-muted)]">PayPal Secret</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[var(--fg)] font-bold truncate">Hidden Server-Side</div>
            <div className="text-[10px] text-[var(--fg-subtle)]">Protected in backend routes</div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[var(--fg-muted)]">Gemini Flash API</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[var(--fg)] font-bold truncate">Active &amp; Verified</div>
            <div className="text-[10px] text-[var(--fg-subtle)]">Free Tier quota available</div>
          </div>
        </div>
      </GlassCard>

      {/* 2. Protocol Glossary */}
      <GlassCard className="p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#007AFF]/10 border border-[#007AFF]/20 flex items-center justify-center text-[#007AFF]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-[var(--fg)]">Protocol Glossary</h2>
            <p className="font-body text-xs text-[var(--fg-muted)]">Plain-language explanations of technical escrow and API concepts</p>
          </div>
        </div>

        <div className="space-y-3 font-body">
          {glossary.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)] space-y-1 text-xs"
            >
              <span className="font-ui font-semibold text-[var(--fg)]">{g.term}</span>
              <p className="text-[var(--fg-muted)] leading-relaxed">{g.definition}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 3. Data Management: Clear Local Data */}
      <GlassCard className="p-6 space-y-4 border-red-500/25 bg-red-500/[0.03]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center dark:text-red-400 text-red-600">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl dark:text-red-400 text-red-600">Local Data Storage</h2>
            <p className="font-body text-xs text-[var(--fg-muted)]">
              Manage persisted browser state ({bountiesCount} bounties, {activityCount} events stored)
            </p>
          </div>
        </div>

        <p className="font-body text-xs text-[var(--fg-muted)] leading-relaxed">
          PayGuard stores created bounties and audit records inside your browser’s localStorage. Purging will reset the app completely to its initial zero-data state.
        </p>

        <div className="pt-2">
          <Button
            variant="danger"
            size="md"
            onClick={() => setConfirmModalOpen(true)}
            disabled={bountiesCount === 0 && activityCount === 0}
            disabledReason="Store is already empty"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear All Local Data
          </Button>
        </div>
      </GlassCard>

      {/* Confirmation Dialog */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Local Data Purge"
        description="Are you sure you want to permanently erase all locally stored bounties and verification logs?"
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2 font-body">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 dark:text-red-400 text-red-700 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 dark:text-red-400 text-red-600" />
            <span>All {bountiesCount} bounties and ledger entries will be permanently removed.</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 font-ui">
            <Button variant="secondary" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClear}>
              Confirm Purge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
