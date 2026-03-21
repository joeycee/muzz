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
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        Book
      </button>

      <NoticeModal
        open={isOpen}
        title="Before we secure your date"
        description={
          <p>
            A <strong>60% deposit</strong> is required to hold your date, refundable up to one
            month prior. The remaining balance is due after the performance. Travel costs may
            apply (~80c/km, ~$175/night accommodation).
          </p>
        }
        confirmLabel="Continue to Booking"
        cancelLabel="Not now"
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          setStoredBookingOffering({ id: offeringId, name: offeringName });
          setIsOpen(false);
          router.push(href);
        }}
      />
    </>
  );
}