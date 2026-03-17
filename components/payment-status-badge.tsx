import { cn } from "@/lib/utils";

export function PaymentStatusBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "success" | "warning" | "danger" | "default";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
        tone === "success" && "border-[#4d6546] bg-[#182017] text-[#dce7d5]",
        tone === "warning" && "border-[#6d5d2a] bg-[#211c0f] text-[#f2df9f]",
        tone === "danger" && "border-[#7a3f3f] bg-[#241212] text-rose-200",
        tone === "default" && "border-white/10 bg-white/5 text-stone-300",
      )}
    >
      {label}
    </span>
  );
}
