import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { CompanionIllustration } from "@/components/illustrations/editorial-illustrations";

import { DemoQrCode } from "./demo-qr-code";
import styles from "./demo.module.css";

export function DemoLanding() {
  return (
    <main className={styles.demoLanding}>
      <header className={styles.demoHeader}>
        <Link href="/">
          <ArrowLeft aria-hidden="true" />
          <span className="font-serif-display">Health Decoded</span>
        </Link>
        <p>Working prototype</p>
      </header>
      <section className={styles.demoLandingHero}>
        <div>
          <p className="editorial-eyebrow">Public product demo</p>
          <h1 className="font-serif-display">See Health Decoded in action.</h1>
          <p>
            A guided pitch and a public sandbox built from the same components used in the product.
            No login, no production records, and no live AI dependency.
          </p>
          <div className={styles.demoLandingActions}>
            <Link className={styles.appButton} href="/demo/present">
              Start presentation <ArrowRight aria-hidden="true" />
            </Link>
            <Link className={styles.appSecondaryButton} href="/demo/explore">
              Explore the product
            </Link>
          </div>
        </div>
        <figure>
          <CompanionIllustration />
          <figcaption>Built for everyday questions</figcaption>
        </figure>
      </section>
      <footer className={styles.demoLandingFooter}>
        <p>
          Health Decoded provides educational information and does not replace professional medical
          advice.
        </p>
        <DemoQrCode compact />
      </footer>
    </main>
  );
}
