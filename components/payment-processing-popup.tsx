"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function PaymentProcessingPopup({
  isOpen,
  isConfirmed,
}: {
  isOpen: boolean;
  isConfirmed: boolean;
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isOpen || !isConfirmed) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsDismissed(true);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isConfirmed, isOpen]);

  if (!isOpen || isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-6 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b0d0a] px-6 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex justify-center">
          <Image
            src="/m-record.svg"
            alt="Mitch record logo"
            width={84}
            height={84}
            className="h-20 w-20"
            priority
          />
        </div>
        <div className="mt-5 space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-[#7b9a70]">
            Stripe return
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl text-stone-100">
            {isConfirmed ? "Payment confirmed" : "Just getting the last bits organized"}
          </h2>
          <p className="text-sm leading-7 text-stone-300">
            {isConfirmed
              ? "Your payment is locked in and everything is ready to go."
              : "We're finishing the final confirmation in the background now."}
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          {isConfirmed ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7b9a70] text-2xl text-[#081006]">
              ✓
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full border-4 border-white/10 border-t-[#7b9a70] animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}
