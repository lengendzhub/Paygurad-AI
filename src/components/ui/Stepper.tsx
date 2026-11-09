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
      <div className="flex items-center w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center shrink-0 relative z-10">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-ui font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-emerald-500 text-black"
                        : isCurrent
                        ? "bg-[#007aff] text-white ring-4 ring-[#007aff]/20"
                        : "bg-[var(--surface-strong)] border border-[var(--border)] text-[var(--fg-subtle)]"
                    }
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-ui font-medium tracking-tight whitespace-nowrap ${
                    isCurrent
                      ? "text-[var(--fg)]"
                      : isCompleted
                      ? "text-[var(--fg-muted)]"
                      : "text-[var(--fg-subtle)]"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line between steps (Never rendered after the final step) */}
              {!isLast && (
                <div className="flex-1 h-[2px] bg-[var(--border)] mx-2 -translate-y-3 relative overflow-hidden">
                  <div
                    className={`h-full bg-[#007aff] transition-all duration-500 ${
                      idx < currentStep ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
