import type { Metadata } from "next";
import { PainelPage } from "@/features/pages/painel-page";

export const metadata: Metadata = {
  title: "Painel",
};

export default function PainelRoute() {
  return <PainelPage />;
}
