import type { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Passwort zurücksetzen · DistillFeed" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
