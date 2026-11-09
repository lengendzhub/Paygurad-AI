"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Coins,
  PlusCircle,
  Search,
  Filter,
  ArrowRight,
  SlidersHorizontal,
  Calendar,
  Layers,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { BountyStatus } from "@/types";

export default function BountiesListPage() {
  const bounties = usePayGuardStore((state) => state.bounties);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "amount_desc" | "amount_asc">("newest");

  const filteredBounties = useMemo(() => {
    return bounties
      .filter((b) => {
        const matchesSearch =
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "ALL" || b.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "amount_desc") {
          return parseFloat(b.amount) - parseFloat(a.amount);
        }
        if (sortBy === "amount_asc") {
          return parseFloat(a.amount) - parseFloat(b.amount);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [bounties, searchQuery, statusFilter, sortBy]);

  const filterTabs = [
    { label: "All", value: "ALL", count: bounties.length },
    {
      label: "In Escrow",
      value: "FUNDED_IN_ESCROW",
      count: bounties.filter((b) => b.status === "FUNDED_IN_ESCROW").length,
    },
    {
      label: "Submitted",
      value: "SUBMITTED",
      count: bounties.filter((b) => b.status === "SUBMITTED").length,
    },
    {
      label: "Released",
      value: "RELEASED_BY_AI",
      count: bounties.filter((b) => b.status === "RELEASED_BY_AI").length,
    },
    {
      label: "Rejected",
      value: "REJECTED_NEEDS_WORK",
      count: bounties.filter((b) => b.status === "REJECTED_NEEDS_WORK").length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Escrow Bounties</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse and manage all authorized micro-bounties and deliverables.
          </p>
        </div>

        <Link href="/bounties/new">
          <Button variant="primary" size="md">
            <PlusCircle className="w-4 h-4" />
            Create Bounty
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, or keyword..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/40 transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5
                ${
                  statusFilter === tab.value
                    ? "bg-white/[0.1] text-white border border-white/[0.15]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }
              `}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-60 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs text-slate-400 self-end lg:self-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500/40"
          >
            <option value="newest" className="bg-[#101018]">Newest First</option>
            <option value="amount_desc" className="bg-[#101018]">Highest Reward</option>
            <option value="amount_asc" className="bg-[#101018]">Lowest Reward</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {bounties.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="No bounties yet"
          description="You haven't created any escrow bounties yet. Initialize your first bounty through the guided creation wizard."
          actionLabel="Create First Bounty"
          actionHref="/bounties/new"
        />
      ) : filteredBounties.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching bounties"
          description="No bounties matched your search query or filter criteria. Try resetting the filters."
          compact
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map((bounty) => (
            <Link key={bounty.id} href={`/bounties/${bounty.id}`}>
              <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-blue-500/30 transition group space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {bounty.id}
                    </span>
                    <StatusChip status={bounty.status} size="sm" />
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition line-clamp-2">
                    {bounty.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {bounty.description || "No additional description provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      {bounty.requirements.length} Criteria
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Order: {bounty.escrowOrderId.slice(0, 10)}...
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-lg font-bold font-mono text-emerald-400">
                        ${bounty.amount} USD
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-mono">
                        Escrow Locked
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/[0.04] group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

