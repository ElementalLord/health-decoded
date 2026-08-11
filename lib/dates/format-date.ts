type SafeDateValue = Date | number | string | null | undefined;

export function formatDateSafely(
  value: SafeDateValue,
  options?: Intl.DateTimeFormatOptions,
  locale?: Intl.LocalesArgument,
): string | null {
  if (value === null || value === undefined || value === "") return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return null;
  }
}
