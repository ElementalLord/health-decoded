import type { Metadata } from "next";
import type { ReactNode } from "react";

import styles from "@/features/caregiver/styles/caregiver-landing.module.css";

export const metadata: Metadata = {
  title: "Support Someone You Care About",
  description:
    "Diabetes can affect routines, conversations, plans, and the space between two people. This section helps you offer support that is useful, respectful, and easier to revise when needs change.",
};

export default function CaregiverLayout({ children }: { children: ReactNode }) {
  return <div className={styles.routeFrame}>{children}</div>;
}
