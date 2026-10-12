import { describe, expect, it } from 'vitest';

import { detectImageMimeType } from '@/lib/security/image-signature';

const encoder = new TextEncoder();

describe('detectImageMimeType', () => {
  it('recognises JPEG, PNG, WebP and AVIF from their leading bytes', () => {
    expect(detectImageMimeType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
    expect(
      detectImageMimeType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    ).toBe('image/png');
    expect(detectImageMimeType(encoder.encode('RIFF\u0000\u0000\u0000\u0000WEBPVP8 '))).toBe(
      'image/webp',
    );
    expect(detectImageMimeType(encoder.encode('\u0000\u0000\u0000\u0018ftypavif'))).toBe(
      'image/avif',
    );
  });

  it('rejects content that only claims to be an image', () => {
    expect(detectImageMimeType(encoder.encode('<script>alert(1)</script>'))).toBeNull();
    expect(detectImageMimeType(new Uint8Array())).toBeNull();
  });
});
