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
    <aside className="xl:sticky xl:top-24 rounded-[1.5rem] border border-[#31402c] bg-[linear-gradient(180deg,rgba(18,23,17,0.98),rgba(8,9,8,0.98))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
      <p className="text-xs uppercase tracking-[0.28em] text-[#7b9a70]">
        Booking summary
      </p>
      {offering ? (
        <div className="mt-4 space-y-4">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
              {offering.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              {offering.description}
            </p>
          </div>

          <SummaryItem label="Price" value={formatCurrency(offering.price)} />
          <SummaryItem
            label="Chosen date"
            value={selectedDate ? formatDateLabel(selectedDate) : "Select a date"}
          />
          <SummaryItem
            label="Chosen time"
            value={selectedTime ? formatTimeLabel(selectedTime) : "Select a time"}
          />
          <SummaryItem
            label="Location"
            value="Venue details are confirmed in the next step"
          />
          <SummaryItem label="Performer" value="Muzz" />
          <SummaryItem
            label="Duration"
            value={formatDuration(offering.duration)}
          />

          <button
            type="button"
            disabled={!selectedDate || !selectedTime}
            onClick={onNext}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:bg-[#93b586] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
          <Link
            href="/book"
            className="inline-flex text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-white"
          >
            Change offering
          </Link>
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-1.5 text-sm leading-6 text-stone-200">{value}</p>
    </div>
  );
}
