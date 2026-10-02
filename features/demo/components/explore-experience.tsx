import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { ProductDemoSurface } from "./product-demo-surface";
import styles from "./demo.module.css";

export function ExploreExperience() {
  return (
    <main className={styles.explorePage}>
      <header className={styles.demoHeader}>
        <Link href="/demo">
          <ArrowLeft aria-hidden="true" />
          <span className="font-serif-display">Health Decoded</span>
        </Link>
        <div>
          <LockKeyhole aria-hidden="true" />
          <span>Public demo · fictional data · no account changes</span>
        </div>
      </header>
      <Suspense fallback={<p className={styles.demoLoading}>Opening the product…</p>}>
        <ProductDemoSurface />
      </Suspense>
    </main>
  );
}
