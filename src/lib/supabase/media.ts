import 'server-only';

import { MEDIA_BUCKET } from '@/constants/media';
import { getPublicEnv } from '@/lib/env/public';

/** Builds the public CDN URL for an object stored in the site-media bucket. */
export function getMediaUrl(path: string | null): string | null {
  if (!path) return null;

  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');

  return `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${encodedPath}`;
}
