export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDuration(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  const parts: string[] = [];

  if (Number(hours) > 0) {
    parts.push(`${Number(hours)}h`);
  }

  if (Number(minutes) > 0) {
    parts.push(`${Number(minutes)}m`);
  }

  return parts.join(" ") || value;
}

export function formatDateLabel(value: string, options?: Intl.DateTimeFormatOptions) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...options,
  }).format(date);
}

export function formatMonthLabel(year: number, monthIndex: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex, 1));
}

export function formatTimeLabel(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
