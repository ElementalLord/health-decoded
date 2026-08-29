import type { ReactNode } from "react";

import { PageHeader } from "@/components/shared/page-header";

type LegalPageProps = {
  children: ReactNode;
  lastUpdated: string;
  title: string;
};

export function LegalPage({ children, lastUpdated, title }: LegalPageProps) {
  return (
    <article className="mx-auto max-w-4xl px-5 py-14 sm:px-10 sm:py-20 lg:px-14">
      <PageHeader eyebrow="Health Decoded" title={title} />
      <p className="mt-5 text-sm font-semibold text-muted-foreground">
        Last Updated: {lastUpdated}
      </p>
      <div className="mt-12 space-y-10 text-[length:var(--text-body)] leading-8 text-[#493a32]">
        {children}
      </div>
    </article>
  );
}

export function LegalSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-5">
      <h2 className="font-serif-display text-3xl font-medium leading-tight text-[#382c26] sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LegalSubsection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-bold leading-6 text-[#382c26]">{title}</h3>
      {children}
    </section>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1 pl-6 marker:text-[#b96c55]">{children}</ul>;
}
