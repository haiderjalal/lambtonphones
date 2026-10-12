import 'server-only';

import type { PostgrestError } from '@supabase/supabase-js';

import { logger } from '@/lib/logger';

export class DatabaseError extends Error {
  constructor(operation: string, cause: PostgrestError) {
    super(`Database operation failed: ${operation}`, { cause });
    this.name = 'DatabaseError';
  }
}

/**
 * Raised when a row that the site cannot run without is missing. The usual cause is that
 * supabase/seed.sql has not been run in the Supabase project, so the message says what to do.
 */
export class MissingSeedDataError extends Error {
  constructor(table: string) {
    super(
      `The ${table} table has no starter row. Run supabase/seed.sql in the Supabase SQL Editor, then rebuild.`,
    );
    this.name = 'MissingSeedDataError';
  }
}

/**
 * Logs the failure without row values (PostgREST messages can echo them) and returns an error
 * that is safe to throw. Callers use it as `if (error) throw databaseError(error, 'table.action')`.
 */
export function databaseError(error: PostgrestError, operation: string): DatabaseError {
  logger.error('database.query_failed', error, { operation });
  return new DatabaseError(operation, error);
}
