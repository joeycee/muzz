import Image from "next/image";

import { BookingNoticeButton } from "@/components/booking-notice-button";
import { formatCurrency, formatDuration } from "@/lib/format";
import { getMediaUrl } from "@/lib/api";
import { PerformanceOption } from "@/lib/types";

export function OfferingCard({
  offering,
  ctaHref = "/book",
}: {
  offering: PerformanceOption;
  ctaHref?: string;
}) {
  const imageUrl = getMediaUrl(offering.image);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0f0f0f] shadow-[0_32px_80px_rgba(0,0,0,0.5)]">

      {/* Taller image peek */}
      <div className="relative h-[480px] overflow-hidden bg-[linear-gradient(135deg,#1b2418,#0e0e0e)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={offering.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(160deg,rgba(123,154,112,0.4)_0%,rgba(10,10,10,0.98)_70%)]" />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0f0f0f]" />
        <span className="absolute bottom-4 left-5 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7b9a70]">
          Live Performance
        </span>
      </div>

      <div className="px-[22px] pb-6 pt-5">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-[family-name:var(--font-heading)] text-[1.7rem] font-light leading-[1.1] tracking-[0.02em] text-stone-100">
            {offering.name}
          </h3>
          <span className="mt-1 flex-shrink-0 rounded-full border border-[#4d6546] px-3 py-1 font-sans text-[11px] font-semibold tracking-[0.12em] text-[#c8a97e]">
            {formatCurrency(offering.price)}
          </span>
        </div>

        <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7b9a70]">
          {formatDuration(offering.duration)} set
        </p>

        <div className="mb-3.5 h-px bg-white/[0.06]" />

        <p className="mb-5 font-sans text-[13px] leading-[1.75] text-stone-500">
          {offering.description}
        </p>

        <BookingNoticeButton
          href={ctaHref}
          offeringId={offering.id}
          offeringName={offering.name}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#7b9a70] px-5 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.26em] text-black transition hover:bg-[#93b586] active:scale-[0.98]"
        />
      </div>
    </article>
  );
}