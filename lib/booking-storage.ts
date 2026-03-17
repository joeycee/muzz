const BOOKING_DRAFT_STORAGE_KEY = "muzz-booking-draft";
const BOOKING_DRAFT_EVENT = "muzz-booking-draft-change";

export type BookingDraft = {
  offeringId: number | null;
  offeringName: string;
  eventDate: string;
  eventTime: string;
  customerName: string;
  email: string;
  phone: string;
  venue: string;
  location: string;
  notes: string;
};

export const EMPTY_BOOKING_DRAFT: BookingDraft = {
  offeringId: null,
  offeringName: "",
  eventDate: "",
  eventTime: "",
  customerName: "",
  email: "",
  phone: "",
  venue: "",
  location: "",
  notes: "",
};

let cachedRawValue: string | null | undefined;
let cachedDraft: BookingDraft = EMPTY_BOOKING_DRAFT;

function normalizeBookingDraft(value: Partial<BookingDraft> | null | undefined): BookingDraft {
  return {
    offeringId:
      typeof value?.offeringId === "number" && Number.isFinite(value.offeringId)
        ? value.offeringId
        : null,
    offeringName: typeof value?.offeringName === "string" ? value.offeringName : "",
    eventDate: typeof value?.eventDate === "string" ? value.eventDate : "",
    eventTime: typeof value?.eventTime === "string" ? value.eventTime : "",
    customerName: typeof value?.customerName === "string" ? value.customerName : "",
    email: typeof value?.email === "string" ? value.email : "",
    phone: typeof value?.phone === "string" ? value.phone : "",
    venue: typeof value?.venue === "string" ? value.venue : "",
    location: typeof value?.location === "string" ? value.location : "",
    notes: typeof value?.notes === "string" ? value.notes : "",
  };
}

function readStoredBookingDraft(): BookingDraft {
  if (typeof window === "undefined") {
    return EMPTY_BOOKING_DRAFT;
  }

  const rawValue = window.localStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);

  if (rawValue === cachedRawValue) {
    return cachedDraft;
  }

  if (!rawValue) {
    cachedRawValue = null;
    cachedDraft = EMPTY_BOOKING_DRAFT;
    return cachedDraft;
  }

  try {
    cachedRawValue = rawValue;
    cachedDraft = normalizeBookingDraft(JSON.parse(rawValue) as Partial<BookingDraft>);
    return cachedDraft;
  } catch {
    window.localStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
    cachedRawValue = null;
    cachedDraft = EMPTY_BOOKING_DRAFT;
    return cachedDraft;
  }
}

function notifyBookingDraftChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(BOOKING_DRAFT_EVENT));
}

export function getStoredBookingDraft() {
  return readStoredBookingDraft();
}

export function getStoredBookingDraftSnapshot() {
  return readStoredBookingDraft();
}

export function subscribeToStoredBookingDraft(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === BOOKING_DRAFT_STORAGE_KEY) {
      onStoreChange();
    }
  }

  function handleCustomEvent() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(BOOKING_DRAFT_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(BOOKING_DRAFT_EVENT, handleCustomEvent);
  };
}

export function setStoredBookingDraft(nextDraft: Partial<BookingDraft>) {
  if (typeof window === "undefined") {
    return;
  }

  const mergedDraft = normalizeBookingDraft({
    ...readStoredBookingDraft(),
    ...nextDraft,
  });
  const nextRawValue = JSON.stringify(mergedDraft);

  window.localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, nextRawValue);
  cachedRawValue = nextRawValue;
  cachedDraft = mergedDraft;
  notifyBookingDraftChanged();
}

export function clearStoredBookingDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
  cachedRawValue = null;
  cachedDraft = EMPTY_BOOKING_DRAFT;
  notifyBookingDraftChanged();
}

export function setStoredBookingOffering({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  setStoredBookingDraft({
    offeringId: id,
    offeringName: name,
  });
}

export function clearStoredBookingOffering() {
  setStoredBookingDraft({
    offeringId: null,
    offeringName: "",
  });
}
