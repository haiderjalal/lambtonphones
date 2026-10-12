import 'server-only';

import { z } from 'zod';

import { parseEnv } from '@/lib/env/parse-env';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type PublicEnv = z.output<typeof publicEnvSchema>;

let cachedPublicEnv: PublicEnv | undefined;

/**
 * Browser-safe configuration, validated once per server process.
 * Note: process.env keys must be referenced literally so Next.js can inline NEXT_PUBLIC_ values.
 */
export function getPublicEnv(): PublicEnv {
  cachedPublicEnv ??= parseEnv(
    publicEnvSchema,
    {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    'public',
  );

  return cachedPublicEnv;
}
