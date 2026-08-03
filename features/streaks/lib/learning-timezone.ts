const supportedTimezones = new Set(Intl.supportedValuesOf("timeZone"));
supportedTimezones.add("UTC");

export function isValidIanaTimezone(value: string | null | undefined): value is string {
  return Boolean(value && supportedTimezones.has(value));
}

export function resolveLearningTimezone(
  savedTimezone: string | null | undefined,
  browserTimezone: string | null | undefined,
) {
  if (isValidIanaTimezone(savedTimezone)) return savedTimezone;
  if (isValidIanaTimezone(browserTimezone)) return browserTimezone;
  return "UTC";
}
