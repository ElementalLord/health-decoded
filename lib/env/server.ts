import { getPublicEnv } from "@/lib/env/public";

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("Server environment variables cannot be accessed in the browser.");
  }

  return getPublicEnv();
}
