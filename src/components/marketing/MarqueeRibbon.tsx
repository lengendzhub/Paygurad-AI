"use client";

import React from "react";
import { ScrollVelocity } from "@/components/reactbits/ScrollVelocity";

export function MarqueeRibbon() {
  const texts = [
    "Lock · Submit · Audit · Payout · Ledger",
    "Orders v2 · Gemini · Payouts v1",
  ];

  return (
    <section aria-hidden="true" className="w-full relative overflow-hidden bg-[var(--bg)]">
      <ScrollVelocity
        texts={texts}
        velocity={55}
        gap={40}
        skewWithVelocity={8}
        scaleWithVelocity={0.08}
        outlineAlternate={true}
        fadeEdges={true}
        pauseOnHover={true}
        fontSize="clamp(44px, 8vw, 110px)"
        fontWeight={500}
        color="var(--fg)"
      />
    </section>
  );
}

