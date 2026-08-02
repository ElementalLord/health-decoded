import { AppointmentPrepPage } from "@/features/appointment-prep/components/appointment-prep-page";

export const metadata = {
  title: "Appointment preparation",
  description: "A session-only workspace for organizing an appointment conversation.",
};

export default function AppointmentPreparationRoute() {
  return <AppointmentPrepPage />;
}
