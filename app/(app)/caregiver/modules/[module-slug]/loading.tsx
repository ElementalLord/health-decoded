import { caregiverModule2 } from "@/features/caregiver/content/caregiver-module-2";
import styles from "@/features/caregiver/styles/caregiver-module-2.module.css";

export default function CaregiverModuleLoading() {
  return (
    <main className={styles.routeState} aria-live="polite" aria-busy="true">
      <p className={styles.eyebrow}>{caregiverModule2.sections.opening.eyebrow}</p>
      <h1>{caregiverModule2.sections.opening.title}</h1>
      <p>{caregiverModule2.sections.opening.opening}</p>
    </main>
  );
}
