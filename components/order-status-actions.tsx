"use client";

import { useEffect, useEffectEvent } from "react";

import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { createOrderCheckoutSession } from "@/lib/api";

export function OrderStatusActions({
  orderId,
  paymentStatus,
  paymentReturn,
}: {
  orderId: number;
  paymentStatus: string;
  paymentReturn?: string;
}) {
  const { clearCart } = useCart();
  const clearPaidCart = useEffectEvent(() => {
    clearCart();
  });

  useEffect(() => {
    if (paymentStatus === "paid" || paymentReturn === "success") {
      clearPaidCart();
    }
  }, [paymentReturn, paymentStatus]);

  if (paymentStatus === "paid") {
    return null;
  }

  if (paymentReturn === "success") {
    return (
      <div className="rounded-2xl border border-[#4d6546] bg-[#132015] px-4 py-3 text-sm leading-7 text-stone-200">
        Stripe checkout has completed on your side. We&apos;re waiting for the backend
        to finish confirming the payment, so there&apos;s no need to pay again.
      </div>
    );
  }

  return (
    <CheckoutButton
      label="Resume Checkout"
      action={async () => {
        const session = await createOrderCheckoutSession(orderId);
        return session.checkout_url;
      }}
    />
  );
}
