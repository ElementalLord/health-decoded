import type { GlossarySource } from "@/features/glossary/types/medical-glossary";

export const glossarySources: readonly GlossarySource[] = [
  {
    id: "SRC-ADA-TERMS",
    organization: "American Diabetes Association",
    title: "Diabetes-related common terms",
    url: "https://diabetes.org/about-diabetes/common-terms",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-NIDDK-OVERVIEW",
    organization: "National Institute of Diabetes and Digestive and Kidney Diseases",
    title: "Diabetes overview",
    url: "https://www.niddk.nih.gov/health-information/diabetes/overview",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-NIDDK-TESTS",
    organization: "National Institute of Diabetes and Digestive and Kidney Diseases",
    title: "Diabetes tests and diagnosis",
    url: "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-NIDDK-KIDNEY",
    organization: "National Institute of Diabetes and Digestive and Kidney Diseases",
    title: "Diabetic kidney disease",
    url: "https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-kidney-disease",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-CDC-PLAIN",
    organization: "Centers for Disease Control and Prevention",
    title: "DSMES plain-language glossary",
    url: "https://www.cdc.gov/diabetes-toolkit/php/health-literacy-tool/glossary.html",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-CDC-DSMES",
    organization: "Centers for Disease Control and Prevention",
    title: "Diabetes self-management education and support",
    url: "https://www.cdc.gov/diabetes/education-support-programs/index.html",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-CDC-MENTAL",
    organization: "Centers for Disease Control and Prevention",
    title: "Diabetes and mental health",
    url: "https://www.cdc.gov/diabetes/living-with/mental-health.html",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-FDA-MEDS",
    organization: "U.S. Food and Drug Administration",
    title: "Diabetes medicines",
    url: "https://www.fda.gov/files/for%20consumers/published/Diabetes-Medicines.pdf",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-CMS-TERMS",
    organization: "Centers for Medicare & Medicaid Services",
    title: "Health insurance terms",
    url: "https://www.cms.gov/medical-bill-rights/help/guides/health-insurance-terms",
    reviewedAt: "2026-08-02",
  },
  {
    id: "SRC-HD-LESSONS",
    organization: "Health Decoded",
    title: "Approved learner-facing curriculum glossary content",
    url: "internal://health-decoded/lessons",
    reviewedAt: "2026-08-02",
  },
] as const;
