"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-11 items-center justify-center rounded-full border border-[#4d6546] px-4 text-sm font-semibold uppercase tracking-[0.25em] text-stone-100 transition hover:border-[#7b9a70] hover:text-[#dce7d5]"
      aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <span>Cart</span>
      <span className="ml-3 inline-flex min-w-6 items-center justify-center rounded-full bg-[#7b9a70] px-2 py-0.5 text-xs text-black">
        {itemCount}
      </span>
    </Link>
  );
}
