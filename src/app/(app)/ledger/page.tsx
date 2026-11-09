"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  themeQuartz,
  colorSchemeDark,
  GridApi,
  GridReadyEvent,
} from "ag-grid-community";
import {
  TableProperties,
  Search,
  Download,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Coins,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { Drawer } from "@/components/ui/Drawer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Bounty } from "@/types";

ModuleRegistry.registerModules([AllCommunityModule]);
const gridDarkTheme = themeQuartz.withPart(colorSchemeDark);

export default function LedgerPage() {
  const bounties = usePayGuardStore((state) => state.bounties);
  const gridApiRef = useRef<GridApi<Bounty> | null>(null);

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
        width: 130,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-1.5 font-mono text-blue-400 font-bold">
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
          <span className="font-medium text-white truncate">{params.value}</span>
        ),
      },
      {
        field: "amount",
        headerName: "Escrow ($ USD)",
        width: 140,
        cellRenderer: (params: any) => (
          <span className="font-mono text-emerald-400 font-bold">
            ${params.value}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Escrow Status",
        width: 170,
        cellRenderer: (params: any) => (
          <div className="pt-2">
            <StatusChip status={params.value} size="sm" />
          </div>
        ),
      },
      {
        field: "audit",
        headerName: "Gemini Score",
        width: 130,
        valueGetter: (params) => params.data?.audit?.score ?? null,
        cellRenderer: (params: any) => {
          const val = params.value;
          if (val === null || val === undefined) return <span className="text-slate-500">—</span>;
          const isPass = val >= 70;
          return (
            <span
              className={`font-mono font-bold ${
                isPass ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {val}/100
            </span>
          );
        },
      },
      {
        field: "escrowOrderId",
        headerName: "PayPal Order ID",
        flex: 1,
        minWidth: 170,
        cellRenderer: (params: any) => (
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="truncate">{params.value}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyText(params.value);
              }}
              className="text-slate-500 hover:text-white"
              title="Copy Order ID"
            >
              {copiedId === params.value ? (
                <Check className="w-3 h-3 text-emerald-400" />
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
          if (!val) return <span className="text-slate-500 font-mono text-xs">—</span>;
          return (
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <span className="truncate">{val}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyText(val);
                }}
                className="text-slate-500 hover:text-white"
                title="Copy Batch ID"
              >
                {copiedId === val ? (
                  <Check className="w-3 h-3 text-emerald-400" />
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
        width: 150,
        cellRenderer: (params: any) => (
          <span className="text-xs text-slate-400 font-mono">
            {new Date(params.value).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
    ],
    [copiedId]
  );

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Immutable Escrow Ledger</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Live Settlement Ledger
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time audit log tracking PayPal Orders v2 escrow locks, Gemini verification scores, and PayPal Payouts v1 batch IDs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE AUDIT</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            disabled={bounties.length === 0}
            disabledReason="No ledger data to export"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick filter ledger..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "FUNDED_IN_ESCROW", "RELEASED_BY_AI", "REJECTED_NEEDS_WORK"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`
                px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer
                ${
                  statusFilter === tab
                    ? "bg-white/[0.1] text-white border border-white/[0.15]"
                    : "text-slate-400 hover:text-white"
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
          <div className="h-[520px] w-full rounded-2xl overflow-hidden border border-white/[0.08]">
            <AgGridReact
              theme={gridDarkTheme}
              rowData={filteredData}
              columnDefs={columnDefs}
              quickFilterText={searchQuery}
              onGridReady={onGridReady}
              onRowClicked={(e) => setSelectedBounty(e.data || null)}
              rowSelection={{ mode: "singleRow" }}
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
          <div className="space-y-6 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
                Task Title
              </span>
              <h4 className="text-sm font-bold text-white">{selectedBounty.title}</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Amount</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  ${selectedBounty.amount} USD
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 block">Status</span>
                <StatusChip status={selectedBounty.status} size="sm" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                PayPal Orders v2 Capture
              </span>
              <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-blue-400 break-all">
                {selectedBounty.escrowOrderId}
              </div>
            </div>

            {selectedBounty.payoutBatchId && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">
                  PayPal Payouts v1 Batch ID
                </span>
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-emerald-400 break-all">
                  {selectedBounty.payoutBatchId}
                </div>
              </div>
            )}

            {selectedBounty.audit && (
              <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400">
                    Gemini Audit Result
                  </span>
                  <span className="font-mono font-bold text-white">
                    Score: {selectedBounty.audit.score}/100
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  {selectedBounty.audit.summary}
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-2">
              <Link href={`/bounties/${selectedBounty.id}`}>
                <Button variant="secondary" size="sm" className="w-full justify-center">
                  View Full Bounty Page
                  <ExternalLink className="w-3.5 h-3.5" />
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

