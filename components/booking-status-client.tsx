"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useState } from "react";

import { BookingStatusActions } from "@/components/booking-status-actions";
import { PaymentProcessingPopup } from "@/components/payment-processing-popup";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import {
  getApiErrorMessage,
  getBooking,
  getBookingPaymentStatus,
  verifyBookingCheckoutSession,
} from "@/lib/api";
import { formatCurrency, formatDuration } from "@/lib/format";
import { Booking, PaymentStatusResponse } from "@/lib/types";
import { titleizeStatus } from "@/lib/utils";

export function BookingStatusClient({
  initialBooking,
  initialPaymentStatus,
  paymentReturn,
  checkoutSessionId,
}: {
  initialBooking: Booking;
  initialPaymentStatus: PaymentStatusResponse;
  paymentReturn?: string;
  checkoutSessionId?: string;
}) {
  const [booking, setBooking] = useState(initialBooking);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [statusMessage, setStatusMessage] = useState(
    paymentReturn === "success" && !isDepositConfirmed(initialPaymentStatus.payment_status)
      ? "Pending confirmation"
      : isDepositConfirmed(initialPaymentStatus.payment_status)
        ? "Deposit confirmed"
        : "",
  );
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [pollError, setPollError] = useState("");
  const isPaymentConfirmed = isDepositConfirmed(paymentStatus.payment_status);

  const syncBookingState = useEffectEvent(async () => {
    const nextPaymentStatus = await getBookingPaymentStatus(booking.id);
    setPaymentStatus(nextPaymentStatus);

    const nextBooking = await getBooking(booking.id);
    setBooking(nextBooking);

    if (isDepositConfirmed(nextPaymentStatus.payment_status)) {
      setStatusMessage("Deposit confirmed");
      setVerificationMessage("");
      return true;
    }

    setStatusMessage("Pending confirmation");
    return false;
  });

  useEffect(() => {
    if (
      paymentReturn !== "success" ||
      !checkoutSessionId ||
      isDepositConfirmed(paymentStatus.payment_status)
    ) {
      return;
    }

    let isCancelled = false;
    const sessionId = checkoutSessionId;

    async function verify() {
      try {
        setPollError("");
        setVerificationMessage("");
        setIsVerifying(true);
        await verifyBookingCheckoutSession(booking.id, sessionId);

        if (isCancelled) {
          return;
        }

        const isConfirmed = await syncBookingState();

        if (!isCancelled && !isConfirmed) {
          setVerificationMessage(
            "We’re still confirming your payment with Stripe. Please refresh in a moment if your booking details do not update immediately.",
          );
        }
      } catch {
        if (!isCancelled) {
          setVerificationMessage(
            "We’re still confirming your payment with Stripe. Please refresh in a moment if your booking details do not update immediately.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsVerifying(false);
        }
      }
    }

    verify();

    return () => {
      isCancelled = true;
    };
  }, [booking.id, checkoutSessionId, paymentReturn, paymentStatus.payment_status]);

  useEffect(() => {
    if (paymentReturn !== "success" || isDepositConfirmed(paymentStatus.payment_status)) {
      return;
    }

    let isCancelled = false;

    async function poll() {
      try {
        setPollError("");
        const isConfirmed = await syncBookingState();

        if (!isCancelled && !isConfirmed) {
          window.setTimeout(poll, 2500);
        }
      } catch (error) {
        if (!isCancelled) {
          setPollError(getApiErrorMessage(error));
          window.setTimeout(poll, 2500);
        }
      }
    }

    poll();

    return () => {
      isCancelled = true;
    };
  }, [paymentReturn, paymentStatus.payment_status]);

  return (
    <>
      <PaymentProcessingPopup
        isOpen={paymentReturn === "success"}
        isConfirmed={isPaymentConfirmed}
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6 rounded-[1.75rem] border border-white/10 bg-[#101010] p-6">
        <div className="flex flex-wrap items-center gap-3">
          <PaymentStatusBadge
            label={titleizeStatus(paymentStatus.payment_status)}
            tone={
              isDepositConfirmed(paymentStatus.payment_status)
                ? "success"
                : paymentStatus.payment_status === "failed"
                  ? "danger"
                  : "warning"
            }
          />
          <PaymentStatusBadge
            label={titleizeStatus(paymentStatus.resource_status)}
            tone={booking.booking_status === "confirmed" ? "success" : "default"}
          />
          {statusMessage ? (
            <PaymentStatusBadge
              label={statusMessage}
              tone={isDepositConfirmed(paymentStatus.payment_status) ? "success" : "warning"}
            />
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Detail label="Customer" value={booking.customer_name} />
          <Detail label="Email" value={booking.email} />
          <Detail label="Phone" value={booking.phone} />
          <Detail label="Performance option" value={booking.performance_option.name} />
          <Detail label="Event date" value={booking.event_date} />
          <Detail label="Event time" value={booking.event_time} />
          <Detail label="Venue" value={booking.venue} />
          <Detail label="Location" value={booking.location || "Not provided"} />
          <Detail
            label="Set duration"
            value={formatDuration(booking.performance_option.duration)}
          />
          <Detail label="Total price" value={formatCurrency(booking.total_price)} />
          <Detail label="Deposit amount" value={formatCurrency(booking.deposit_amount)} />
          <Detail label="Notes" value={booking.notes || "No notes submitted"} />
        </div>
        </section>

        <aside className="space-y-5 rounded-[1.75rem] border border-[#31402c] bg-[#0f110f] p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
            Payment details
          </h2>
          <Detail label="Amount due now" value={formatCurrency(paymentStatus.amount)} />
          <Detail
            label="Payment record"
            value={
              paymentStatus.latest_payment?.id
                ? `#${paymentStatus.latest_payment.id}`
                : "Not created"
            }
          />
          <Detail
            label="Receipt"
            value={paymentStatus.latest_payment?.receipt_number || "Not available yet"}
          />
          {isVerifying ? (
            <div className="rounded-2xl border border-[#4d6546] bg-[#132015] px-4 py-3 text-sm leading-6 text-stone-100">
              Verifying your deposit with Stripe...
            </div>
          ) : null}
          {verificationMessage ? (
            <div className="rounded-2xl border border-[#31402c] bg-black/20 px-4 py-3 text-sm leading-6 text-stone-300">
              {verificationMessage}
            </div>
          ) : null}
          {pollError ? (
            <div className="rounded-2xl border border-[#6d5d2a] bg-[#1b170d] px-4 py-3 text-sm text-[#f2df9f]">
              {pollError}
            </div>
          ) : null}
          <BookingStatusActions
            bookingId={booking.id}
            paymentStatus={paymentStatus.payment_status}
            paymentReturn={paymentReturn}
          />
          <Link
            href="/book"
            className="inline-flex text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-white"
          >
            Make another booking
          </Link>
        </aside>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-7 text-stone-200">{value}</p>
    </div>
  );
}

function isDepositConfirmed(paymentStatus: string) {
  return paymentStatus === "paid" || paymentStatus === "partially_paid";
}
