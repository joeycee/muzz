"use client";

import { cn } from "@/lib/utils";
import { formatDateLabel, formatTimeLabel } from "@/lib/format";

export type TimeSlot = {
  time: string;
  label: string;
  available: boolean;
};

export function TimeSlotGrid({
  selectedDate,
  selectedTime,
  slots,
  isLoading,
  onSelectTime,
}: {
  selectedDate: string;
  selectedTime: string;
  slots: TimeSlot[];
  isLoading: boolean;
  onSelectTime: (time: string) => void;
}) {
  const visibleSlots = slots.slice(0, 12);

  return (
    <section className="tsg-panel">
      <div className="tsg-header">
        <div>
          <p className="tsg-eyebrow">Select time</p>
          <h2 className="tsg-title">
            {selectedDate
              ? `${formatDateLabel(selectedDate)}`
              : "Choose a date first"}
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="tsg-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="tsg-skeleton" />
          ))}
        </div>
      ) : selectedDate && visibleSlots.length > 0 ? (
        <div className="tsg-grid">
          {visibleSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              disabled={!slot.available}
              onClick={() => onSelectTime(slot.time)}
              className={cn(
                "tsg-slot",
                slot.available ? "tsg-slot--open" : "tsg-slot--taken",
                selectedTime === slot.time && "tsg-slot--selected",
              )}
            >
              <span className="tsg-slot-label">Session</span>
              <span className="tsg-slot-time">{formatTimeLabel(slot.time)}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="tsg-empty">
          {selectedDate
            ? "No open times available for this date. Try another day."
            : "Select a date from the calendar to see available session times."}
        </div>
      )}

      <style>{`
        .tsg-panel {
          background: #0d0f0c;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1.35rem;
          padding: 1.2rem;
          box-shadow: 0 16px 44px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .tsg-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
        }
        .tsg-eyebrow {
          font-size: 0.6rem;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: #8faa84;
          margin: 0 0 0.4rem;
        }
        .tsg-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #ede5d5;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .tsg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        @media (max-width: 480px) {
          .tsg-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .tsg-slot {
          border-radius: 0.8rem;
          border: 1px solid transparent;
          padding: 0.7rem 0.7rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          transition: border-color 0.15s, background 0.15s;
          background: transparent;
        }
        .tsg-slot--open {
          border-color: rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .tsg-slot--open:hover {
          border-color: rgba(143,170,132,0.3);
          background: rgba(143,170,132,0.05);
        }
        .tsg-slot--taken {
          border-color: rgba(255,255,255,0.03);
          opacity: 0.3;
          cursor: not-allowed;
        }
        .tsg-slot--selected {
          border-color: #8faa84 !important;
          background: rgba(143,170,132,0.1) !important;
          box-shadow: 0 0 0 1px rgba(143,170,132,0.2) inset;
        }
        .tsg-slot-label {
          font-size: 0.58rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(140,132,118,0.6);
        }
        .tsg-slot--selected .tsg-slot-label { color: rgba(143,170,132,0.7); }
        .tsg-slot-time {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem;
          font-weight: 700;
          color: #ccc4b4;
          letter-spacing: -0.01em;
          line-height: 1;
        }
        .tsg-slot--selected .tsg-slot-time { color: #dce7d5; }
        .tsg-skeleton {
          height: 3.6rem;
          border-radius: 0.8rem;
          border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
          animation: tsgPulse 1.6s ease infinite;
        }
        @keyframes tsgPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .tsg-empty {
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1rem;
          padding: 1.4rem;
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(180,172,158,0.55);
        }
        @media (max-width: 480px) {
          .tsg-panel { padding: 1.25rem; }
          .tsg-title { font-size: 1.1rem; }
        }
      `}</style>
    </section>
  );
}
