import Link from "next/link";

import { Hero } from "@/components/hero";
import { HomeShopShowcase } from "@/components/home-shop-showcase";
import { OfferingCard } from "@/components/offering-card";
import { TestimonialShowcase } from "@/components/testimonial-showcase";
import { getPerformanceOptions, getProducts, getTestimonials } from "@/lib/api";

export default async function HomePage() {
  const [offerings, products, testimonials] = await Promise.all([
    getPerformanceOptions(),
    getProducts(),
    getTestimonials(),
  ]);

  return (
    <div className="space-y-20 pb-20">
      <Hero />

      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 py-2 lg:grid-cols-[1.1fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
              About Mitch
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100 sm:text-4xl">
              Auckland-based music with warmth, soul, and real presence
            </h2>
            <p className="max-w-3xl text-base leading-8 text-stone-300">
              Mitch is an Auckland-based musician known for intimate live sets that
              balance roots, rhythm, and emotional clarity. From private celebrations
              and weddings to public events, venue performances, and creative
              collaborations, he brings a grounded stage presence that can hold a room
              gently or lift it with energy when the moment asks for it.
            </p>
            <p className="max-w-3xl text-base leading-8 text-stone-400">
              The focus is always the same: honest music, thoughtful delivery, and a
              live experience that feels personal rather than overproduced.
            </p>
          </div>

          <div className="space-y-4 rounded-[1.5rem] bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-[#7b9a70]">
              Bring the sound into your space
            </p>
            <p className="text-sm leading-7 text-stone-300">
              Explore performance options, check the vibe, and start a booking enquiry
              when you are ready.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:border-[#42533d] hover:text-[#dce7d5]"
              >
                Read more
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586]"
              >
                Book Mitch
              </Link>
            </div>
          </div>
        </div>
      </section>

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
        <div className="flex items-center justify-end gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 md:hidden">
          <span>Scroll</span>
          <span aria-hidden="true">-&gt;</span>
        </div>
	        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:overflow-visible md:pb-0 md:grid-cols-2 lg:grid-cols-3">
	          {offerings.map((offering) => (
	            <div
              key={offering.id}
              className="w-[84vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none"
            >
              <OfferingCard
                offering={offering}
                ctaHref="/book/form"
              />
            </div>
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
        <HomeShopShowcase products={products} />
      </section>

      <TestimonialShowcase testimonials={testimonials} />

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
              A quick look at the atmosphere, pacing, and sound that shapes the Mitch
              live experience.
            </p>
          </div>
          <div className="aspect-video overflow-hidden rounded-[1.5rem] border border-white/10">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/kRo4SHwE7v8?si=woQAWDmuK_Dy3_Ac" 
              title="Mitch live video"
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
