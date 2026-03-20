"use client";

import { useRef } from "react";

import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";

export function HomeShopShowcase({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  if (products.length <= 3) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  function scrollRail(direction: "left" | "right") {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const amount = rail.clientWidth * 0.85;
    rail.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
          Scroll to explore the collection
        </p>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollRail("left")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111611] text-stone-200 transition hover:border-[#42533d] hover:text-white"
            aria-label="Scroll products left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollRail("right")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111611] text-stone-200 transition hover:border-[#42533d] hover:text-white"
            aria-label="Scroll products right"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[82vw] snap-start sm:min-w-[24rem] lg:min-w-[26rem]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
