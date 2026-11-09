"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import {
  TableProperties,
  Search,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bounty } from "@/types";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function LedgerPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  const bounties = usePayGuardStore((state) => state.bounties);
  const gridApiRef = useRef<GridApi<Bounty> | null>(null);

  const gridTheme = useMemo(() => {
    if (isLight) {
      return themeQuartz.withPart(colorSchemeLight).withParams({
        accentColor: "#007aff",
        backgroundColor: "#ffffff",
        foregroundColor: "#1d1d1f",
        borderColor: "rgba(29, 29, 31, 0.08)",
        headerTextColor: "#6e6e73",
        headerBackgroundColor: "#f5f5f7",
        rowHoverColor: "rgba(0, 122, 255, 0.04)",
        selectedRowBackgroundColor: "rgba(0, 122, 255, 0.08)",
        fontFamily: "var(--font-body), Arial, sans-serif",
        headerFontFamily: "var(--font-ui), system-ui, sans-serif",
        fontSize: 13,
      });
    }
    return themeQuartz.withPart(colorSchemeDark).withParams({
      accentColor: "#007aff",
      backgroundColor: "#000000",
      foregroundColor: "#f5f5f7",
      borderColor: "rgba(245, 245, 247, 0.12)",
      headerTextColor: "#aaaaaa",
      headerBackgroundColor: "#1d1d1f",
      rowHoverColor: "rgba(245, 245, 247, 0.05)",
      selectedRowBackgroundColor: "rgba(0, 122, 255, 0.14)",
      fontFamily: "var(--font-body), Arial, sans-serif",
      headerFontFamily: "var(--font-ui), system-ui, sans-serif",
      fontSize: 13,
    });
  }, [isLight]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const onGridReady = useCallback((params: GridReadyEvent<Bounty>) => {
    gridApiRef.current = params.api;
  }, []);

  const handleExportCsv = () => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsCsv({
        fileName: `payguard_escrow_ledger_${Date.now()}.csv`,
      });
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredData = useMemo(() => {
    return bounties.filter((b) => {
      if (statusFilter === "ALL") return true;
      return b.status === statusFilter;
    });
  }, [bounties, statusFilter]);

  const columnDefs = useMemo<ColDef<Bounty>[]>(
    () => [
      {
        field: "id",
        headerName: "Bounty ID",
        width: 120,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-mono text-xs text-[#007aff] font-bold">
            <span>{params.value}</span>
          </div>
        ),
      },
      {
        field: "title",
        headerName: "Task Title",
        flex: 2,
        minWidth: 220,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full">
            <span className="font-ui text-xs font-medium text-[var(--fg)] truncate">{params.value}</span>
          </div>
        ),
      },
      {
        field: "amount",
        headerName: "Escrow ($ USD)",
        width: 130,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full font-mono text-xs tabular-nums text-emerald-500 font-bold">
            <span>${params.value}</span>
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Escrow Status",
        width: 160,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full">
            <StatusChip status={params.value} size="sm" />
          </div>
        ),
      },
      {
        field: "audit",
        headerName: "Gemini Score",
        width: 120,
        valueGetter: (params) => params.data?.audit?.score ?? null,
        cellRenderer: (params: any) => {
          const val = params.value;
          if (val === null || val === undefined) {
            return (
              <div className="flex items-center h-full text-[var(--fg-subtle)] font-mono text-xs">
                <span>—</span>
              </div>
            );
          }
          const isPass = val >= 70;
          return (
            <div className="flex items-center h-full">
              <span
                className={`font-mono text-xs tabular-nums font-bold ${
                  isPass ? "text-emerald-500" : "text-rose-400"
                }`}
              >
                {val}/100
              </span>
            </div>
          );
        },
      },
      {
        field: "escrowOrderId",
        headerName: "PayPal Order ID",
        flex: 1,
        minWidth: 170,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2 h-full font-mono text-xs text-[var(--fg-muted)]">
            <span className="truncate">{params.value}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyText(params.value);
              }}
              className="p-1 rounded hover:bg-[var(--surface-strong)] text-[var(--fg-subtle)] hover:text-[var(--fg)] transition cursor-pointer shrink-0"
              title="Copy Order ID"
            >
              {copiedId === params.value ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        ),
      },
      {
        field: "payoutBatchId",
        headerName: "PayPal Payout Batch ID",
        flex: 1,
        minWidth: 180,
        cellRenderer: (params: any) => {
          const val = params.value;
          if (!val) {
            return (
              <div className="flex items-center h-full text-[var(--fg-subtle)] font-mono text-xs">
                <span>—</span>
              </div>
            );
          }
          return (
            <div className="flex items-center gap-2 h-full font-mono text-xs text-emerald-500">
              <span className="truncate">{val}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyText(val);
                }}
                className="p-1 rounded hover:bg-[var(--surface-strong)] text-[var(--fg-subtle)] hover:text-[var(--fg)] transition cursor-pointer shrink-0"
                title="Copy Batch ID"
              >
                {copiedId === val ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Timestamp",
        width: 140,
        cellRenderer: (params: any) => (
          <div className="flex items-center h-full text-xs text-[var(--fg-muted)] font-mono">
            <span>
              {new Date(params.value).toLocaleDateString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <div className="space-y-6 py-4 font-ui">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#007AFF] uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 dark:text-emerald-400 text-emerald-600" />
            <span>Immutable Escrow Ledger</span>
          </div>
          <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
            Live Settlement Ledger
          </h1>
          <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
            Real-time audit log tracking PayPal Orders v2 escrow locks, Gemini verification scores, and PayPal Payouts v1 batch IDs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            disabled={bounties.length === 0}
            disabledReason="No ledger data to export"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[var(--fg-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick filter ledger..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-xs font-body text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[#007AFF]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "FUNDED_IN_ESCROW", "RELEASED_BY_AI", "REJECTED_NEEDS_WORK"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`
                px-3 py-1 rounded-xl text-xs font-ui font-medium whitespace-nowrap transition cursor-pointer
                ${
                  statusFilter === tab
                    ? "bg-[var(--surface-strong)] text-[var(--fg)] border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }
              `}
            >
              {tab === "ALL" ? "All Records" : tab.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* AG Grid Table Container */}
      <GlassCard className="p-4 sm:p-6 space-y-4">
        {bounties.length === 0 ? (
          <EmptyState
            icon={TableProperties}
            title="No ledger records yet"
            description="The live ledger records transactions when you fund an escrow bounty or run an AI verification audit."
            actionLabel="Create First Bounty"
            actionHref="/bounties/new"
          />
        ) : (
          <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-strong)]">
            <AgGridReact
              theme={gridTheme}
              rowData={filteredData}
              columnDefs={columnDefs}
              quickFilterText={searchQuery}
              onGridReady={onGridReady}
              onRowClicked={(e) => setSelectedBounty(e.data || null)}
              rowSelection={{ mode: "singleRow", checkboxes: false, enableClickSelection: true }}
              domLayout="autoHeight"
              rowHeight={48}
              headerHeight={40}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50]}
            />
          </div>
        )}
      </GlassCard>

      {/* Right Drawer for Selected Row Detail */}
      <Drawer
        isOpen={selectedBounty !== null}
        onClose={() => setSelectedBounty(null)}
        title={selectedBounty?.id || "Bounty Audit"}
        subtitle="Full transaction and verification report"
      >
        {selectedBounty && (
          <div className="space-y-6 text-xs font-body">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--fg-subtle)]">
                Task Title
              </span>
              <h4 className="font-ui text-sm font-bold text-[var(--fg)]">{selectedBounty.title}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)]">
              <div>
                <span className="text-[10px] uppercase text-[var(--fg-subtle)] block">Amount</span>
                <span className="text-base font-bold font-mono tabular-nums dark:text-emerald-400 text-emerald-600">
                  ${selectedBounty.amount} USD
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[var(--fg-subtle)] block">Status</span>
                <StatusChip status={selectedBounty.status} size="sm" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--fg-subtle)] block">
                PayPal Orders v2 Capture
              </span>
              <div className="p-3 rounded-xl dark:bg-black/60 bg-black/5 border border-[var(--border)] font-mono text-[#007AFF] break-all">
                {selectedBounty.escrowOrderId}
              </div>
            </div>

            {selectedBounty.payoutBatchId && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--fg-subtle)] block">
                  PayPal Payouts v1 Batch ID
                </span>
                <div className="p-3 rounded-xl dark:bg-black/60 bg-black/5 border border-[var(--border)] font-mono dark:text-emerald-400 text-emerald-600 break-all">
                  {selectedBounty.payoutBatchId}
                </div>
              </div>
            )}

            {selectedBounty.audit && (
              <div className="space-y-3 p-4 rounded-2xl bg-[var(--surface-strong)] border border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#007AFF]">
                    Gemini Audit Result
                  </span>
                  <span className="font-body tabular-nums font-bold text-[var(--fg)]">
                    Score: {selectedBounty.audit.score}/100
                  </span>
                </div>
                <p className="text-[var(--fg-muted)] leading-relaxed font-body">
                  {selectedBounty.audit.summary}
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-2 font-ui">
              <Link href={`/bounties/${selectedBounty.id}`}>
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  View Full Bounty Page
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
              {selectedBounty.audit && (
                <Link href={`/verification/${selectedBounty.id}`}>
                  <Button variant="ghost" size="sm" className="w-full justify-center">
                    Open Signature Verification View
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
