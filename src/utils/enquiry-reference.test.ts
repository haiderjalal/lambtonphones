import { describe, expect, it } from 'vitest';

import { createEnquiryReference } from '@/utils/enquiry-reference';

describe('createEnquiryReference', () => {
  it('uses the last character of the alphabet when every pick is at the maximum', () => {
    expect(createEnquiryReference((max) => max - 1)).toBe('LP-99999999');
  });

  it('only uses characters that are easy to read back over the phone', () => {
    let step = 0;
    const reference = createEnquiryReference((max) => {
      step = (step * 7 + 3) % max;
      return step;
    });

    expect(reference).toMatch(/^LP-[A-HJ-NP-Z2-9]{8}$/);
  });
});
