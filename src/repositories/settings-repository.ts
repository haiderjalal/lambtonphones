import 'server-only';

import { unstable_cache } from 'next/cache';

import { CACHE_TAGS, CONTENT_REVALIDATE_SECONDS } from '@/constants/cache';
import { databaseError } from '@/repositories/db-error';
import { getPublicSupabaseClient } from '@/lib/supabase/public-client';
import type { SiteSettingsValues } from '@/lib/validations/content';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { SiteSettings } from '@/types/content';

const SETTINGS_ROW_ID = 1;

export const getPublishedSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const { data, error } = await getPublicSupabaseClient()
      .from('site_settings')
      .select('*')
      .eq('id', SETTINGS_ROW_ID)
      .single();

    if (error) throw databaseError(error, 'site_settings.get');

    return data;
  },
  ['site-settings', 'published'],
  { tags: [CACHE_TAGS.siteSettings], revalidate: CONTENT_REVALIDATE_SECONDS },
);

export async function getSiteSettingsForAdmin(
  client: SupabaseClient<Database>,
): Promise<SiteSettings> {
  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .eq('id', SETTINGS_ROW_ID)
    .single();

  if (error) throw databaseError(error, 'site_settings.getForAdmin');

  return data;
}

export async function updateSiteSettings(
  client: SupabaseClient<Database>,
  values: SiteSettingsValues,
): Promise<SiteSettings> {
  const hasAnnouncement = values.announcementActive && values.announcementText.length > 0;

  const { data, error } = await client
    .from('site_settings')
    .update({
      business_name: values.businessName,
      tagline: values.tagline,
      phone: values.phone,
      email: values.email,
      street_address: values.streetAddress,
      suburb: values.suburb,
      state: values.state,
      postcode: values.postcode,
      maps_url: values.mapsUrl,
      facebook_url: values.facebookUrl,
      instagram_url: values.instagramUrl,
      hero_heading: values.heroHeading,
      hero_subheading: values.heroSubheading,
      announcement_text: values.announcementText || null,
      announcement_active: hasAnnouncement,
      opening_hours: values.openingHours,
      trust_highlights: values.trustHighlights,
    })
    .eq('id', SETTINGS_ROW_ID)
    .select('*')
    .single();

  if (error) throw databaseError(error, 'site_settings.update');

  return data;
}
