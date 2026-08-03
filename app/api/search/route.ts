import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/features/auth/services/auth.server";
import { searchUniversalIndex } from "@/features/universal-search/services/universal-search.server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  noStore();
  const user = await getAuthenticatedUser();
  if (!user.ok) return NextResponse.json({ results: [] }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ results: [] }, { status: 400 });
  }
  if (
    !body ||
    typeof body !== "object" ||
    !("query" in body) ||
    typeof body.query !== "string" ||
    body.query.length > 100
  ) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }
  const results = await searchUniversalIndex(body.query);
  if (!results) return NextResponse.json({ results: [] }, { status: 503 });
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } },
  );
}
