"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { NoticeModal } from "@/components/notice-modal";
import { setStoredBookingOffering } from "@/lib/booking-storage";

export function BookingNoticeButton({
  href,
  className,
  offeringId,
  offeringName,
}: {
  href: string;
  className: string;
  offeringId: number;
  offeringName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        Book
      </button>

      <NoticeModal
        open={isOpen}
        title="Before we secure your date"
        description={
          <>
            <p>
              To confirm your booking, a 60% deposit is collected at the time of
              reservation so the performance date can be held exclusively for your
              event.
            </p>
            <p>
              If plans change, that deposit is refundable up to one month before the
              event date, less any payment processing or service fees already
              incurred.
            </p>
            <p>
              The remaining balance is due once the performance has been completed,
              keeping the process straightforward for both the client and the artist.
            </p>
          </>
        }
        confirmLabel="Continue to Booking"
        cancelLabel="Not now"
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setStoredBookingOffering({
            id: offeringId,
            name: offeringName,
          });
          setIsOpen(false);
          router.push(href);
        }}
      />
    </>
  );
}
