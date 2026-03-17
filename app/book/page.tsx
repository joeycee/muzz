import Link from "next/link";

import { OfferingCard } from "@/components/offering-card";
import { getPerformanceOptions } from "@/lib/api";

export default async function BookPage() {
  const offerings = await getPerformanceOptions();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-16 pb-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">Book</p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
          Performance offerings
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          First choose the performance offering that fits your event. After you
          confirm the booking terms, you will continue into a dedicated scheduling
          step and then on to the final booking details form.
        </p>
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

      <div className="rounded-[1.75rem] border border-[#31402c] bg-[#0f110f] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-[#7b9a70]">
          Already selected?
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-stone-100">
          Continue to scheduling
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-stone-400">
          If you have already confirmed an offering, you can jump back into the
          calendar-style scheduling step and keep building the booking.
        </p>
        <Link
          href="/book/form"
          className="mt-5 inline-flex items-center justify-center rounded-full border border-[#4d6546] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-stone-100 transition hover:border-[#7b9a70] hover:text-[#dce7d5]"
        >
          Open scheduler
        </Link>
      </div>
    </div>
  );
}
