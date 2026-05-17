import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar — WealthFlow" },
      { name: "description", content: "Acesse sua conta WealthFlow para gerenciar suas finanças." },
    ],
  }),
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/painel" }), 600);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-card">
            <span className="text-2xl font-bold">W</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">WealthFlow</h1>
          <p className="mt-2 text-sm text-muted-foreground">Planejamento financeiro com clareza.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type="email"
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-3 text-sm outline-none ring-ring/30 transition focus:border-ring focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Senha
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-10 text-sm outline-none ring-ring/30 transition focus:border-ring focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-brand"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-[var(--brand)]" />
              Lembrar-me
            </label>
            <a href="#" className="font-semibold text-brand hover:underline">
              Esqueci a senha
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-card transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="relative my-5 text-center">
            <span className="relative z-10 bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">
              ou continue com
            </span>
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
          </div>

          <button
            type="button"
            className="w-full rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Continuar com Google
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
