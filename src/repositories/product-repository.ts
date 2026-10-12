import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/constants/cache';
import { getPublicSupabaseClient } from '@/lib/supabase/public-client';
import type { ProductValues } from '@/lib/validations/content';
import { databaseError } from '@/repositories/db-error';
import type { Database } from '@/types/database';
import type { Product, ProductCategory, ProductWithCategory } from '@/types/content';

const PRODUCT_TAGS = [CACHE_TAGS.products, CACHE_TAGS.productCategories];

/** Published products whose category is also published. Uncategorised items never reach the shop. */
export const listPublishedProducts = unstable_cache(
  async (): Promise<ProductWithCategory[]> => {
    const client = getPublicSupabaseClient();
    const [productsResult, categoriesResult] = await Promise.all([
      client
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true }),
      client.from('product_categories').select('*').eq('is_published', true),
    ]);

    if (productsResult.error) throw databaseError(productsResult.error, 'products.listPublished');
    if (categoriesResult.error) {
      throw databaseError(categoriesResult.error, 'product_categories.listPublishedForProducts');
    }

    return attachCategories(productsResult.data, categoriesResult.data).filter(
      (product) => product.category !== null,
    );
  },
  ['products', 'list-published'],
  { tags: PRODUCT_TAGS, revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getPublishedProductBySlug = unstable_cache(
  async (slug: string): Promise<ProductWithCategory | null> => {
    const client = getPublicSupabaseClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw databaseError(error, 'products.getPublishedBySlug');
    if (!data) return null;

    const { data: category, error: categoryError } = await client
      .from('product_categories')
      .select('*')
      .eq('id', data.category_id)
      .eq('is_published', true)
      .maybeSingle();

    if (categoryError) {
      throw databaseError(categoryError, 'product_categories.getForProduct');
    }

    return category ? { ...data, category } : null;
  },
  ['products', 'by-slug'],
  { tags: PRODUCT_TAGS, revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listAllProducts(
  client: SupabaseClient<Database>,
): Promise<ProductWithCategory[]> {
  const [productsResult, categoriesResult] = await Promise.all([
    client
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    client.from('product_categories').select('*'),
  ]);

  if (productsResult.error) throw databaseError(productsResult.error, 'products.listAll');
  if (categoriesResult.error) {
    throw databaseError(categoriesResult.error, 'product_categories.listAllForProducts');
  }

  return attachCategories(productsResult.data, categoriesResult.data);
}

export async function getProductById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<Product | null> {
  const { data, error } = await client.from('products').select('*').eq('id', id).maybeSingle();

  if (error) throw databaseError(error, 'products.getById');

  return data;
}

export async function saveProduct(
  client: SupabaseClient<Database>,
  values: ProductValues,
  id: string | null,
): Promise<Product> {
  const payload = {
    category_id: values.categoryId,
    slug: values.slug,
    name: values.name,
    summary: values.summary,
    description: values.description,
    price_aud: values.priceAud,
    image_path: values.imagePath,
    is_featured: values.isFeatured,
    is_published: values.isPublished,
    sort_order: values.sortOrder,
  };

  const query = id
    ? client.from('products').update(payload).eq('id', id)
    : client.from('products').insert(payload);

  const { data, error } = await query.select('*').single();

  if (error) throw databaseError(error, id ? 'products.update' : 'products.insert');

  return data;
}

function attachCategories(
  products: Product[],
  categories: ProductCategory[],
): ProductWithCategory[] {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return products.map((product) => ({
    ...product,
    category: categoriesById.get(product.category_id) ?? null,
  }));
}
