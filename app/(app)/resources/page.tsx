import { redirect } from "next/navigation";

import { ResourcesList } from "@/features/resources/components/resources";
import styles from "@/features/resources/components/resources.module.css";
import { listReviewedResources } from "@/features/resources/services/resources.server";
import { getCurrentProfile } from "@/features/profile/services/profile.server";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "Resources", icons: sectionIcons("library") };

export default async function ResourcesPage() {
  const profile = await getCurrentProfile();
  if (!profile.ok) redirect("/journey");
  if (!profile.data.onboarding_completed_at) redirect("/onboarding");

  const resources = listReviewedResources();

  return (
    <section className={styles.resourcesPage}>
      <div className={styles.resourcesContent}>
        <ResourcesList resources={resources} />
      </div>
    </section>
  );
}
