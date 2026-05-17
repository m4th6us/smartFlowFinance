import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar — SmartFlowFinance" },
      {
        name: "description",
        content: "Acesse sua conta SmartFlowFinance para gerenciar suas finanças.",
      },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres").max(72),
});

function appRedirectUrl(path: string) {
  const basePath = import.meta.env.VITE_APP_BASE_PATH || import.meta.env.BASE_URL || "/";
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
  const normalizedPath = path.replace(/^\//, "");

  return new URL(`${normalizedBase}${normalizedPath}`, window.location.origin).toString();
}

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  // Redireciona quem já está logado
  useEffect(() => {
    if (!authLoading && session) {
      navigate({ to: "/painel", replace: true });
    }
  }, [authLoading, session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: appRedirectUrl("/painel"),
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/painel", replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao autenticar";
      const friendly = msg.includes("Invalid login credentials")
        ? "E-mail ou senha inválidos"
        : msg.includes("User already registered")
          ? "Este e-mail já está cadastrado"
          : msg.toLowerCase().includes("email rate limit exceeded")
            ? "Limite de envio de e-mails atingido. Aguarde alguns minutos e tente novamente."
            : msg;
      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-card">
            <span className="text-2xl font-bold">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-brand">SmartFlowFinance</h1>
          <p className="mt-2 text-sm text-muted-foreground">Planejamento financeiro com clareza.</p>
        </div>

        <div className="mb-5 flex gap-1 rounded-xl bg-secondary p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "signin" ? "bg-card text-brand shadow-sm" : "text-muted-foreground"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-card text-brand shadow-sm" : "text-muted-foreground"
            }`}
          >
            Criar conta
          </button>
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
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-card transition hover:opacity-95 disabled:opacity-70"
          >
            {loading ? "Aguarde…" : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
