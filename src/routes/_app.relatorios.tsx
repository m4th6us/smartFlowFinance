import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency, formatMonthLabel } from "@/lib/finance-format";

export const Route = createFileRoute("/_app/relatorios")({
  component: RelatoriosPage,
  head: () => ({ meta: [{ title: "Relatórios — SmartFlowFinance" }] }),
});

type MonthlyReport = {
  month: string | null;
  saldo: number | null;
  total_entradas: number | null;
  total_saidas: number | null;
  total_transactions: number | null;
};

function RelatoriosPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("monthly_reports")
        .select("month, saldo, total_entradas, total_saidas, total_transactions")
        .eq("user_id", user.id)
        .order("month", { ascending: false })
        .limit(7);

      if (error) {
        toast.error("Erro ao carregar relatórios");
      } else {
        setReports(((data ?? []) as MonthlyReport[]).reverse());
      }

      setLoading(false);
    }

    loadReports();
  }, [user]);

  const summary = useMemo(() => {
    const current = reports.at(-1);
    const previous = reports.at(-2);
    const currentSavings = Number(current?.saldo ?? 0);
    const previousSavings = Number(previous?.saldo ?? 0);
    const trend =
      previousSavings === 0
        ? null
        : ((currentSavings - previousSavings) / Math.abs(previousSavings)) * 100;
    const totalEntradas = reports.reduce((sum, item) => sum + Number(item.total_entradas ?? 0), 0);
    const totalSaidas = reports.reduce((sum, item) => sum + Number(item.total_saidas ?? 0), 0);

    return { current, currentSavings, trend, totalEntradas, totalSaidas };
  }, [reports]);

  const maxMonthlyTotal = Math.max(
    1,
    ...reports.map((report) =>
      Math.max(Number(report.total_entradas ?? 0), Number(report.total_saidas ?? 0)),
    ),
  );

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios Financeiros</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.current?.month
            ? `Analisando seu desempenho em ${new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${summary.current.month}T00:00:00`))}`
            : "Sem dados financeiros registrados ainda"}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-base font-bold text-brand">
            Visão Geral
            <br />
            do Fluxo
          </h3>
          <div className="flex gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-brand" /> Entradas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 font-semibold">
              <span className="h-2 w-2 rounded-full bg-sky" /> Saídas
            </span>
          </div>
        </div>
        {reports.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Sem relatórios para exibir.
          </p>
        ) : (
          <div className="flex h-48 items-end justify-between gap-2">
            {reports.map((report, i) => (
              <div key={report.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end gap-0.5">
                  <div
                    className="flex-1 rounded-t-md bg-brand"
                    style={{
                      height: `${Math.max(4, (Number(report.total_entradas ?? 0) / maxMonthlyTotal) * 100)}%`,
                    }}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-sky"
                    style={{
                      height: `${Math.max(4, (Number(report.total_saidas ?? 0) / maxMonthlyTotal) * 100)}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${i === reports.length - 1 ? "text-brand" : "text-muted-foreground"}`}
                >
                  {report.month ? formatMonthLabel(report.month) : "--"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-brand p-5 text-brand-foreground shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
          Economia líquida
        </p>
        <p className="mt-2 text-3xl font-bold tnum">{formatCurrency(summary.currentSavings)}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-sm opacity-90">
          <TrendingUp className="h-4 w-4" />
          {summary.trend === null
            ? "Sem mês anterior para comparar"
            : `${summary.trend >= 0 ? "+" : ""}${summary.trend.toFixed(1).replace(".", ",")}% em relação ao mês anterior`}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saídas no período
        </p>
        <p className="mt-2 text-2xl font-bold tnum">
          {formatCurrency(summary.totalSaidas)} / {formatCurrency(summary.totalEntradas)}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-sky"
            style={{
              width: `${Math.min(100, (summary.totalSaidas / Math.max(1, summary.totalEntradas)) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
