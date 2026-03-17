import { cn } from "@/lib/utils";

export function DigitalBadge({
  label = "Digital Download",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#50664b] bg-[#141d13] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#dce7d5]",
        className,
      )}
    >
      {label}
    </span>
  );
}
