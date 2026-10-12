import type { z } from 'zod';

/**
 * Validates environment variables and fails fast with the variable names (never the values).
 * Failing at startup or build time is preferable to a confusing runtime error on a customer page.
 */
export function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  source: Record<string, string | undefined>,
  scope: string,
): z.output<TSchema> {
  const result = schema.safeParse(source);

  if (!result.success) {
    const names = [
      ...new Set(result.error.issues.map((issue) => String(issue.path[0] ?? 'unknown'))),
    ];
    throw new Error(
      `Invalid ${scope} environment configuration. Check: ${names.join(', ')} (see .env.example).`,
    );
  }

  return result.data;
}
