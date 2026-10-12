import 'server-only';

import { createHmac } from 'node:crypto';

/**
 * Keyed hash of a client IP. The secret stops anyone who gets the database from reversing the
 * hashes back to addresses, while still letting us count repeat submissions.
 */
export function hashClientIp(ip: string, secret: string): string {
  return createHmac('sha256', secret).update(ip).digest('hex');
}
