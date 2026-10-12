import type { MediaMimeType } from '@/constants/media';

/**
 * Identifies an image from its leading bytes. Uploads are never trusted by file name or the
 * browser-supplied MIME type, because either can be forged.
 */
export function detectImageMimeType(bytes: Uint8Array): MediaMimeType | null {
  if (startsWithBytes(bytes, [0xff, 0xd8, 0xff])) {
    return 'image/jpeg';
  }

  if (startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return 'image/png';
  }

  if (readAscii(bytes, 0, 4) === 'RIFF' && readAscii(bytes, 8, 12) === 'WEBP') {
    return 'image/webp';
  }

  const brand = readAscii(bytes, 8, 12);
  if (readAscii(bytes, 4, 8) === 'ftyp' && (brand === 'avif' || brand === 'avis')) {
    return 'image/avif';
  }

  return null;
}

function startsWithBytes(bytes: Uint8Array, expected: readonly number[]): boolean {
  return expected.every((value, index) => bytes[index] === value);
}

function readAscii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end));
}
