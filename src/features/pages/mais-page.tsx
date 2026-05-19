"use client";

import { useRouter } from "next/navigation";
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const items = [
  { icon: User, label: "Meu Perfil" },
  { icon: Settings, label: "Configurações" },
  { icon: Shield, label: "Privacidade e Segurança" },
  { icon: HelpCircle, label: "Ajuda e Suporte" },
];

export function MaisPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-bold">
              {user?.email?.split("@")[0] ?? "Usuário"}
            </p>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
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

      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-4 text-sm font-semibold text-danger shadow-card hover:bg-secondary/40"
      >
        <LogOut className="h-4 w-4" /> Sair
      </button>
    </div>
  );
}
