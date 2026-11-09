import React from "react";
import { ShieldAlert } from "lucide-react";

export function SandboxBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-medium tracking-wide">
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>Sandbox Mode · No real funds</span>
    </div>
  );
}

