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
    return null;
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
