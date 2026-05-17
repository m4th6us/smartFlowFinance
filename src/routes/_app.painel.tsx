import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import {
  formatCurrency,
  formatMonthLabel,
  monthStart,
  nextMonthStart,
  previousMonthStart,
} from "@/lib/finance-format";

export const Route = createFileRoute("/_app/painel")({
  component: PainelPage,
  head: () => ({ meta: [{ title: "Painel — SmartFlowFinance" }] }),
});

type TransactionSummary = {
  type: "entrada" | "saida";
  amount: number;
  transaction_date: string;
};

type MonthlyReport = {
  month: string | null;
  saldo: number | null;
  total_entradas: number | null;
  total_saidas: number | null;
  total_transactions: number | null;
};

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-card ${className}`}>
      {children}
    </div>
  );
}

function PainelPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!user) return;
      setLoading(true);

      const [transactionsResult, reportsResult] = await Promise.all([
        supabase
          .from("transactions")
          .select("type, amount, transaction_date")
          .order("transaction_date", { ascending: false }),
        supabase
          .from("monthly_reports")
          .select("month, saldo, total_entradas, total_saidas, total_transactions")
          .eq("user_id", user.id)
          .order("month", { ascending: false })
          .limit(6),
      ]);

      if (transactionsResult.error || reportsResult.error) {
        toast.error("Erro ao carregar o painel");
      } else {
        setTransactions((transactionsResult.data ?? []) as TransactionSummary[]);
        setReports(((reportsResult.data ?? []) as MonthlyReport[]).reverse());
      }

      setLoading(false);
    }

    loadDashboard();
  }, [user]);

  const totals = useMemo(() => {
    const currentStart = monthStart();
    const currentEnd = nextMonthStart();
    const previousStart = previousMonthStart();

    const balance = transactions.reduce(
      (sum, item) => sum + (item.type === "entrada" ? Number(item.amount) : -Number(item.amount)),
      0,
    );

    const currentMonth = transactions.filter(
      (item) => item.transaction_date >= currentStart && item.transaction_date < currentEnd,
    );
    const previousMonth = transactions.filter(
      (item) => item.transaction_date >= previousStart && item.transaction_date < currentStart,
    );

    const monthlyIncome = currentMonth
      .filter((item) => item.type === "entrada")
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const monthlyExpense = currentMonth
      .filter((item) => item.type === "saida")
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const previousBalance = previousMonth.reduce(
      (sum, item) => sum + (item.type === "entrada" ? Number(item.amount) : -Number(item.amount)),
      0,
    );
    const currentBalance = monthlyIncome - monthlyExpense;
    const trend =
      previousBalance === 0
        ? null
        : ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100;

    return { balance, monthlyIncome, monthlyExpense, currentBalance, trend };
  }, [transactions]);

  const maxMonthlyTotal = Math.max(
    1,
    ...reports.map(
      (report) => Number(report.total_entradas ?? 0) + Number(report.total_saidas ?? 0),
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
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saldo total
        </p>
        <p className="mt-2 text-4xl font-bold tnum text-brand">{formatCurrency(totals.balance)}</p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-sky-soft px-2.5 py-1 text-xs font-semibold text-brand">
          <TrendingUp className="h-3 w-3" />
          {totals.trend === null
            ? "Sem mês anterior para comparar"
            : `${totals.trend >= 0 ? "+" : ""}${totals.trend.toFixed(1).replace(".", ",")}% este mês`}
        </span>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Receita mensal
        </p>
        <p className="mt-2 text-2xl font-bold tnum">{formatCurrency(totals.monthlyIncome)}</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-sky"
            style={{
              width: `${Math.min(100, (totals.monthlyIncome / Math.max(1, totals.monthlyIncome + totals.monthlyExpense)) * 100)}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Entradas registradas neste mês</p>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Despesas mensais
        </p>
        <p className="mt-2 text-2xl font-bold tnum">{formatCurrency(totals.monthlyExpense)}</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-brand"
            style={{
              width: `${Math.min(100, (totals.monthlyExpense / Math.max(1, totals.monthlyIncome + totals.monthlyExpense)) * 100)}%`,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Saídas registradas neste mês</p>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-brand">Tendência do fluxo</h3>
          <button className="text-xs font-semibold text-brand">Últimos 6 meses ▾</button>
        </div>
        {reports.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sem movimentações para exibir.
          </p>
        ) : (
          <div className="flex h-40 items-end justify-between gap-2">
            {reports.map((report) => (
              <div key={report.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-sky/40"
                  style={{
                    height: `${Math.max(4, (Number(report.total_saidas ?? 0) / maxMonthlyTotal) * 100)}%`,
                  }}
                />
                <div
                  className="w-full rounded-t-md bg-sky"
                  style={{
                    height: `${Math.max(4, (Number(report.total_entradas ?? 0) / maxMonthlyTotal) * 100)}%`,
                  }}
                />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {report.month ? formatMonthLabel(report.month) : "--"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
