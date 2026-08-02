import { careAndEmotionalTerms } from "@/features/glossary/content/terms/care-emotional";
import { foundationTerms } from "@/features/glossary/content/terms/foundations";
import { insuranceAndAppointmentTerms } from "@/features/glossary/content/terms/insurance-appointments";
import { medicineTerms } from "@/features/glossary/content/terms/medicines";
import { nutritionAndActivityTerms } from "@/features/glossary/content/terms/nutrition-activity";
import { testAndMonitoringTerms } from "@/features/glossary/content/terms/tests-monitoring";
import { urgentAndLongTermTerms } from "@/features/glossary/content/terms/urgent-long-term";

export const medicalGlossary = [
  ...foundationTerms,
  ...testAndMonitoringTerms,
  ...medicineTerms,
  ...nutritionAndActivityTerms,
  ...urgentAndLongTermTerms,
  ...careAndEmotionalTerms,
  ...insuranceAndAppointmentTerms,
].sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));

export const glossaryLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
export const availableGlossaryLetters = new Set(
  medicalGlossary.map((entry) => entry.term.charAt(0).toUpperCase()),
);
