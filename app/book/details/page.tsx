import { BookingProgress } from "@/components/booking-progress";
import { BookingForm } from "@/components/booking-form";
import { getPerformanceOptions } from "@/lib/api";

export default async function BookingDetailsPage() {
  const offerings = await getPerformanceOptions();

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-5 py-8 pb-12 lg:px-6">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-[#7b9a70]">
          Booking details
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100 lg:text-5xl">
          Add event details
        </h1>
        <p className="text-sm leading-6 text-stone-400 lg:text-base">
          Enter the final contact and venue details, then move to a short review step
          before checkout.
        </p>
      </div>

      <BookingProgress currentStep={2} />
      <BookingForm offerings={offerings} />
    </div>
  );
}
