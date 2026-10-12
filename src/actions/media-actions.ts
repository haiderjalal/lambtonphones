'use server';

import { getMediaUrl } from '@/lib/supabase/media';
import { logger } from '@/lib/logger';
import { MediaValidationError, uploadImage, type MediaFolder } from '@/services/media-service';
import { getAdminContext } from '@/services/admin-auth-service';
import type { ActionResult } from '@/types/action-result';

const MEDIA_FOLDERS: readonly MediaFolder[] = ['products', 'blog'];

export interface UploadedImage {
  path: string;
  url: string;
}

/** Admin-only image upload. Returns the stored path, which forms save alongside the record. */
export async function uploadImageAction(formData: FormData): Promise<ActionResult<UploadedImage>> {
  const admin = await getAdminContext();

  if (!admin) {
    return { ok: false, message: 'Sign in as an administrator to upload images.' };
  }

  const folder = formData.get('folder');
  const file = formData.get('file');

  if (typeof folder !== 'string' || !MEDIA_FOLDERS.includes(folder as MediaFolder)) {
    return { ok: false, message: 'Choose where this image belongs and try again.' };
  }

  if (!(file instanceof File)) {
    return { ok: false, message: 'Choose an image to upload.' };
  }

  try {
    const path = await uploadImage(admin.client, file, folder as MediaFolder);
    const url = getMediaUrl(path) ?? '';

    return { ok: true, message: 'Image uploaded.', data: { path, url } };
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return { ok: false, message: error.message };
    }

    logger.error('media.upload_action_failed', error);

    return { ok: false, message: 'The image could not be uploaded. Please try again.' };
  }
}
