import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: string | number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Connecting progress line */}
        <div className="absolute top-4 left-6 right-6 h-[2px] bg-[var(--border)] -z-0" />
        <div
          className="absolute top-4 left-6 h-[2px] bg-[#0088cc] transition-all duration-500 -z-0"
          style={{
            width: `${Math.min(100, Math.max(0, (currentStep / (steps.length - 1)) * 100))}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-ui font-semibold
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-emerald-500 text-black"
                      : isCurrent
                      ? "bg-[#0088cc] text-black ring-4 ring-[#0088cc]/20"
                      : "bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--fg-subtle)]"
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-ui font-medium tracking-tight ${
                  isCurrent ? "text-[var(--fg)]" : isCompleted ? "text-[var(--fg-muted)]" : "text-[var(--fg-subtle)]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
