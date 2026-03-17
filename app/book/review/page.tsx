import { BookingProgress } from "@/components/booking-progress";
import { BookingReview } from "@/components/booking-review";
import { getPerformanceOptions } from "@/lib/api";

export default async function BookingReviewPage() {
  const offerings = await getPerformanceOptions();

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-5 py-8 pb-12 lg:px-6">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-[#7b9a70]">
          Booking review
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100 lg:text-5xl">
          Review and confirm
        </h1>
        <p className="text-sm leading-6 text-stone-400 lg:text-base">
          One last concise check before the booking is created and deposit checkout begins.
        </p>
      </div>

      <BookingProgress currentStep={3} />
      <BookingReview offerings={offerings} />
    </div>
  );
}
