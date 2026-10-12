import { describe, expect, it } from 'vitest';

import { formatPrice, toTelHref } from '@/utils/format';

describe('formatPrice', () => {
  it('returns null when a product has no price', () => {
    expect(formatPrice(null)).toBeNull();
  });

  it('formats whole and fractional Australian dollar amounts', () => {
    expect(formatPrice(65)).toBe('$65');
    expect(formatPrice(49.95)).toBe('$49.95');
  });
});

describe('toTelHref', () => {
  it('converts an Australian national number to an international tel link', () => {
    expect(toTelHref('02 4957 8574')).toBe('tel:+61249578574');
  });

  it('keeps an existing country code', () => {
    expect(toTelHref('+61 2 4957 8574')).toBe('tel:+61249578574');
  });
});
