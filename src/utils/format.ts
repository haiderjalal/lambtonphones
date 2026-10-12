const priceFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  currencyDisplay: 'narrowSymbol',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Australia/Sydney',
});

const dateFormatter = new Intl.DateTimeFormat('en-AU', {
  dateStyle: 'long',
  timeZone: 'Australia/Sydney',
});

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

/** Returns null when there is no price, so callers can show an "ask for price" prompt instead. */
export function formatPrice(priceAud: number | null): string | null {
  return priceAud === null ? null : priceFormatter.format(priceAud);
}

export function formatDateTime(isoDate: string): string {
  return dateTimeFormatter.format(new Date(isoDate));
}

/** Converts an Australian phone number such as "02 4957 8574" into a tel: link. */
export function toTelHref(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');

  if (trimmed.startsWith('+')) return `tel:+${digits}`;
  if (digits.startsWith('0')) return `tel:+61${digits.slice(1)}`;

  return `tel:${digits}`;
}
