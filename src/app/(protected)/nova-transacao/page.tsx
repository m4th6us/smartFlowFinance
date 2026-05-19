import type { Metadata } from "next";
import { NovaTransacaoPage } from "@/features/pages/nova-transacao-page";

export const metadata: Metadata = {
  title: "Nova Transação",
};

export default function NovaTransacaoRoute() {
  return <NovaTransacaoPage />;
}
