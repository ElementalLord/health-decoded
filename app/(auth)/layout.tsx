import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <PageContainer className="py-10 sm:py-16">{children}</PageContainer>;
}
