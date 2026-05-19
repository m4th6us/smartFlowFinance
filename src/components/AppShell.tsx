"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Banknote,
  PlusCircle,
  BarChart3,
  MoreHorizontal,
  Bell,
  WalletCards,
} from "lucide-react";

const tabs = [
  { href: "/painel", label: "Painel", icon: LayoutGrid },
  { href: "/fluxo-de-caixa", label: "Fluxo", icon: Banknote },
  { href: "/nova-transacao", label: "Nova", icon: PlusCircle },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/mais", label: "Mais", icon: MoreHorizontal },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
            <WalletCards className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-brand">SmartFlowFinance</span>
        </div>
        <button
          aria-label="Notificações"
          className="rounded-full p-2 text-brand transition hover:bg-brand-soft"
        >
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 px-5 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border bg-card/95 px-2 py-2 backdrop-blur">
        <ul className="flex items-center justify-between">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition ${
                    active ? "bg-brand-soft text-brand" : "text-muted-foreground hover:text-brand"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
