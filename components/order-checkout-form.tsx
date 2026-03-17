"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { DigitalBadge } from "@/components/digital-badge";
import { createOrder, createOrderCheckoutSession, getApiErrorMessage, getMediaUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";

type OrderFormState = {
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: string;
  shipping_country: string;
  notes: string;
};

export function OrderCheckoutForm() {
  const { items, subtotal, increaseItem, decreaseItem, removeItem, clearCart } =
    useCart();
  const [form, setForm] = useState<OrderFormState>({
    customer_name: "",
    email: "",
    phone: "",
    shipping_address: "",
    shipping_country: "New Zealand",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const hasPhysicalItems = items.some((item) => !item.is_digital);
  const hasOnlyDigitalItems = items.every((item) => item.is_digital);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const order = await createOrder({
        customer_name: form.customer_name,
        email: form.email,
        phone: form.phone,
        shipping_address: form.shipping_address,
        shipping_country: form.shipping_country,
        notes: form.notes,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
      const session = await createOrderCheckoutSession(order.id);
      window.location.assign(session.checkout_url);
    } catch (submissionError) {
      setError(getApiErrorMessage(submissionError));
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-8">
        <p className="text-lg text-stone-300">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586]"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-5">
          <div className="space-y-4">
            {items.map((item) => {
              const imageUrl = getMediaUrl(item.image);

              return (
                <article
                  key={item.id}
                  className="flex flex-col gap-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#111,#1d2618)]">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-3 text-center text-xs uppercase tracking-[0.18em] text-stone-300">
                          {item.name}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {item.is_digital ? <DigitalBadge /> : null}
                      <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
                        {item.name}
                      </h2>
                      <p className="text-sm uppercase tracking-[0.2em] text-[#7b9a70]">
                        {formatCurrency(item.price)} each
                      </p>
                      {item.product_type === "digital_album" ? (
                        <p className="text-sm text-stone-400">
                          {item.digital_tracks?.length || 0} tracks included
                        </p>
                      ) : null}
                      {item.is_digital ? (
                        <p className="text-sm text-stone-400">No shipping required</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-full border border-[#31402c]">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        className="px-4 py-2 text-stone-200"
                        aria-label={`Decrease ${item.name}`}
                      >
                        -
                      </button>
                      <span className="min-w-10 text-center text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        className="px-4 py-2 text-stone-200"
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <span className="min-w-24 text-right text-stone-100">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Full name"
              htmlFor="customer_name"
              input={
                <input
                  id="customer_name"
                  required
                  value={form.customer_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      customer_name: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              }
            />
            <Field
              label="Email"
              htmlFor="email"
              input={
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  className={inputClassName}
                />
              }
            />
            <Field
              label="Phone"
              htmlFor="phone"
              input={
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  className={inputClassName}
                />
              }
            />
            <Field
              label="Shipping address"
              htmlFor="shipping_address"
              input={
                <textarea
                  id="shipping_address"
                  required
                  rows={4}
                  value={form.shipping_address}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      shipping_address: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              }
            />
            <Field
              label="Shipping country"
              htmlFor="shipping_country"
              input={
                <input
                  id="shipping_country"
                  required
                  value={form.shipping_country}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      shipping_country: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              }
            />
          </div>

          <div className="mt-5">
            <Field
              label="Notes"
              htmlFor="notes"
              input={
                <textarea
                  id="notes"
                  rows={4}
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  className={inputClassName}
                />
              }
            />
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-[#7a3f3f] bg-[#241212] px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={clearCart}
              className="text-sm uppercase tracking-[0.18em] text-stone-400 hover:text-white"
            >
              Clear cart
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Redirecting to Stripe..." : "Create Order and Pay"}
            </button>
          </div>
        </div>
      </form>

      <aside className="h-fit rounded-[1.75rem] border border-[#31402c] bg-[#0f110f] p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
          Summary
        </h2>
        <div className="mt-6 flex items-center justify-between text-stone-300">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-stone-300">
          <span>Shipping</span>
          <span>
            {hasOnlyDigitalItems
              ? "Free (Digital Download)"
              : hasPhysicalItems
                ? "Calculated by backend"
                : "--"}
          </span>
        </div>
        <p className="mt-4 text-sm leading-7 text-stone-400">
          {hasOnlyDigitalItems
            ? "This cart contains only digital music downloads. No physical shipping will be charged."
            : "Submitting creates an order in the backend, then starts Stripe checkout using the existing order payment endpoint."}
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  input,
}: {
  label: string;
  htmlFor: string;
  input: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="space-y-2 text-sm text-stone-300">
      <span className="block uppercase tracking-[0.2em] text-stone-400">{label}</span>
      {input}
    </label>
  );
}

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-[#7b9a70]";
