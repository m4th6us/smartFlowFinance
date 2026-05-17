import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_app/relatorios")({
  component: RelatoriosPage,
  head: () => ({ meta: [{ title: "Relatórios — WealthFlow" }] }),
});

const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL"];
const data = [
  [70, 60], [72, 65], [68, 62], [80, 70], [55, 40], [78, 68], [75, 70],
];

function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios Financeiros</h1>
        <p className="mt-1 text-sm text-muted-foreground">Analisando seu desempenho em julho de 2026</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-base font-bold text-brand">Visão Geral<br />do Fluxo</h3>
          <div className="flex gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-brand" /> Entradas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-sky" /> Saídas
            </span>
          </div>
        </div>
        <div className="flex h-48 items-end justify-between gap-2">
          {data.map(([entradas, saidas], i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end gap-0.5">
                <div className="flex-1 rounded-t-md bg-brand" style={{ height: `${entradas}%` }} />
                <div className="flex-1 rounded-t-md bg-sky" style={{ height: `${saidas}%` }} />
              </div>
              <span className={`text-[10px] font-semibold ${i === 6 ? "text-brand" : "text-muted-foreground"}`}>
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-brand p-5 text-brand-foreground shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Economia líquida</p>
        <p className="mt-2 text-3xl font-bold tnum">R$ 4.320,50</p>
        <p className="mt-3 inline-flex items-center gap-1 text-sm opacity-90">
          <TrendingUp className="h-4 w-4" /> +12,4% em relação ao mês anterior
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Limite de gastos</p>
        <p className="mt-2 text-2xl font-bold tnum">R$ 1.200,00 / R$ 5.000,00</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-sky" style={{ width: "24%" }} />
        </div>
      </div>
    </div>
  );
}
