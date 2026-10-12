import { describe, expect, it } from 'vitest';

import { hashClientIp } from '@/lib/security/ip-hash';

const SECRET = 'test-secret-that-is-long-enough-to-use';

describe('hashClientIp', () => {
  it('returns the same hash for the same address and secret', () => {
    expect(hashClientIp('203.0.113.10', SECRET)).toBe(hashClientIp('203.0.113.10', SECRET));
  });

  it('changes when the secret changes, so hashes cannot be matched across environments', () => {
    expect(hashClientIp('203.0.113.10', SECRET)).not.toBe(
      hashClientIp('203.0.113.10', 'another-secret-that-is-also-long-enough'),
    );
  });

  it('never returns the raw address', () => {
    const hash = hashClientIp('203.0.113.10', SECRET);

    expect(hash).toHaveLength(64);
    expect(hash).not.toContain('203.0.113.10');
  });
});
