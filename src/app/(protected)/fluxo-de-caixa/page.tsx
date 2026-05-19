import type { Metadata } from "next";
import { FluxoPage } from "@/features/pages/fluxo-page";

export const metadata: Metadata = {
  title: "Fluxo de Caixa",
};

export default function FluxoRoute() {
  return <FluxoPage />;
}
