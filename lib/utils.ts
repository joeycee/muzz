export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function titleizeStatus(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function padNumber(value: number) {
  return value.toString().padStart(2, "0");
}

export function normalizeProductSizes(sizes?: string[]) {
  if (!Array.isArray(sizes)) {
    return [];
  }

  return sizes
    .map((size) => {
      const trimmed = size.trim();
      return trimmed ? { value: trimmed, label: trimmed } : null;
    })
    .filter((size): size is { value: string; label: string } => Boolean(size));
}
