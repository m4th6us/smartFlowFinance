import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutGrid, Banknote, BarChart3, MessageSquare, MoreHorizontal, Bell } from "lucide-react";

const tabs = [
  { to: "/painel", label: "Painel", icon: LayoutGrid },
  { to: "/fluxo-de-caixa", label: "Fluxo", icon: Banknote },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/mais", label: "Mais", icon: MoreHorizontal },
] as const;

export function AppShell() {
  const { pathname } = useLocation();
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-muted ring-1 ring-border">
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="Avatar do usuário"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-brand">WealthFlow</span>
        </div>
        <button
          aria-label="Notificações"
          className="rounded-full p-2 text-brand transition hover:bg-brand-soft"
        >
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 px-5 pb-28 pt-4">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-border bg-card/95 px-2 py-2 backdrop-blur">
        <ul className="flex items-center justify-between">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to} className="flex-1">
                <Link
                  to={to}
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
