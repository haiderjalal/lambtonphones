import 'server-only';

const MAX_IP_LENGTH = 64;

/**
 * Best-effort client address for rate limiting. Each proxy appends the address it received to
 * x-forwarded-for, so the last entry is the one the platform saw. The first entry comes from the
 * visitor and could change on every request, so it is never trusted. Anything unexpected falls back
 * to a shared bucket rather than trusting the value.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers
    .get('x-forwarded-for')
    ?.split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .at(-1);
  const candidate = forwardedFor || headers.get('x-real-ip')?.trim() || '';

  return candidate.length > 0 && candidate.length <= MAX_IP_LENGTH ? candidate : 'unknown';
}
