import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/painel")({
  component: PainelPage,
  head: () => ({ meta: [{ title: "Painel — WealthFlow" }] }),
});

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-card ${className}`}>
      {children}
    </div>
  );
}

function PainelPage() {
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Saldo total</p>
        <p className="mt-2 text-4xl font-bold tnum text-brand">R$ 142.850,42</p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-sky-soft px-2.5 py-1 text-xs font-semibold text-brand">
          <TrendingUp className="h-3 w-3" /> +4,2% este mês
        </span>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Receita mensal</p>
        <p className="mt-2 text-2xl font-bold tnum">R$ 12.400,00</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-sky" style={{ width: "85%" }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">85% da meta mensal alcançada</p>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Despesas mensais</p>
        <p className="mt-2 text-2xl font-bold tnum">R$ 4.820,15</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-brand" style={{ width: "38%" }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">38% do orçamento utilizado</p>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-brand">Tendência do fluxo</h3>
          <button className="text-xs font-semibold text-brand">Últimos 6 meses ▾</button>
        </div>
        <div className="flex h-40 items-end justify-between gap-2">
          {[40, 60, 35, 75, 45, 80].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-md bg-sky/40" style={{ height: `${h - 15}%` }} />
              <div className="w-full rounded-t-md bg-sky" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
