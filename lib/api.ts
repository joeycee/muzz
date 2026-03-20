import {
  BookingAvailability,
  Booking,
  BookingCheckoutVerificationResponse,
  BookingCreateInput,
  CheckoutSessionResponse,
  Order,
  OrderCreateInput,
  OrderCheckoutVerificationResponse,
  OrderDownloadsResponse,
  PaymentStatusResponse,
  PerformanceOption,
  Product,
  Testimonial,
} from "@/lib/types";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

type ApiFetchOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
}

async function parseErrorPayload(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  { method = "GET", body }: ApiFetchOptions = {},
): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await parseErrorPayload(response);
    throw new ApiError(getApiErrorMessage(payload), response.status, payload);
  }

  return response.json() as Promise<T>;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return getApiErrorMessage(error.payload) || error.message;
  }

  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object") {
    const payload = error as Record<string, unknown>;

    if (typeof payload.detail === "string") {
      return payload.detail;
    }

    if (Array.isArray(payload.detail)) {
      return payload.detail.join(" ");
    }

    const firstValue = Object.values(payload)[0];

    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return String(firstValue[0]);
    }

    if (typeof firstValue === "string") {
      return firstValue;
    }

    if (
      firstValue &&
      typeof firstValue === "object" &&
      "detail" in firstValue &&
      typeof firstValue.detail === "string"
    ) {
      return firstValue.detail;
    }
  }

  return "Something went wrong. Please try again.";
}

export function getMediaUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getPerformanceOptions() {
  return apiFetch<PerformanceOption[]>("/api/bookings/performance-options/");
}

export async function getProducts() {
  return apiFetch<Product[]>("/api/shop/products/");
}

export async function getTestimonials() {
  return apiFetch<Testimonial[]>("/api/testimonials/");
}

export async function getProduct(slug: string) {
  return apiFetch<Product>(`/api/shop/products/${slug}/`);
}

export async function createBooking(input: BookingCreateInput) {
  return apiFetch<Booking>("/api/bookings/", {
    method: "POST",
    body: input,
  });
}

export async function getBookingAvailability(date: string) {
  const params = new URLSearchParams({ date });
  return apiFetch<BookingAvailability>(
    `/api/bookings/availability/?${params.toString()}`,
  );
}

export async function getBooking(id: number) {
  return apiFetch<Booking>(`/api/bookings/${id}/`);
}

export async function createBookingCheckoutSession(id: number) {
  return apiFetch<CheckoutSessionResponse>(`/api/bookings/${id}/checkout-session/`, {
    method: "POST",
  });
}

export async function getBookingPaymentStatus(id: number) {
  return apiFetch<PaymentStatusResponse>(`/api/bookings/${id}/payment-status/`);
}

export async function verifyBookingCheckoutSession(
  id: number,
  checkoutSessionId: string,
) {
  return apiFetch<BookingCheckoutVerificationResponse>(
    `/api/bookings/${id}/verify-checkout-session/`,
    {
      method: "POST",
      body: {
        checkout_session_id: checkoutSessionId,
      },
    },
  );
}

export async function createOrder(input: OrderCreateInput) {
  return apiFetch<Order>("/api/shop/orders/", {
    method: "POST",
    body: input,
  });
}

export async function getOrderDownloads(id: number, token: string) {
  const params = new URLSearchParams({ token });
  return apiFetch<OrderDownloadsResponse>(
    `/api/shop/orders/${id}/downloads/?${params.toString()}`,
  );
}

export async function getOrder(id: number) {
  return apiFetch<Order>(`/api/shop/orders/${id}/`);
}

export async function createOrderCheckoutSession(id: number) {
  return apiFetch<CheckoutSessionResponse>(`/api/shop/orders/${id}/checkout-session/`, {
    method: "POST",
  });
}

export async function verifyOrderCheckoutSession(
  id: number,
  checkoutSessionId: string,
) {
  return apiFetch<OrderCheckoutVerificationResponse>(
    `/api/shop/orders/${id}/verify-checkout-session/`,
    {
      method: "POST",
      body: {
        checkout_session_id: checkoutSessionId,
      },
    },
  );
}

export async function getOrderPaymentStatus(id: number) {
  return apiFetch<PaymentStatusResponse>(`/api/shop/orders/${id}/payment-status/`);
}
