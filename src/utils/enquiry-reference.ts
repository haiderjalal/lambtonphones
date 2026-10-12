import { randomInt } from 'node:crypto';

import type { EnquiryReference } from '@/constants/enquiry';

// Leaves out 0, O, 1 and I so the reference reads back correctly over the phone.
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const REFERENCE_LENGTH = 8;

export function createEnquiryReference(
  pickIndex: (max: number) => number = (max) => randomInt(max),
): EnquiryReference {
  let suffix = '';

  for (let position = 0; position < REFERENCE_LENGTH; position += 1) {
    suffix += REFERENCE_ALPHABET.charAt(pickIndex(REFERENCE_ALPHABET.length));
  }

  return `LP-${suffix}`;
}
