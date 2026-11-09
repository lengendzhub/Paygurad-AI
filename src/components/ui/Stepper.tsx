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
        <div className="absolute top-4 left-6 right-6 h-[2px] bg-white/[0.08] -z-0" />
        <div
          className="absolute top-4 left-6 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 -z-0"
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
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  transition-all duration-300
                  ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-[0_0_16px_rgba(16,185,129,0.4)]"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                      : "bg-[#14141E] border border-white/[0.12] text-slate-500"
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-medium tracking-tight ${
                  isCurrent ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-500"
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

