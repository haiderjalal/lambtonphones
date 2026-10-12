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
 * Logs the failure without row values (PostgREST messages can echo them) and returns an error
 * that is safe to throw. Callers use it as `if (error) throw databaseError(error, 'table.action')`.
 */
export function databaseError(error: PostgrestError, operation: string): DatabaseError {
  logger.error('database.query_failed', error, { operation });
  return new DatabaseError(operation, error);
}
