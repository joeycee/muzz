import { PaymentStatusBadge } from "@/components/payment-status-badge";

export function PaymentBanner({ payment }: { payment?: string }) {
  if (payment === "success") {
    return (
      <div className="rounded-[1.5rem] border border-[#4d6546] bg-[#132015] p-5 text-stone-100">
        <div className="flex flex-wrap items-center gap-3">
          <PaymentStatusBadge label="Payment Return" tone="success" />
          <p className="text-sm uppercase tracking-[0.18em] text-[#dce7d5]">
            Stripe completed
          </p>
        </div>
        <p className="mt-3 leading-7 text-stone-300">
          You have returned from Stripe successfully. If the payment webhook is still
          processing, refresh this page in a moment to see the latest confirmed
          status.
        </p>
      </div>
    );
  }

  if (payment === "cancelled") {
    return (
      <div className="rounded-[1.5rem] border border-[#6d5d2a] bg-[#1b170d] p-5 text-stone-100">
        <div className="flex flex-wrap items-center gap-3">
          <PaymentStatusBadge label="Checkout Cancelled" tone="warning" />
          <p className="text-sm uppercase tracking-[0.18em] text-[#f2df9f]">
            No payment completed
          </p>
        </div>
        <p className="mt-3 leading-7 text-stone-300">
          Your checkout was cancelled before payment was completed. You can review
          the details below and start checkout again when you are ready.
        </p>
      </div>
    );
  }

  return null;
}
