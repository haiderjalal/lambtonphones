const MAX_PARAM_LENGTH = 120;

/**
 * Reads a single search parameter. Repeated keys are reduced to the first value, and overlong or
 * empty values are dropped rather than trusted.
 */
export function firstParam(value: string | string[] | undefined): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  const trimmed = candidate?.trim() ?? '';

  return trimmed.length > 0 && trimmed.length <= MAX_PARAM_LENGTH ? trimmed : null;
}
