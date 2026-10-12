import 'server-only';

import { z } from 'zod';

import { parseEnv } from '@/lib/env/parse-env';

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  IP_HASH_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1).optional(),
  ENQUIRY_NOTIFY_EMAIL: z.email().optional(),
  ENQUIRY_FROM_EMAIL: z.email().optional(),
});

export type ServerEnv = z.output<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;

/** Secrets. Only ever read from server code; never import this from a Client Component. */
export function getServerEnv(): ServerEnv {
  cachedServerEnv ??= parseEnv(
    serverEnvSchema,
    {
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      IP_HASH_SECRET: process.env.IP_HASH_SECRET,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ENQUIRY_NOTIFY_EMAIL: process.env.ENQUIRY_NOTIFY_EMAIL,
      ENQUIRY_FROM_EMAIL: process.env.ENQUIRY_FROM_EMAIL,
    },
    'server',
  );

  return cachedServerEnv;
}
