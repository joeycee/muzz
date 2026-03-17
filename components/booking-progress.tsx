import Link from "next/link";

import { cn } from "@/lib/utils";

const steps = [
  { href: "/book/form", label: "Schedule", number: "01" },
  { href: "/book/details", label: "Details", number: "02" },
  { href: "/book/review", label: "Review", number: "03" },
];

export function BookingProgress({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <nav className="rounded-[1.5rem] border border-white/10 bg-[#0d0f0c] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
      <div className="grid gap-2 md:grid-cols-3">
        {steps.map((step, index) => {
          const stepNumber = (index + 1) as 1 | 2 | 3;
          const isCurrent = stepNumber === currentStep;
          const isComplete = stepNumber < currentStep;

          return (
            <Link
              key={step.href}
              href={step.href}
              className={cn(
                "flex items-center gap-3 rounded-[1.1rem] border px-4 py-3 transition",
                isCurrent
                  ? "border-[#7b9a70] bg-[#141d13]"
                  : "border-white/6 bg-white/[0.02] hover:border-[#42533d]",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold tracking-[0.18em]",
                  isCurrent && "border-[#7b9a70] text-[#dce7d5]",
                  isComplete && "border-[#50664b] text-[#b8c9ae]",
                  !isCurrent && !isComplete && "border-white/10 text-stone-400",
                )}
              >
                {step.number}
              </span>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.24em] text-stone-500">
                  Step
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isCurrent ? "text-stone-100" : "text-stone-300",
                  )}
                >
                  {step.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
