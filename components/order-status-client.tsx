"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";

import { DownloadSection } from "@/components/download-section";
import { OrderStatusActions } from "@/components/order-status-actions";
import { PaymentProcessingPopup } from "@/components/payment-processing-popup";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import {
  getApiErrorMessage,
  getOrder,
  getOrderDownloads,
  getOrderPaymentStatus,
  verifyOrderCheckoutSession,
} from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import {
  Order,
  OrderDownloadsResponse,
  PaymentStatusResponse,
} from "@/lib/types";
import { titleizeStatus } from "@/lib/utils";

export function OrderStatusClient({
  initialOrder,
  initialPaymentStatus,
  initialDownloads,
  paymentReturn,
  checkoutSessionId,
}: {
  initialOrder: Order;
  initialPaymentStatus: PaymentStatusResponse;
  initialDownloads: OrderDownloadsResponse | null;
  paymentReturn?: string;
  checkoutSessionId?: string;
}) {
  const [order, setOrder] = useState(initialOrder);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [downloads, setDownloads] = useState<OrderDownloadsResponse | null>(
    initialDownloads,
  );
  const [statusMessage, setStatusMessage] = useState(
    paymentReturn === "success" && initialPaymentStatus.payment_status !== "paid"
      ? "Pending confirmation"
      : initialPaymentStatus.payment_status === "paid"
        ? "Payment confirmed"
        : "",
  );
  const [verificationMessage, setVerificationMessage] = useState("");
  const [pollError, setPollError] = useState("");

  const syncOrderState = useEffectEvent(async () => {
    const nextPaymentStatus = await getOrderPaymentStatus(order.id);
    setPaymentStatus(nextPaymentStatus);

    const nextOrder = await getOrder(order.id);
    setOrder(nextOrder);

    if (nextPaymentStatus.payment_status === "paid") {
      setStatusMessage("Payment confirmed");
      setVerificationMessage("");

      if (nextOrder.has_downloadable_items && nextOrder.download_access_granted) {
        const nextDownloads = await getOrderDownloads(
          nextOrder.id,
          nextOrder.download_token,
        );
        setDownloads(nextDownloads);
      } else {
        setDownloads(null);
      }

      return true;
    }

    setDownloads(null);
    setStatusMessage("Pending confirmation");
    return false;
  });

  useEffect(() => {
    if (
      paymentReturn !== "success" ||
      !checkoutSessionId ||
      paymentStatus.payment_status === "paid"
    ) {
      return;
    }

    let isCancelled = false;
    const sessionId = checkoutSessionId;

    async function verify() {
      try {
        setPollError("");
        setVerificationMessage("");
        await verifyOrderCheckoutSession(order.id, sessionId);

        if (isCancelled) {
          return;
        }

        const isPaid = await syncOrderState();

        if (!isCancelled && !isPaid) {
          setVerificationMessage(
            "We’re still confirming your payment with Stripe. Please refresh in a moment if your order details do not update immediately.",
          );
        }
      } catch {
        if (!isCancelled) {
          setVerificationMessage(
            "We’re still confirming your payment with Stripe. Please refresh in a moment if your order details do not update immediately.",
          );
        }
      }
    }

    verify();

    return () => {
      isCancelled = true;
    };
  }, [checkoutSessionId, order.id, paymentReturn, paymentStatus.payment_status]);

  useEffect(() => {
    if (paymentReturn !== "success" || paymentStatus.payment_status === "paid") {
      return;
    }

    let isCancelled = false;

    async function poll() {
      try {
        setPollError("");
        const isPaid = await syncOrderState();

        if (!isCancelled && !isPaid) {
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

  const showPreparingDownloads =
    paymentReturn === "success" &&
    order.has_downloadable_items &&
    paymentStatus.payment_status !== "paid";
  const isPaymentConfirmed = paymentStatus.payment_status === "paid";

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
              paymentStatus.payment_status === "paid"
                ? "success"
                : paymentStatus.payment_status === "failed"
                  ? "danger"
                  : "warning"
            }
          />
          <PaymentStatusBadge label={titleizeStatus(paymentStatus.resource_status)} />
          {statusMessage ? (
            <PaymentStatusBadge
              label={statusMessage}
              tone={paymentStatus.payment_status === "paid" ? "success" : "warning"}
            />
          ) : null}
        </div>

        <div className="grid gap-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div>
                <p className="text-lg text-stone-100">{item.product.name}</p>
                <p className="text-sm text-stone-400">Qty {item.quantity}</p>
                {item.size ? (
                  <p className="text-sm text-stone-400">Size {item.size}</p>
                ) : null}
              </div>
              <p className="text-stone-200">{formatCurrency(item.line_total)}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Detail label="Customer" value={order.customer_name} />
          <Detail label="Email" value={order.email} />
          <Detail label="Phone" value={order.phone || "Not provided"} />
          <Detail label="Shipping address" value={order.shipping_address} />
          <Detail label="Shipping country" value={order.shipping_country} />
          <Detail label="Shipping amount" value={formatCurrency(order.shipping_amount)} />
          <Detail label="Order total" value={formatCurrency(order.total_amount)} />
          <Detail label="Notes" value={order.notes || "No notes submitted"} />
        </div>

        {downloads?.download_access_granted ? (
          <DownloadSection tracks={downloads.tracks} />
        ) : showPreparingDownloads ? (
          <div className="rounded-[1.75rem] border border-[#31402c] bg-[#0f110f] p-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[#7b9a70]">
                Your downloads
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
                Preparing your files
              </h2>
              <p className="text-sm leading-7 text-stone-300">
                We&apos;re confirming your payment now. Your download buttons will
                appear here automatically as soon as your order is marked paid.
              </p>
            </div>
          </div>
        ) : null}
        </section>

        <aside className="space-y-5 rounded-[1.75rem] border border-[#31402c] bg-[#0f110f] p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
            Payment details
          </h2>
          <Detail label="Amount due" value={formatCurrency(paymentStatus.amount)} />
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
          {pollError ? (
            <div className="rounded-2xl border border-[#6d5d2a] bg-[#1b170d] px-4 py-3 text-sm text-[#f2df9f]">
              {pollError}
            </div>
          ) : null}
          {verificationMessage ? (
            <div className="rounded-2xl border border-[#31402c] bg-black/20 px-4 py-3 text-sm leading-6 text-stone-300">
              {verificationMessage}
            </div>
          ) : null}
          <OrderStatusActions
            orderId={order.id}
            paymentStatus={paymentStatus.payment_status}
            paymentReturn={paymentReturn}
          />
          <Link
            href="/shop"
            className="inline-flex text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-white"
          >
            Continue shopping
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
