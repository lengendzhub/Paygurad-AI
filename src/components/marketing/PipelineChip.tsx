"use client";

import React from "react";
import Link from "next/link";
import { AccentText } from "./AccentText";
import { ArrowRight } from "lucide-react";

export function PipelineChip() {
  return (
    <Link
      href="/how-it-works"
      className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-ui font-medium tracking-wide bg-[var(--surface)] hover:bg-[var(--surface-strong)] border border-[var(--border)] transition-all group"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-pulse" />
      <AccentText preset="chip" showBorder={false}>
        Orders v2 → Gemini → Payouts v1
      </AccentText>
      <ArrowRight className="w-3 h-3 text-[#979797] group-hover:text-[var(--fg)] group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}

