import { OrderCheckoutForm } from "@/components/order-checkout-form";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 pb-20">
      <div className="mb-10 max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">Cart</p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
          Checkout
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          Review the cart, enter your order details, and continue to Stripe for
          payment.
        </p>
      </div>

      <OrderCheckoutForm />
    </div>
  );
}
