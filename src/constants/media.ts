export const MEDIA_BUCKET = 'site-media';

export const MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export const MEDIA_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

export type MediaMimeType = (typeof MEDIA_MIME_TYPES)[number];

/** File extensions are derived from the detected content type, never from the uploaded file name. */
export const MEDIA_EXTENSIONS: Record<MediaMimeType, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
