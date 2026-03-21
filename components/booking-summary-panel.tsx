"use client";

import Link from "next/link";

import { PerformanceOption } from "@/lib/types";
import { formatCurrency, formatDateLabel, formatDuration, formatTimeLabel } from "@/lib/format";

export function BookingSummaryPanel({
  offering,
  selectedDate,
  selectedTime,
  onNext,
}: {
  offering: PerformanceOption | null;
  selectedDate: string;
  selectedTime: string;
  onNext: () => void;
}) {
  return (
    <aside className="lg:sticky lg:top-24 rounded-[1.5rem] border border-[#31402c] bg-[linear-gradient(180deg,rgba(18,23,17,0.98),rgba(8,9,8,0.98))] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.3)] xl:p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-[#7b9a70]">
        Booking summary
      </p>
      {offering ? (
        <div className="mt-3 space-y-3">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl text-stone-100 xl:text-3xl">
              {offering.name}
            </h2>
            <p className="mt-1.5 text-sm leading-5 text-stone-400">
              {offering.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <SummaryItem label="Price" value={formatCurrency(offering.price)} />
            <SummaryItem
              label="Duration"
              value={formatDuration(offering.duration)}
            />
            <SummaryItem
              label="Date"
              value={selectedDate ? formatDateLabel(selectedDate) : "Select a date"}
            />
            <SummaryItem
              label="Time"
              value={selectedTime ? formatTimeLabel(selectedTime) : "Select a time"}
            />
            <SummaryItem label="Performer" value="Mitch" />
            <SummaryItem
              label="Location"
              value="Venue details added next step"
              className="sm:col-span-2"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={onNext}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#7b9a70] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#93b586] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
            <Link
              href="/book"
              className="inline-flex w-full items-center justify-center rounded-full border border-[#4d6546] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-300 transition hover:border-[#7b9a70] hover:text-white"
            >
              Change
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="leading-7 text-stone-400">
            Start by choosing a performance offering so the schedule can be tailored
            to the selected service.
          </p>
          <Link
            href="/book"
            className="inline-flex rounded-full border border-[#4d6546] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-100 transition hover:border-[#7b9a70] hover:text-[#dce7d5]"
          >
            Choose offering
          </Link>
        </div>
      )}
    </aside>
  );
}

function SummaryItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/20 p-3 ${className}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-1 text-sm leading-5 text-stone-200">{value}</p>
    </div>
  );
}
