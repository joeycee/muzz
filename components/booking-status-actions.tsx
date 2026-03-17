"use client";

import { CheckoutButton } from "@/components/checkout-button";
import { createBookingCheckoutSession } from "@/lib/api";

export function BookingStatusActions({
  bookingId,
  paymentStatus,
  paymentReturn,
}: {
  bookingId: number;
  paymentStatus: string;
  paymentReturn?: string;
}) {
  if (paymentStatus === "paid" || paymentStatus === "partially_paid") {
    return null;
  }

  if (paymentReturn === "success") {
    return (
      <div className="rounded-2xl border border-[#4d6546] bg-[#132015] px-4 py-3 text-sm leading-7 text-stone-200">
        Stripe checkout has completed on your side. We’re waiting for the backend to
        finish confirming the payment, so there’s no need to pay again.
      </div>
    );
  }

  return (
    <CheckoutButton
      label="Pay Deposit Now"
      action={async () => {
        const session = await createBookingCheckoutSession(bookingId);
        return session.checkout_url;
      }}
    />
  );
}
