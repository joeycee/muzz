"use client";

import { cn, padNumber } from "@/lib/utils";
import { formatMonthLabel } from "@/lib/format";

export type CalendarDay = {
  date: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  hasAvailability: boolean;
  isSelected: boolean;
};

export function BookingCalendar({
  monthDate,
  days,
  onPreviousMonth,
  onNextMonth,
  onSelectDate,
}: {
  monthDate: Date;
  days: CalendarDay[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: string) => void;
}) {
  return (
    <section className="bc-panel">
      {/* Header */}
      <div className="bc-header">
        <div>
          <p className="bc-eyebrow">Select date</p>
          <h2 className="bc-month">
            {formatMonthLabel(monthDate.getFullYear(), monthDate.getMonth())}
          </h2>
        </div>
        <div className="bc-nav">
          <MonthButton label="Previous month" onClick={onPreviousMonth}>←</MonthButton>
          <MonthButton label="Next month" onClick={onNextMonth}>→</MonthButton>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="bc-weekdays">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      {/* Day grid */}
      <div className="bc-grid">
        {days.map((day) => (
          <button
            key={day.date}
            type="button"
            disabled={day.isPast || !day.inMonth}
            onClick={() => onSelectDate(day.date)}
            className={cn(
              "bc-day",
              !day.inMonth && "bc-day--out",
              day.inMonth && !day.isPast && !day.isSelected && "bc-day--available",
              day.isToday && !day.isSelected && "bc-day--today",
              day.isSelected && "bc-day--selected",
              day.isPast && day.inMonth && "bc-day--past",
            )}
          >
            <span className="bc-day-num">{padNumber(day.dayNumber)}</span>
            {day.hasAvailability && <span className="bc-dot" />}
          </button>
        ))}
      </div>

      <style>{`
        .bc-panel {
          background: #0d0f0c;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 1.35rem;
          padding: 1.2rem;
          box-shadow: 0 16px 44px rgba(0,0,0,0.3);
        }
        .bc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        .bc-eyebrow {
          font-size: 0.6rem;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: #8faa84;
          margin: 0 0 0.4rem;
        }
        .bc-month {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #ede5d5;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .bc-nav {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .bc-nav-btn {
          width: 2.15rem; height: 2.15rem;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          color: #c8c0b0;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
        }
        .bc-nav-btn:hover {
          border-color: rgba(143,170,132,0.4);
          background: rgba(143,170,132,0.07);
          color: #8faa84;
        }
        .bc-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.3rem;
          margin-bottom: 0.35rem;
          text-align: center;
        }
        .bc-weekdays span {
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(150,140,125,0.6);
          padding: 0.25rem 0;
        }
        .bc-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }
        .bc-day {
          position: relative;
          min-height: 3.15rem;
          border-radius: 0.65rem;
          border: 1px solid transparent;
          background: transparent;
          padding: 0.35rem 0.35rem 0.25rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.2rem;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .bc-day--out {
          opacity: 0;
          pointer-events: none;
        }
        .bc-day--available {
          border-color: rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.015);
        }
        .bc-day--available:hover {
          border-color: rgba(143,170,132,0.28);
          background: rgba(143,170,132,0.05);
        }
        .bc-day--today {
          border-color: rgba(143,170,132,0.22) !important;
        }
        .bc-day--selected {
          border-color: #8faa84 !important;
          background: rgba(143,170,132,0.1) !important;
          box-shadow: 0 0 0 1px rgba(143,170,132,0.25) inset;
        }
        .bc-day--past {
          opacity: 0.28;
          cursor: not-allowed;
        }
        .bc-day-num {
          font-size: 0.78rem;
          color: #ccc4b4;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .bc-day--selected .bc-day-num { color: #dce7d5; }
        .bc-dot {
          display: block;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #8faa84;
          margin-top: auto;
        }

        @media (max-width: 480px) {
          .bc-panel { padding: 1.25rem; }
          .bc-day { min-height: 2.8rem; padding: 0.35rem 0.25rem; }
          .bc-day-num { font-size: 0.7rem; }
          .bc-month { font-size: 1.35rem; }
        }
      `}</style>
    </section>
  );
}

function MonthButton({ children, label, onClick }: { children: string; label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="bc-nav-btn">
      {children}
    </button>
  );
}
