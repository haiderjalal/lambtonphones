import { describe, expect, it } from 'vitest';

import { getClientIp } from '@/lib/security/client-ip';

function headersWith(init: Record<string, string>): Headers {
  return new Headers(init);
}

describe('getClientIp', () => {
  it('uses the last x-forwarded-for entry, which the platform appends', () => {
    expect(getClientIp(headersWith({ 'x-forwarded-for': '203.0.113.7' }))).toBe('203.0.113.7');
    expect(getClientIp(headersWith({ 'x-forwarded-for': '198.51.100.9, 203.0.113.7' }))).toBe(
      '203.0.113.7',
    );
  });

  it('ignores a leftmost entry that a visitor supplied to dodge the rate limit', () => {
    const spoofed = headersWith({ 'x-forwarded-for': '10.0.0.1, 10.0.0.2, 203.0.113.7' });

    expect(getClientIp(spoofed)).toBe('203.0.113.7');
  });

  it('falls back to x-real-ip when there is no forwarded header', () => {
    expect(getClientIp(headersWith({ 'x-real-ip': '203.0.113.8' }))).toBe('203.0.113.8');
  });

  it('uses a shared bucket when no usable address is present', () => {
    expect(getClientIp(new Headers())).toBe('unknown');
    expect(getClientIp(headersWith({ 'x-forwarded-for': ' , ' }))).toBe('unknown');
    expect(getClientIp(headersWith({ 'x-forwarded-for': 'a'.repeat(65) }))).toBe('unknown');
  });
});
