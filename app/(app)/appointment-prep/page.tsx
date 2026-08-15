import { AppointmentPrepPage } from "@/features/appointment-prep/components/appointment-prep-page";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = {
  title: "Appointment preparation",
  description: "A session-only workspace for organizing an appointment conversation.",
  icons: sectionIcons("tools"),
};

export default function AppointmentPreparationRoute() {
  return <AppointmentPrepPage />;
}
