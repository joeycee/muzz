"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type NoticeModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function NoticeModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Close",
  onConfirm,
  onClose,
}: NoticeModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-modal-title"
        className="w-full max-w-xl rounded-[2rem] border border-[#31402c] bg-[linear-gradient(180deg,rgba(18,23,17,0.98),rgba(8,9,8,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-[#7b9a70]">
              Booking notice
            </p>
            <h2
              id="notice-modal-title"
              className="font-[family-name:var(--font-heading)] text-4xl text-stone-100"
            >
              {title}
            </h2>
          </div>

          <div className="space-y-4 text-base leading-8 text-stone-300">
            {description}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-300 transition hover:border-white/20 hover:text-white"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center justify-center rounded-full bg-[#7b9a70] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#93b586]"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
