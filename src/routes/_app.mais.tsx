import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/mais")({
  component: MaisPage,
  head: () => ({ meta: [{ title: "Mais — WealthFlow" }] }),
});

const items = [
  { icon: User, label: "Meu Perfil" },
  { icon: Settings, label: "Configurações" },
  { icon: Shield, label: "Privacidade e Segurança" },
  { icon: HelpCircle, label: "Ajuda e Suporte" },
];

function MaisPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/80?img=12" alt="Avatar" className="h-14 w-14 rounded-full" />
          <div>
            <p className="text-base font-bold">Carlos Andrade</p>
            <p className="text-sm text-muted-foreground">carlos@email.com</p>
          </div>
        </div>
      </div>

      <ul className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        {items.map((it) => (
          <li key={it.label}>
            <button className="flex w-full items-center justify-between border-b border-border px-5 py-4 last:border-b-0 hover:bg-secondary/50">
              <span className="flex items-center gap-3 text-sm font-semibold">
                <it.icon className="h-5 w-5 text-brand" /> {it.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-semibold text-danger shadow-card"
      >
        <LogOut className="h-4 w-4" /> Sair
      </Link>
    </div>
  );
}
