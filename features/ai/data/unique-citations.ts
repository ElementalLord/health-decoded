/** Several knowledge entries can cite the same page. Keep the first citation
 * in answer order so the UI has one stable row per source URL. */
export function uniqueCitations<T extends { readonly href: string }>(sources: readonly T[]): T[] {
  const seen = new Set<string>();
  return sources.filter(({ href }) => {
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}
