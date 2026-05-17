import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, ArrowDown, Briefcase, Landmark, Wallet } from "lucide-react";

export const Route = createFileRoute("/_app/fluxo-de-caixa")({
  component: FluxoPage,
  head: () => ({ meta: [{ title: "Fluxo de Caixa — WealthFlow" }] }),
});

const entradas = [
  { icon: Briefcase, title: "Salário Mensal", sub: "Corporate Tech Inc • 28 Out", value: "+R$ 7.000,00" },
  { icon: Landmark, title: "Dividendos de Ações", sub: "Global ETF • 25 Out", value: "+R$ 850,00" },
  { icon: Wallet, title: "Projeto Freelance", sub: "Auditoria UI Design • 20 Out", value: "+R$ 350,00" },
];

function FluxoPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saldo total</p>
        <p className="mt-1 text-3xl font-bold tnum">R$ 12.450,80</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-success" /> ENTRADAS
            </p>
            <p className="mt-1 text-lg font-bold tnum">R$ 8.200,00</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <ArrowDown className="h-3 w-3 text-danger" /> SAÍDAS
            </p>
            <p className="mt-1 text-lg font-bold tnum">R$ 3.749,20</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        <button className="flex-1 rounded-lg bg-card py-2 text-sm font-semibold text-brand shadow-sm">
          Entradas
        </button>
        <button className="flex-1 rounded-lg py-2 text-sm font-semibold text-muted-foreground">
          Saídas
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-sm font-bold text-brand">Resumo por Fonte</p>
        <div className="my-5 flex items-center justify-center">
          <div className="relative grid h-40 w-40 place-items-center rounded-full"
               style={{ background: "conic-gradient(var(--sky) 0 85%, var(--secondary) 0)" }}>
            <div className="grid h-28 w-28 place-items-center rounded-full bg-card text-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Principal</p>
                <p className="text-xl font-bold tnum text-brand">85%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between"><span className="font-semibold">Salário</span><span className="tnum">R$ 7.000</span></div>
          <div className="flex justify-between"><span className="font-semibold">Dividendos</span><span className="tnum">R$ 1.200</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-brand">Entradas Recentes</p>
          <button className="text-xs font-semibold text-brand">VER TUDO</button>
        </div>
        <ul className="divide-y divide-border">
          {entradas.map((e) => (
            <li key={e.title} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <e.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.sub}</p>
                </div>
              </div>
              <span className="text-sm font-bold tnum text-success">{e.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="px-1 text-sm text-muted-foreground">
        Com base nas suas tendências, você atingirá sua meta de R$ 20 mil até dezembro.
      </p>
    </div>
  );
}
