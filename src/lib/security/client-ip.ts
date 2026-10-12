import 'server-only';

const MAX_IP_LENGTH = 64;

/**
 * Best-effort client address for rate limiting. Behind Vercel the first x-forwarded-for entry is
 * the visitor. Anything unexpected falls back to a shared bucket rather than trusting the value.
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const candidate = forwardedFor || headers.get('x-real-ip')?.trim() || '';

  return candidate.length > 0 && candidate.length <= MAX_IP_LENGTH ? candidate : 'unknown';
}
