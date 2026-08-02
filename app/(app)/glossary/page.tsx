import { MedicalGlossaryPage } from "@/features/glossary/components/medical-glossary-page";

export const metadata = {
  title: "Medical Glossary",
  description: "Plain-language definitions for common diabetes and health-care terms.",
};

export default function GlossaryRoute() {
  return <MedicalGlossaryPage />;
}
