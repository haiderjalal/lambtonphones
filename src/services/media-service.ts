import 'server-only';

import { randomUUID } from 'node:crypto';

import type { SupabaseClient } from '@supabase/supabase-js';

import {
  MEDIA_BUCKET,
  MEDIA_EXTENSIONS,
  MEDIA_MAX_BYTES,
  type MediaMimeType,
} from '@/constants/media';
import { logger } from '@/lib/logger';
import { detectImageMimeType } from '@/lib/security/image-signature';
import type { Database } from '@/types/database';

export type MediaFolder = 'products' | 'blog';

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MediaValidationError';
  }
}

/**
 * Validates an image by its size and magic bytes, then stores it under a generated name.
 * The browser's file name and MIME type are never used for storage decisions.
 */
export async function uploadImage(
  client: SupabaseClient<Database>,
  file: File,
  folder: MediaFolder,
): Promise<string> {
  if (file.size === 0) {
    throw new MediaValidationError('The selected file is empty.');
  }

  if (file.size > MEDIA_MAX_BYTES) {
    throw new MediaValidationError('Images must be 5 MB or smaller.');
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = detectImageMimeType(bytes);

  if (!mimeType) {
    throw new MediaValidationError('Upload a JPG, PNG, WebP or AVIF image.');
  }

  const path = `${folder}/${randomUUID()}.${MEDIA_EXTENSIONS[mimeType]}`;
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, bytes, {
    contentType: mimeType satisfies MediaMimeType,
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    logger.error('media.upload_failed', error, { folder });
    throw new Error('Image upload failed.');
  }

  return path;
}
