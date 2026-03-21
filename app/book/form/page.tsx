import { BookingProgress } from "@/components/booking-progress";
import { BookingScheduler } from "@/components/booking-scheduler";
import { getPerformanceOptions } from "@/lib/api";

export default async function BookingSchedulePage() {
  const offerings = await getPerformanceOptions();

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 px-5 py-8 pb-12 lg:px-6">
      <div className="max-w-3xl space-y-2">
        <p className="text-xs uppercase tracking-[0.32em] text-[#7b9a70]">
          Booking schedule
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl text-stone-100 lg:text-5xl">
          Choose your session
        </h1>
        <p className="text-sm leading-6 text-stone-400 lg:text-base">
          Select a date and time for your chosen performance offering. Once a session
          is selected, continue to the details step.
        </p>
      </div>

      <BookingProgress currentStep={1} />
      <BookingScheduler offerings={offerings} />
    </div>
  );
}
