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
    return null;
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
