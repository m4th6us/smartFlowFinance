import type { Metadata } from "next";
import { RelatoriosPage } from "@/features/pages/relatorios-page";

export const metadata: Metadata = {
  title: "Relatórios",
};

export default function RelatoriosRoute() {
  return <RelatoriosPage />;
}
