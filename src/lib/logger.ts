/* eslint-disable no-console -- this module is the single place that writes structured logs */

type LogLevel = 'info' | 'warn' | 'error';

/** Only primitives are accepted, so objects (and personal data nested inside them) cannot leak in. */
export type LogContext = Record<string, string | number | boolean | null | undefined>;

function describeError(error: unknown): LogContext {
  if (error instanceof Error) {
    return { errorName: error.name, errorMessage: error.message };
  }

  // Supabase/PostgREST errors are plain objects. Their messages can echo row values, so only the code is kept.
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return { errorName: 'DatabaseError', errorCode: String(error.code) };
  }

  return { errorName: 'UnknownError' };
}

function write(level: LogLevel, event: string, context: LogContext = {}): void {
  const entry = JSON.stringify({ level, event, time: new Date().toISOString(), ...context });

  if (level === 'error') {
    console.error(entry);
  } else if (level === 'warn') {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}

export const logger = {
  info(event: string, context?: LogContext): void {
    write('info', event, context);
  },
  warn(event: string, context?: LogContext): void {
    write('warn', event, context);
  },
  error(event: string, error: unknown, context?: LogContext): void {
    write('error', event, { ...context, ...describeError(error) });
  },
};
