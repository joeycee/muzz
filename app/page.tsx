import Link from "next/link";

import { Hero } from "@/components/hero";
import { OfferingCard } from "@/components/offering-card";
import { ProductCard } from "@/components/product-card";
import { getPerformanceOptions, getProducts } from "@/lib/api";

export default async function HomePage() {
  const [offerings, products] = await Promise.all([
    getPerformanceOptions(),
    getProducts(),
  ]);

  return (
    <div className="space-y-20 pb-20">
      <Hero />

      <section className="mx-auto max-w-6xl space-y-8 px-6" id="bookings">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
              Booking section
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100">
              Performance offerings
            </h2>
            <p className="max-w-2xl text-stone-400">
              Choose from live reggae and roots sets shaped for intimate gatherings,
              private events, and premium venue bookings.
            </p>
          </div>
          <Link
            href="/book"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dce7d5] hover:text-white"
          >
            View all bookings
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {offerings.map((offering) => (
            <OfferingCard
              key={offering.id}
              offering={offering}
              ctaHref="/book/form"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6" id="shop">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
              Shop section
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100">
              Merch with soul
            </h2>
            <p className="max-w-2xl text-stone-400">
              A clean, premium merch collection connected directly to the live shop
              inventory from the backend.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dce7d5] hover:text-white"
          >
            Visit shop
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f0f0f] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="mb-6 space-y-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
              Video section
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100">
              See the live energy
            </h2>
            <p className="max-w-2xl text-stone-400">
              A quick look at the atmosphere, pacing, and sound that shapes the Muzz
              live experience.
            </p>
          </div>
          <div className="aspect-video overflow-hidden rounded-[1.5rem] border border-white/10">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/kRo4SHwE7v8?si=woQAWDmuK_Dy3_Ac" 
              title="Muzz live video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </div>
  );
}
