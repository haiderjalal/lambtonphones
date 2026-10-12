/** Australian states and territories accepted in the business address. */
export const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'] as const;

export type AuState = (typeof AU_STATES)[number];

/** Limits for the enquiry anti-spam check. Counted per hashed client IP. */
export const ENQUIRY_RATE_LIMIT = {
  windowMinutes: 15,
  maxSubmissions: 5,
} as const;
