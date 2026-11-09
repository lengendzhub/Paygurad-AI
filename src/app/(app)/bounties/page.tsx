"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Coins,
  PlusCircle,
  Search,
  ArrowRight,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { usePayGuardStore } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";

export default function BountiesListPage() {
  const userRole = usePayGuardStore((state) => state.userRole);
  const bounties = usePayGuardStore((state) => state.bounties);
  const fetchBountiesFromServer = usePayGuardStore((state) => state.fetchBountiesFromServer);

  useEffect(() => {
    fetchBountiesFromServer();
  }, [fetchBountiesFromServer]);

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
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl font-normal tracking-tight text-[var(--fg)]">
              {userRole === "freelancer" ? "Available Bounties" : "Escrow Bounties"}
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                userRole === "freelancer"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-[#007aff]/15 text-[#007aff] border border-[#007aff]/30"
              }`}
            >
              {userRole === "freelancer" ? "Freelancer Portal" : "Client Portal"}
            </span>
          </div>
          <p className="font-body text-sm text-[var(--fg-muted)] mt-1">
            {userRole === "freelancer"
              ? "Browse bounties with guaranteed escrow locked in PayPal Orders v2 buffer. Submit deliverables to claim automated payouts."
              : "Browse and manage all authorized micro-bounties and deliverables."}
          </p>
        </div>

        {userRole === "client" ? (
          <Link href="/bounties/new">
            <Button variant="primary" size="md">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Create Bounty
            </Button>
          </Link>
        ) : (
          <Link href="/login?role=client">
            <Button variant="secondary" size="md" className="text-xs">
              Switch to Client to Fund
            </Button>
          </Link>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2 font-ui">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--fg-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, or keyword..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-sm font-body text-[var(--fg)] placeholder-[var(--fg-subtle)] focus:outline-none focus:border-[#007AFF] transition"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-ui font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5
                ${
                  statusFilter === tab.value
                    ? "bg-[var(--surface-strong)] text-[var(--fg)] border border-[var(--border-strong)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]"
                }
              `}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-70 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)] self-end lg:self-center">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--fg-subtle)]" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] rounded-xl px-3 py-1.5 text-xs font-ui focus:outline-none focus:border-[#007AFF]"
          >
            <option value="newest" className="bg-[var(--bg)]">Newest First</option>
            <option value="amount_desc" className="bg-[var(--bg)]">Highest Reward</option>
            <option value="amount_asc" className="bg-[var(--bg)]">Lowest Reward</option>
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
            <Link
              key={bounty.id}
              href={`/bounties/${bounty.id}${userRole === "freelancer" ? "?role=freelancer" : "?role=client"}`}
            >
              <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-[var(--border-strong)] transition group space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#007AFF]">
                      {bounty.id}
                    </span>
                    <StatusChip status={bounty.status} size="sm" />
                  </div>

                  <h3 className="font-ui text-base font-semibold text-[var(--fg)] group-hover:text-[#007AFF] transition line-clamp-2">
                    {bounty.title}
                  </h3>

                  <p className="font-body text-xs text-[var(--fg-muted)] line-clamp-2 leading-relaxed">
                    {bounty.description || "No additional description provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between text-xs text-[var(--fg-muted)]">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-[#007AFF]" />
                      {bounty.requirements.length} Criteria
                    </span>
                    <span className="text-[11px] font-mono text-[var(--fg-subtle)]">
                      Order: {bounty.escrowOrderId.slice(0, 10)}...
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-lg font-bold font-mono tabular-nums dark:text-emerald-400 text-emerald-600">
                        ${bounty.amount} USD
                      </div>
                      <div className="text-[10px] text-[var(--fg-subtle)] uppercase font-mono">
                        Escrow Locked
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[var(--surface-strong)] group-hover:bg-[#007AFF] group-hover:text-black flex items-center justify-center text-[var(--fg-muted)] transition">
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
