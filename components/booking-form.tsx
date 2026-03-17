"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  EMPTY_BOOKING_DRAFT,
  type BookingDraft,
  getStoredBookingDraftSnapshot,
  setStoredBookingDraft,
  subscribeToStoredBookingDraft,
} from "@/lib/booking-storage";
import { formatDateLabel, formatDuration, formatTimeLabel } from "@/lib/format";
import { PerformanceOption } from "@/lib/types";

type BookingFormState = {
  customer_name: string;
  email: string;
  phone: string;
  event_date: string;
  event_time: string;
  venue: string;
  location: string;
  performance_option_id: string;
  notes: string;
};

export function BookingForm({
  offerings,
}: {
  offerings: PerformanceOption[];
}) {
  const bookingDraft = useSyncExternalStore(
    subscribeToStoredBookingDraft,
    getStoredBookingDraftSnapshot,
    () => EMPTY_BOOKING_DRAFT,
  );
  const isHydrated = useHydrated();
  const activeDraft = isHydrated ? bookingDraft : EMPTY_BOOKING_DRAFT;

  return (
    <BookingFormInner
      key={isHydrated ? "hydrated" : "ssr"}
      offerings={offerings}
      initialDraft={activeDraft}
    />
  );
}

function BookingFormInner({
  offerings,
  initialDraft,
}: {
  offerings: PerformanceOption[];
  initialDraft: BookingDraft;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BookingFormState>({
    customer_name: initialDraft.customerName,
    email: initialDraft.email,
    phone: initialDraft.phone,
    event_date: initialDraft.eventDate,
    event_time: initialDraft.eventTime,
    venue: initialDraft.venue,
    location: initialDraft.location,
    performance_option_id: initialDraft.offeringId ? String(initialDraft.offeringId) : "",
    notes: initialDraft.notes,
  });

  const selectedOffering = useMemo(
    () =>
      offerings.find((offering) => offering.id === Number(form.performance_option_id)) ?? null,
    [form.performance_option_id, offerings],
  );

  function updateField<K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleContinue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStoredBookingDraft({
      offeringId: selectedOffering?.id ?? null,
      offeringName: selectedOffering?.name ?? "",
      eventDate: form.event_date,
      eventTime: form.event_time,
      customerName: form.customer_name,
      email: form.email,
      phone: form.phone,
      venue: form.venue,
      location: form.location,
      notes: form.notes,
    });

    router.push("/book/review");
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.72fr]">
      <form
        onSubmit={handleContinue}
        className="rounded-[1.65rem] border border-white/10 bg-[#101010] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)]"
      >
        <div className="mb-5 rounded-[1.2rem] border border-[#31402c] bg-[#131812] px-4 py-3 text-sm text-stone-300">
          Finalize the contact and venue details for{" "}
          <span className="text-stone-100">{initialDraft.offeringName || "your session"}</span>
          {form.event_date ? ` on ${formatDateLabel(form.event_date)}` : ""}
          {form.event_time ? ` at ${formatTimeLabel(form.event_time)}` : ""}.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" htmlFor="customer_name" input={<input id="customer_name" required value={form.customer_name} onChange={(event) => updateField("customer_name", event.target.value)} className={inputClassName} />} />
          <Field label="Email" htmlFor="email" input={<input id="email" type="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} className={inputClassName} />} />
          <Field label="Phone" htmlFor="phone" input={<input id="phone" required value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className={inputClassName} />} />
          <Field
            label="Performance option"
            htmlFor="performance_option_id"
            input={
              <select
                id="performance_option_id"
                required
                value={form.performance_option_id}
                onChange={(event) => updateField("performance_option_id", event.target.value)}
                className={inputClassName}
              >
                <option value="">Select an offering</option>
                {offerings.map((offering) => (
                  <option key={offering.id} value={offering.id}>
                    {offering.name}
                  </option>
                ))}
              </select>
            }
          />
          <Field label="Event date" htmlFor="event_date" input={<input id="event_date" type="date" required value={form.event_date} onChange={(event) => updateField("event_date", event.target.value)} className={inputClassName} />} />
          <Field label="Event time" htmlFor="event_time" input={<input id="event_time" type="time" required value={form.event_time} onChange={(event) => updateField("event_time", event.target.value)} className={inputClassName} />} />
          <Field label="Venue" htmlFor="venue" input={<input id="venue" required value={form.venue} onChange={(event) => updateField("venue", event.target.value)} className={inputClassName} />} />
          <Field label="Location" htmlFor="location" input={<input id="location" value={form.location} onChange={(event) => updateField("location", event.target.value)} className={inputClassName} />} />
          <div className="md:col-span-2">
            <Field
              label="Notes"
              htmlFor="notes"
              input={
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className={inputClassName}
                />
              }
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="max-w-md text-sm leading-6 text-stone-400">
            This step saves your details and moves you to a final review before checkout.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586]"
          >
            Continue to Review
          </button>
        </div>
      </form>

      <aside className="xl:sticky xl:top-24 h-fit rounded-[1.65rem] border border-[#31402c] bg-[linear-gradient(180deg,rgba(18,23,17,0.98),rgba(8,9,8,0.98))] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[#7b9a70]">Booking summary</p>
        {selectedOffering ? (
          <div className="mt-4 space-y-4">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
                {selectedOffering.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-400">
                {selectedOffering.description}
              </p>
            </div>
            <SummaryItem label="Date" value={form.event_date ? formatDateLabel(form.event_date) : "Choose schedule"} />
            <SummaryItem label="Time" value={form.event_time ? formatTimeLabel(form.event_time) : "Choose schedule"} />
            <SummaryItem label="Duration" value={formatDuration(selectedOffering.duration)} />
            <SummaryItem label="Venue" value={form.venue || "Add in this step"} />
            <div className="flex gap-3 text-sm uppercase tracking-[0.18em] text-stone-400">
              <Link href="/book/form" className="hover:text-white">
                Edit schedule
              </Link>
              <Link href="/book" className="hover:text-white">
                Change offering
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm leading-6 text-stone-400">
              Return to the scheduling step to select an offering, date, and time.
            </p>
            <Link
              href="/book/form"
              className="inline-flex rounded-full border border-[#4d6546] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-stone-100 transition hover:border-[#7b9a70] hover:text-[#dce7d5]"
            >
              Back to schedule
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  input,
}: {
  label: string;
  htmlFor: string;
  input: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="space-y-1.5 text-sm text-stone-300">
      <span className="block text-[0.68rem] uppercase tracking-[0.2em] text-stone-500">{label}</span>
      {input}
    </label>
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

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-[#7b9a70]";

function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
}

function subscribeHydration() {
  return () => {};
}
