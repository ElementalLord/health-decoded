import { DiabetesMythCheck } from "@/features/mythbusters/components/diabetes-myth-check";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = {
  title: "Diabetes Myth Check",
  description: "Test common diabetes claims and learn what the evidence actually says.",
  icons: sectionIcons("tools"),
};

export default function MythCheckRoute() {
  return <DiabetesMythCheck />;
}
