import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/constants/cache';
import { getPublicSupabaseClient } from '@/lib/supabase/public-client';
import type { ServiceValues } from '@/lib/validations/content';
import { databaseError } from '@/repositories/db-error';
import type { Database } from '@/types/database';
import type { Service } from '@/types/content';

export const listPublishedServices = unstable_cache(
  async (): Promise<Service[]> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw databaseError(error, 'services.listPublished');

    return data;
  },
  ['services', 'list-published'],
  { tags: [CACHE_TAGS.services], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listAllServices(client: SupabaseClient<Database>): Promise<Service[]> {
  const { data, error } = await client
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw databaseError(error, 'services.listAll');

  return data;
}

export async function getServiceById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<Service | null> {
  const { data, error } = await client.from('services').select('*').eq('id', id).maybeSingle();

  if (error) throw databaseError(error, 'services.getById');

  return data;
}

export async function saveService(
  client: SupabaseClient<Database>,
  values: ServiceValues,
  id: string | null,
): Promise<Service> {
  const payload = {
    name: values.name,
    slug: values.slug,
    parent_id: values.parentId,
    summary: values.summary,
    description: values.description,
    highlights: values.highlights,
    icon: values.icon,
    sort_order: values.sortOrder,
    is_published: values.isPublished,
  };

  const query = id
    ? client.from('services').update(payload).eq('id', id)
    : client.from('services').insert(payload);

  const { data, error } = await query.select('*').single();

  if (error) throw databaseError(error, id ? 'services.update' : 'services.insert');

  return data;
}
