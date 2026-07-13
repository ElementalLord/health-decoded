const DEFAULT_AUTHENTICATED_DESTINATION = "/account";

export function getSafeRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_DESTINATION;
  }

  try {
    const destination = new URL(value, "https://health-decoded.local");

    return destination.origin === "https://health-decoded.local"
      ? `${destination.pathname}${destination.search}${destination.hash}`
      : DEFAULT_AUTHENTICATED_DESTINATION;
  } catch {
    return DEFAULT_AUTHENTICATED_DESTINATION;
  }
}

export { DEFAULT_AUTHENTICATED_DESTINATION };
