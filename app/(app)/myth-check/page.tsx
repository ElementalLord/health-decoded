import { DiabetesMythCheck } from "@/features/mythbusters/components/diabetes-myth-check";

export const metadata = {
  title: "Diabetes Myth Check",
  description: "Test common diabetes claims and learn what the evidence actually says.",
};

export default function MythCheckRoute() {
  return <DiabetesMythCheck />;
}
