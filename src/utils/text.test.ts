import { describe, expect, it } from 'vitest';

import { joinLines, slugify, splitLines, stripControlCharacters, toSingleLine } from '@/utils/text';

describe('stripControlCharacters', () => {
  it('removes control characters but keeps tabs and line breaks', () => {
    expect(stripControlCharacters('Hello\u0000 world\u0007\n\tnext')).toBe('Hello world\n\tnext');
  });
});

describe('slugify', () => {
  it('produces lowercase hyphenated slugs and removes accents', () => {
    expect(slugify('  Tempered Glass — Café Edition!  ')).toBe('tempered-glass-cafe-edition');
  });

  it('limits slugs to 80 characters', () => {
    expect(slugify('a'.repeat(200))).toHaveLength(80);
  });
});

describe('splitLines and joinLines', () => {
  it('trims each line and drops blank lines', () => {
    expect(splitLines(' one \r\n\n two \n')).toEqual(['one', 'two']);
  });

  it('joins lines back into a textarea value', () => {
    expect(joinLines(['a', 'b'])).toBe('a\nb');
  });
});

describe('toSingleLine', () => {
  it('collapses line breaks so values cannot inject email headers', () => {
    expect(toSingleLine('Subject\r\nBcc: someone@example.com')).toBe(
      'Subject Bcc: someone@example.com',
    );
  });
});
