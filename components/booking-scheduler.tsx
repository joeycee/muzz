"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import { BookingCalendar, type CalendarDay } from "@/components/booking-calendar";
import { BookingSummaryPanel } from "@/components/booking-summary-panel";
import { TimeSlotGrid, type TimeSlot } from "@/components/time-slot-grid";
import { getBookingAvailability, getApiErrorMessage } from "@/lib/api";
import {
  EMPTY_BOOKING_DRAFT,
  getStoredBookingDraftSnapshot,
  setStoredBookingDraft,
  subscribeToStoredBookingDraft,
} from "@/lib/booking-storage";
import { PerformanceOption, type BookingAvailability } from "@/lib/types";

const SLOT_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

export function BookingScheduler({ offerings }: { offerings: PerformanceOption[] }) {
  const router = useRouter();
  const bookingDraft = useSyncExternalStore(
    subscribeToStoredBookingDraft,
    getStoredBookingDraftSnapshot,
    () => EMPTY_BOOKING_DRAFT,
  );
  const isHydrated = useHydrated();
  const activeDraft = isHydrated ? bookingDraft : EMPTY_BOOKING_DRAFT;
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [availabilityByDate, setAvailabilityByDate] = useState<Record<string, BookingAvailability>>({});
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);
  const [error, setError] = useState("");

  const selectedOffering =
    offerings.find((o) => o.id === activeDraft.offeringId) ?? null;

  useEffect(() => {
    let isCancelled = false;
    const days = getMonthDays(visibleMonth);
    async function loadMonthAvailability() {
      setLoadingMonth(true);
      setError("");
      try {
        const responses = await Promise.all(days.map((date) => getBookingAvailability(date)));
        if (isCancelled) return;
        setAvailabilityByDate((current) => {
          const next = { ...current };
          responses.forEach((r) => { next[r.date] = r; });
          return next;
        });
      } catch (e) {
        if (!isCancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!isCancelled) setLoadingMonth(false);
      }
    }
    loadMonthAvailability();
    return () => { isCancelled = true; };
  }, [visibleMonth]);

  useEffect(() => {
    if (!activeDraft.eventDate || availabilityByDate[activeDraft.eventDate]) return;
    let isCancelled = false;
    async function loadSelectedDay() {
      setLoadingDay(true);
      try {
        const response = await getBookingAvailability(activeDraft.eventDate);
        if (!isCancelled) setAvailabilityByDate((c) => ({ ...c, [response.date]: response }));
      } catch (e) {
        if (!isCancelled) setError(getApiErrorMessage(e));
      } finally {
        if (!isCancelled) setLoadingDay(false);
      }
    }
    loadSelectedDay();
    return () => { isCancelled = true; };
  }, [activeDraft.eventDate, availabilityByDate]);

  const calendarDays = useMemo<CalendarDay[]>(
    () => buildCalendarDays(visibleMonth, activeDraft.eventDate, availabilityByDate),
    [activeDraft.eventDate, availabilityByDate, visibleMonth],
  );

  const selectedDayAvailability = activeDraft.eventDate
    ? availabilityByDate[activeDraft.eventDate]
    : undefined;
  const isTimeSlotLoading =
    Boolean(activeDraft.eventDate) &&
    !selectedDayAvailability &&
    (loadingMonth || loadingDay);

  const timeSlots = useMemo<TimeSlot[]>(() => {
    if (!activeDraft.eventDate || !selectedOffering) return [];
    return buildTimeSlots({
      date: activeDraft.eventDate,
      availability: selectedDayAvailability,
      offeringDuration: selectedOffering.duration,
    });
  }, [activeDraft.eventDate, selectedDayAvailability, selectedOffering]);

  useEffect(() => {
    if (!activeDraft.eventTime || timeSlots.some((s) => s.time === activeDraft.eventTime && s.available)) return;
    setStoredBookingDraft({ eventTime: "" });
  }, [activeDraft.eventTime, timeSlots]);

  return (
    <div className="bs-root">
      {error && (
        <div className="bs-error">{error}</div>
      )}
      <div className="bs-grid">
        <BookingCalendar
          monthDate={visibleMonth}
          days={calendarDays}
          onPreviousMonth={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
          onNextMonth={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
          onSelectDate={(date) => setStoredBookingDraft({ eventDate: date, eventTime: "" })}
        />
        <TimeSlotGrid
          selectedDate={activeDraft.eventDate}
          selectedTime={activeDraft.eventTime}
          slots={timeSlots}
          isLoading={isTimeSlotLoading}
          onSelectTime={(time) => setStoredBookingDraft({ eventTime: time })}
        />
        <BookingSummaryPanel
          offering={selectedOffering}
          selectedDate={activeDraft.eventDate}
          selectedTime={activeDraft.eventTime}
          onNext={() => router.push("/book/details")}
        />
      </div>

      <style>{`
        .bs-root {
          --sage:  #8faa84;
          --terra: #c8a87a;
          --bone:  #ede5d5;
          --muted: rgba(200,192,178,0.55);
          --dark:  #080a07;
          --panel: #0d0f0c;
          --border: rgba(255,255,255,0.06);
          --border-hover: rgba(143,170,132,0.3);
          --border-active: rgba(143,170,132,0.65);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-family: 'DM Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: var(--bone);
        }
        .bs-error {
          border: 1px solid rgba(180,60,60,0.35);
          background: rgba(40,10,10,0.7);
          border-radius: 1rem;
          padding: 0.85rem 1.1rem;
          font-size: 0.82rem;
          color: #f4a8a8;
          letter-spacing: 0.01em;
        }
        .bs-grid {
          display: grid;
          gap: 1.25rem;
        }
        @media (min-width: 1024px) {
          .bs-grid {
            grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.98fr) minmax(280px, 0.8fr);
            gap: 1rem;
            align-items: start;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .bs-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

/* ── helpers (unchanged) ─────────────────────────────── */
function getMonthDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: lastDay }, (_, i) => toIsoDate(new Date(year, month, i + 1)));
}

function buildCalendarDays(monthDate: Date, selectedDate: string, availabilityByDate: Record<string, BookingAvailability>) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startOffset);
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    const iso = toIsoDate(date);
    const availability = availabilityByDate[iso];
    return {
      date: iso, dayNumber: date.getDate(),
      inMonth: date.getMonth() === monthDate.getMonth(),
      isToday: iso === toIsoDate(new Date()),
      isPast: iso < toIsoDate(new Date()),
      hasAvailability: availability ? hasAnyAvailability(iso, availability) : false,
      isSelected: selectedDate === iso,
    };
  });
}

function buildTimeSlots({ date, availability, offeringDuration }: { date: string; availability?: BookingAvailability; offeringDuration: string }) {
  return SLOT_HOURS.map((hour) => {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    return { time, label: time, available: isSlotAvailable(date, time, offeringDuration, availability) };
  });
}

function isSlotAvailable(date: string, time: string, duration: string, availability?: BookingAvailability) {
  const now = new Date();
  const start = new Date(`${date}T${normalizeTime(time)}:00`);
  if (start <= now) return false;
  if (!availability) return true;
  const end = addDuration(start, duration);
  const blockedByManualSlot = availability.blocks.some((block) => {
    if (block.is_all_day) return true;
    if (!block.start_time || !block.end_time) return false;
    const blockStart = new Date(`${date}T${normalizeTime(block.start_time)}`);
    const blockEnd = new Date(`${date}T${normalizeTime(block.end_time)}`);
    return start < blockEnd && end > blockStart;
  });
  if (blockedByManualSlot) return false;
  return !availability.bookings.some((booking) => {
    const bookingStart = new Date(`${date}T${normalizeTime(booking.event_time)}`);
    const bookingEnd = addDuration(bookingStart, booking.performance_option.duration);
    return start < bookingEnd && end > bookingStart;
  });
}

function hasAnyAvailability(date: string, availability: BookingAvailability) {
  return SLOT_HOURS.some((hour) => isSlotAvailable(date, `${hour.toString().padStart(2, "0")}:00`, "01:00:00", availability));
}
function normalizeTime(value: string) { return value.length === 5 ? `${value}:00` : value; }
function addDuration(start: Date, duration: string) {
  const [hours = "0", minutes = "0", seconds = "0"] = duration.split(":");
  const next = new Date(start);
  next.setHours(next.getHours() + Number(hours), next.getMinutes() + Number(minutes), next.getSeconds() + Number(seconds), 0);
  return next;
}
function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function useHydrated() {
  return useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
}

function subscribeHydration() {
  return () => {};
}
