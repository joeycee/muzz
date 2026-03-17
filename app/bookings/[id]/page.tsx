import { BookingStatusClient } from "@/components/booking-status-client";
import { PaymentBanner } from "@/components/payment-banner";
import { getBooking, getBookingPaymentStatus } from "@/lib/api";

type BookingStatusPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string; session_id?: string }>;
};

export default async function BookingStatusPage({
  params,
  searchParams,
}: BookingStatusPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const bookingId = Number(id);
  const [booking, paymentStatus] = await Promise.all([
    getBooking(bookingId),
    getBookingPaymentStatus(bookingId),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-16 pb-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-[#7b9a70]">
          Booking status
        </p>
        <h1 className="font-[family-name:var(--font-heading)] text-5xl text-stone-100 sm:text-6xl">
          Booking #{booking.id}
        </h1>
        <p className="text-lg leading-8 text-stone-300">
          Review the deposit payment state and the booking details currently stored
          in the backend.
        </p>
      </div>

      <PaymentBanner payment={query.payment} />

      <BookingStatusClient
        initialBooking={booking}
        initialPaymentStatus={paymentStatus}
        paymentReturn={query.payment}
        checkoutSessionId={query.session_id}
      />
    </div>
  );
}
