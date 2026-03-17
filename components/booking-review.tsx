"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import {
  createBooking,
  createBookingCheckoutSession,
  getApiErrorMessage,
} from "@/lib/api";
import {
  clearStoredBookingDraft,
  EMPTY_BOOKING_DRAFT,
  getStoredBookingDraftSnapshot,
  subscribeToStoredBookingDraft,
} from "@/lib/booking-storage";
import { formatCurrency, formatDateLabel, formatDuration, formatTimeLabel } from "@/lib/format";
import { PerformanceOption } from "@/lib/types";

export function BookingReview({ offerings }: { offerings: PerformanceOption[] }) {
  const bookingDraft = useSyncExternalStore(
    subscribeToStoredBookingDraft,
    getStoredBookingDraftSnapshot,
    () => EMPTY_BOOKING_DRAFT,
  );
  const isHydrated = useHydrated();
  const activeDraft = isHydrated ? bookingDraft : EMPTY_BOOKING_DRAFT;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedOffering = useMemo(
    () => offerings.find((offering) => offering.id === activeDraft.offeringId) ?? null,
    [activeDraft.offeringId, offerings],
  );

  const isReady =
    !!selectedOffering &&
    !!activeDraft.eventDate &&
    !!activeDraft.eventTime &&
    !!activeDraft.customerName &&
    !!activeDraft.email &&
    !!activeDraft.phone &&
    !!activeDraft.venue;

  async function handleCheckout() {
    if (!selectedOffering || !isReady) {
      setError("Please complete the previous steps before continuing to checkout.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const booking = await createBooking({
        customer_name: activeDraft.customerName,
        email: activeDraft.email,
        phone: activeDraft.phone,
        event_date: activeDraft.eventDate,
        event_time: activeDraft.eventTime,
        venue: activeDraft.venue,
        location: activeDraft.location,
        performance_option_id: selectedOffering.id,
        notes: activeDraft.notes,
      });
      clearStoredBookingDraft();
      const session = await createBookingCheckoutSession(booking.id);
      window.location.assign(session.checkout_url);
    } catch (checkoutError) {
      setError(getApiErrorMessage(checkoutError));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
      <section className="rounded-[1.65rem] border border-white/10 bg-[#101010] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
        <div className="grid gap-4 md:grid-cols-2">
          <ReviewCard
            title="Performance"
            items={[
              ["Offering", selectedOffering?.name || "Not selected"],
              ["Date", activeDraft.eventDate ? formatDateLabel(activeDraft.eventDate) : "Not selected"],
              ["Time", activeDraft.eventTime ? formatTimeLabel(activeDraft.eventTime) : "Not selected"],
              ["Duration", selectedOffering ? formatDuration(selectedOffering.duration) : "Not selected"],
            ]}
          />
          <ReviewCard
            title="Client details"
            items={[
              ["Name", activeDraft.customerName || "Not provided"],
              ["Email", activeDraft.email || "Not provided"],
              ["Phone", activeDraft.phone || "Not provided"],
              ["Venue", activeDraft.venue || "Not provided"],
              ["Location", activeDraft.location || "Not provided"],
            ]}
          />
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-[#31402c] bg-[#111611] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#7b9a70]">
            Deposit terms
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <TermItem title="Deposit due now" value={selectedOffering ? formatCurrency(Number(selectedOffering.price) * 0.6) : "--"} />
            <TermItem title="Refund policy" value="Refundable up to 1 month before the event, minus service fees" />
            <TermItem title="Remaining balance" value="Due on completion of the performance" />
          </div>
        </div>

        {activeDraft.notes ? (
          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Notes</p>
            <p className="mt-2 text-sm leading-7 text-stone-200">{activeDraft.notes}</p>
          </div>
        ) : null}
      </section>

      <aside className="xl:sticky xl:top-24 h-fit rounded-[1.65rem] border border-[#31402c] bg-[linear-gradient(180deg,rgba(18,23,17,0.98),rgba(8,9,8,0.98))] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.3)]">
        <p className="text-xs uppercase tracking-[0.24em] text-[#7b9a70]">Ready to book</p>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl text-stone-100">
          Review complete
        </h2>
        <p className="mt-3 text-sm leading-7 text-stone-400">
          Once you continue, the booking will be created and you’ll be redirected to
          Stripe to pay the deposit.
        </p>

        <div className="mt-5 space-y-3 rounded-[1.2rem] border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-sm text-stone-300">
            <span>Total performance fee</span>
            <span>{selectedOffering ? formatCurrency(selectedOffering.price) : "--"}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-stone-100">
            <span>Deposit due now</span>
            <span>{selectedOffering ? formatCurrency(Number(selectedOffering.price) * 0.6) : "--"}</span>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-[#7a3f3f] bg-[#241212] px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            disabled={!isReady || isSubmitting}
            onClick={handleCheckout}
            className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Redirecting to Stripe..." : "Continue to Checkout"}
          </button>
          <div className="flex gap-3 text-sm uppercase tracking-[0.18em] text-stone-400">
            <Link href="/book/details" className="hover:text-white">
              Edit details
            </Link>
            <Link href="/book/form" className="hover:text-white">
              Edit schedule
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

function ReviewCard({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{title}</p>
      <div className="mt-3 space-y-3">
        {items.map(([label, value]) => (
          <div key={label} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-stone-500">{label}</span>
            <span className="max-w-[60%] text-right text-stone-200">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TermItem({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-stone-200">{value}</p>
    </div>
  );
}

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
