import { MedicalGlossaryPage } from "@/features/glossary/components/medical-glossary-page";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = {
  title: "Medical Glossary",
  description: "Plain-language definitions for common diabetes and health-care terms.",
  icons: sectionIcons("library"),
};

export default function GlossaryRoute() {
  return <MedicalGlossaryPage />;
}
