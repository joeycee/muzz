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
    <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101010] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[4/3] bg-[linear-gradient(135deg,#1b2418,#0e0e0e)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={offering.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-end bg-[radial-gradient(circle_at_top_left,_rgba(123,154,112,0.5),_transparent_30%),linear-gradient(180deg,_rgba(33,46,30,0.95),_rgba(10,10,10,0.98))] p-6">
            <p className="font-[family-name:var(--font-heading)] text-2xl uppercase tracking-[0.2em] text-stone-100">
              {offering.name}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-[family-name:var(--font-heading)] text-2xl text-stone-100">
              {offering.name}
            </h3>
            <span className="rounded-full border border-[#4d6546] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#dce7d5]">
              {formatCurrency(offering.price)}
            </span>
          </div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#7b9a70]">
            {formatDuration(offering.duration)} set
          </p>
          <p className="text-sm leading-7 text-stone-400">{offering.description}</p>
        </div>

        <BookingNoticeButton
          href={ctaHref}
          offeringId={offering.id}
          offeringName={offering.name}
          className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586]"
        />
      </div>
    </article>
  );
}
