import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const legacyRouteSource = await readFile(
  new URL("../app/(app)/caregiver/[slug]/page.tsx", import.meta.url),
  "utf8",
);

test("known legacy caregiver articles redirect while unknown slugs use ordinary not-found behavior", () => {
  assert.match(legacyRouteSource, /getPublishedCaregiverArticle\(slug\)/);
  assert.match(
    legacyRouteSource,
    /if \(!article\.ok && article\.error\.code === "not_found"\) notFound\(\)/,
  );
  assert.match(legacyRouteSource, /redirect\("\/caregiver"\)/);
  assert.doesNotMatch(legacyRouteSource, /components\/caregiver-article|<CaregiverArticle\b/);
});
