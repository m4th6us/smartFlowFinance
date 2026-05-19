import type { Metadata } from "next";
import { LoginPage } from "@/features/pages/login-page";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta SmartFlowFinance para gerenciar suas finanças.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
