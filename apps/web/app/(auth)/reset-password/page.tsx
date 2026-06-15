import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Neues Passwort · DistillFeed" };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
