import 'server-only';

import { revalidatePath, updateTag } from 'next/cache';

import type { CacheTag } from '@/constants/cache';

/**
 * Expires cached public content after an admin save. Call only from Server Actions.
 * updateTag makes the next visitor see the change immediately. The layout-wide revalidation
 * also refreshes prerendered pages that were built from the affected data.
 */
export function invalidatePublicContent(tags: readonly CacheTag[]): void {
  for (const tag of tags) {
    updateTag(tag);
  }

  revalidatePath('/', 'layout');
}
