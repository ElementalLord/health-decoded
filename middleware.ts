import type { NextRequest } from "next/server";

import { refreshSession } from "@/services/supabase/middleware";

// Refreshes Supabase cookies for application and auth requests. Static assets are excluded.
export async function middleware(request: NextRequest) { return refreshSession(request); }

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
