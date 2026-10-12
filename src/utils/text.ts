// Control characters (except tab, newline and carriage return) have no place in customer text.
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function stripControlCharacters(value: string): string {
  return value.replace(CONTROL_CHARACTERS, '');
}

/** Collapses text onto one line. Required for values that end up in email headers. */
export function toSingleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim();
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Splits a textarea value into trimmed, non-empty lines (used for highlights and opening hours). */
export function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function joinLines(values: readonly string[]): string {
  return values.join('\n');
}
