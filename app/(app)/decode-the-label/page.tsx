import { DecodeTheLabelExperience } from "@/features/decode-the-label/components/decode-the-label-experience";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = {
  title: "Decode the Label",
  description: "Practice reading nutrition labels with calm, practical guidance.",
  icons: sectionIcons("tools"),
};

export default function DecodeTheLabelPage() {
  return <DecodeTheLabelExperience />;
}
