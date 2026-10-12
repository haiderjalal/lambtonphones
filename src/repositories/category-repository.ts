import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/constants/cache';
import { getPublicSupabaseClient } from '@/lib/supabase/public-client';
import type { CategoryValues } from '@/lib/validations/content';
import { databaseError } from '@/repositories/db-error';
import type { Database } from '@/types/database';
import type { ProductCategory } from '@/types/content';

export const listPublishedCategories = unstable_cache(
  async (): Promise<ProductCategory[]> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('product_categories')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw databaseError(error, 'product_categories.listPublished');

    return data;
  },
  ['product-categories', 'list-published'],
  { tags: [CACHE_TAGS.productCategories], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listAllCategories(
  client: SupabaseClient<Database>,
): Promise<ProductCategory[]> {
  const { data, error } = await client
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw databaseError(error, 'product_categories.listAll');

  return data;
}

export async function getCategoryById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<ProductCategory | null> {
  const { data, error } = await client
    .from('product_categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw databaseError(error, 'product_categories.getById');

  return data;
}

export async function saveCategory(
  client: SupabaseClient<Database>,
  values: CategoryValues,
  id: string | null,
): Promise<ProductCategory> {
  const payload = {
    name: values.name,
    slug: values.slug,
    description: values.description,
    icon: values.icon,
    sort_order: values.sortOrder,
    is_published: values.isPublished,
  };

  const query = id
    ? client.from('product_categories').update(payload).eq('id', id)
    : client.from('product_categories').insert(payload);

  const { data, error } = await query.select('*').single();

  if (error)
    throw databaseError(error, id ? 'product_categories.update' : 'product_categories.insert');

  return data;
}
