import { redirect } from "next/navigation";
import { sectionIcons } from "@/lib/section-icons";

export const metadata = { title: "Account", icons: sectionIcons("account") };

export default function AccountPage() {
  redirect("/profile");
}
