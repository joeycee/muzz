import { OrderStatusClient } from "@/components/order-status-client";
import { getOrder, getOrderDownloads, getOrderPaymentStatus } from "@/lib/api";

type OrderStatusPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string; session_id?: string }>;
};

export default async function OrderStatusPage({
  params,
  searchParams,
}: OrderStatusPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const orderId = Number(id);
  const [order, paymentStatus] = await Promise.all([
    getOrder(orderId),
    getOrderPaymentStatus(orderId),
  ]);
  const downloads =
    order.has_downloadable_items && order.download_access_granted
      ? await getOrderDownloads(order.id, order.download_token)
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16 pb-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
          Order status
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
          Order #{order.id}
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          Review your order details and payment status after returning from Stripe.
        </p>
      </div>
      <OrderStatusClient
        initialOrder={order}
        initialPaymentStatus={paymentStatus}
        initialDownloads={downloads}
        paymentReturn={query.payment}
        checkoutSessionId={query.session_id}
      />
    </div>
  );
}
