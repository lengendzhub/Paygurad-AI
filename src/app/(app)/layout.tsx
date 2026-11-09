"use client";

import React, { useState, Suspense } from "react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { CommandPalette } from "@/components/app/CommandPalette";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { usePayGuardStore } from "@/lib/store";
import { AlertTriangle } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const clearAllData = usePayGuardStore((state) => state.clearAllData);

  const handleClearConfirmed = () => {
    clearAllData();
    setClearModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col lg:flex-row">
      <Suspense fallback={<div className="w-64 shrink-0 bg-[var(--bg)] hidden lg:block" />}>
        <AppSidebar onOpenCommand={() => setCommandOpen(true)} />
      </Suspense>

      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-12">
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <Suspense fallback={<div className="p-8 text-xs text-[var(--fg-muted)]">Loading...</div>}>
            {children}
          </Suspense>
        </div>
      </main>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onConfirmClearData={() => setClearModalOpen(true)}
      />

      {/* Confirmation Dialog for Clearing Data */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear All Local Data"
        description="This will purge all local escrow bounties, activity logs, and verification records from your browser storage."
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 font-body">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>This action cannot be undone. All local records will reset to zero.</span>
          </div>
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearConfirmed}
            >
              Confirm & Purge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
