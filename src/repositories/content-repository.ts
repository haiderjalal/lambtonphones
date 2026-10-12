import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/constants/cache';
import { getPublicSupabaseClient } from '@/lib/supabase/public-client';
import type { BlogPostValues, ContentPageValues, FaqValues } from '@/lib/validations/content';
import { databaseError } from '@/repositories/db-error';
import type { Database } from '@/types/database';
import type { BlogPost, ContentPage, Faq } from '@/types/content';

// Blog, FAQ and long-form page data. Each block is one table with public reads and admin writes.

/* ---------- Blog posts ---------- */

export const listPublishedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw databaseError(error, 'blog_posts.listPublished');

    return data;
  },
  ['blog-posts', 'list-published'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export const getPublishedBlogPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw databaseError(error, 'blog_posts.getPublishedBySlug');

    return data;
  },
  ['blog-posts', 'by-slug'],
  { tags: [CACHE_TAGS.blogPosts], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listAllBlogPosts(client: SupabaseClient<Database>): Promise<BlogPost[]> {
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw databaseError(error, 'blog_posts.listAll');

  return data;
}

export async function getBlogPostById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<BlogPost | null> {
  const { data, error } = await client.from('blog_posts').select('*').eq('id', id).maybeSingle();

  if (error) throw databaseError(error, 'blog_posts.getById');

  return data;
}

/** `publishedAt` is set once, on the first publish, so the original date survives later edits. */
export async function saveBlogPost(
  client: SupabaseClient<Database>,
  values: BlogPostValues,
  id: string | null,
  publishedAt: string | null,
): Promise<BlogPost> {
  const payload = {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    body: values.body,
    cover_image_path: values.coverImagePath,
    is_published: values.isPublished,
    published_at: values.isPublished ? publishedAt : null,
  };

  const query = id
    ? client.from('blog_posts').update(payload).eq('id', id)
    : client.from('blog_posts').insert(payload);

  const { data, error } = await query.select('*').single();

  if (error) throw databaseError(error, id ? 'blog_posts.update' : 'blog_posts.insert');

  return data;
}

/* ---------- FAQs ---------- */

export const listPublishedFaqs = unstable_cache(
  async (): Promise<Faq[]> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('faqs')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw databaseError(error, 'faqs.listPublished');

    return data;
  },
  ['faqs', 'list-published'],
  { tags: [CACHE_TAGS.faqs], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listAllFaqs(client: SupabaseClient<Database>): Promise<Faq[]> {
  const { data, error } = await client
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw databaseError(error, 'faqs.listAll');

  return data;
}

export async function getFaqById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<Faq | null> {
  const { data, error } = await client.from('faqs').select('*').eq('id', id).maybeSingle();

  if (error) throw databaseError(error, 'faqs.getById');

  return data;
}

export async function saveFaq(
  client: SupabaseClient<Database>,
  values: FaqValues,
  id: string | null,
): Promise<Faq> {
  const payload = {
    question: values.question,
    answer: values.answer,
    sort_order: values.sortOrder,
    is_published: values.isPublished,
  };

  const query = id
    ? client.from('faqs').update(payload).eq('id', id)
    : client.from('faqs').insert(payload);

  const { data, error } = await query.select('*').single();

  if (error) throw databaseError(error, id ? 'faqs.update' : 'faqs.insert');

  return data;
}

/* ---------- Content pages (about, privacy, terms) ---------- */

export const getPublishedPageBySlug = unstable_cache(
  async (slug: string): Promise<ContentPage | null> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle();

    if (error) throw databaseError(error, 'pages.getPublishedBySlug');

    return data;
  },
  ['pages', 'by-slug'],
  { tags: [CACHE_TAGS.pages], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function listAllPages(client: SupabaseClient<Database>): Promise<ContentPage[]> {
  const { data, error } = await client
    .from('pages')
    .select('*')
    .order('title', { ascending: true });

  if (error) throw databaseError(error, 'pages.listAll');

  return data;
}

export async function getPageById(
  client: SupabaseClient<Database>,
  id: string,
): Promise<ContentPage | null> {
  const { data, error } = await client.from('pages').select('*').eq('id', id).maybeSingle();

  if (error) throw databaseError(error, 'pages.getById');

  return data;
}

export async function savePage(
  client: SupabaseClient<Database>,
  values: ContentPageValues,
  id: string | null,
): Promise<ContentPage> {
  const payload = {
    title: values.title,
    slug: values.slug,
    meta_description: values.metaDescription,
    body: values.body,
    is_published: values.isPublished,
  };

  const query = id
    ? client.from('pages').update(payload).eq('id', id)
    : client.from('pages').insert(payload);

  const { data, error } = await query.select('*').single();

  if (error) throw databaseError(error, id ? 'pages.update' : 'pages.insert');

  return data;
}
