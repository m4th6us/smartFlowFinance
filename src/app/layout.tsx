import type { Metadata } from "next";
import { Providers } from "./providers";
import "../styles.css";

export const metadata: Metadata = {
  title: {
    default: "SmartFlowFinance",
    template: "%s | SmartFlowFinance",
  },
  description: "SmartFlowFinance: gerencie seu fluxo de caixa, relatórios e finanças com clareza.",
  authors: [{ name: "SmartFlowFinance" }],
  openGraph: {
    title: "SmartFlowFinance",
    description: "Planejamento financeiro com clareza.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
