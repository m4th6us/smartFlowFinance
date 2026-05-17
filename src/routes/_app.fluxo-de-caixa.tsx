import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { formatCurrency } from "@/lib/finance-format";

export const Route = createFileRoute("/_app/fluxo-de-caixa")({
  component: FluxoPage,
  head: () => ({ meta: [{ title: "Fluxo de Caixa — SmartFlowFinance" }] }),
});

type TxType = "entrada" | "saida";

type Transaction = {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  description: string | null;
  transaction_date: string;
};

function FluxoPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeType, setActiveType] = useState<TxType>("entrada");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("id, type, amount, category, description, transaction_date")
        .order("transaction_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erro ao carregar o fluxo de caixa");
      } else {
        setTransactions((data ?? []) as Transaction[]);
      }

      setLoading(false);
    }

    loadTransactions();
  }, [user]);

  const totals = useMemo(() => {
    const entradas = transactions
      .filter((item) => item.type === "entrada")
      .reduce((sum, item) => sum + Number(item.amount), 0);
    const saidas = transactions
      .filter((item) => item.type === "saida")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return { entradas, saidas, saldo: entradas - saidas };
  }, [transactions]);

  const categories = useMemo(() => {
    const grouped = transactions
      .filter((item) => item.type === activeType)
      .reduce<Record<string, number>>((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount);
        return acc;
      }, {});

    return Object.entries(grouped)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, activeType]);

  const recent = transactions.filter((item) => item.type === activeType).slice(0, 10);
  const mainCategory = categories[0];
  const activeTotal = activeType === "entrada" ? totals.entradas : totals.saidas;
  const mainPercentage =
    activeTotal > 0 && mainCategory ? Math.round((mainCategory.value / activeTotal) * 100) : 0;

  if (loading) {
    return (
      <div className="grid min-h-80 place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Saldo total
        </p>
        <p className="mt-1 text-3xl font-bold tnum">{formatCurrency(totals.saldo)}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-success" /> ENTRADAS
            </p>
            <p className="mt-1 text-lg font-bold tnum">{formatCurrency(totals.entradas)}</p>
          </div>
          <div className="rounded-xl border border-border p-3">
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <ArrowDown className="h-3 w-3 text-danger" /> SAÍDAS
            </p>
            <p className="mt-1 text-lg font-bold tnum">{formatCurrency(totals.saidas)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 rounded-xl bg-secondary p-1">
        <button
          onClick={() => setActiveType("entrada")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold ${activeType === "entrada" ? "bg-card text-brand shadow-sm" : "text-muted-foreground"}`}
        >
          Entradas
        </button>
        <button
          onClick={() => setActiveType("saida")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold ${activeType === "saida" ? "bg-card text-brand shadow-sm" : "text-muted-foreground"}`}
        >
          Saídas
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="text-sm font-bold text-brand">Resumo por Categoria</p>
        <div className="my-5 flex items-center justify-center">
          <div
            className="relative grid h-40 w-40 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--sky) 0 ${mainPercentage}%, var(--secondary) 0)`,
            }}
          >
            <div className="grid h-28 w-28 place-items-center rounded-full bg-card text-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Principal
                </p>
                <p className="text-xl font-bold tnum text-brand">{mainPercentage}%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-3 text-sm">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground">Sem categorias registradas.</p>
          ) : (
            categories.slice(0, 4).map((item) => (
              <div key={item.category} className="flex justify-between gap-3">
                <span className="truncate font-semibold">{item.category}</span>
                <span className="tnum">{formatCurrency(item.value)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-brand">
            {activeType === "entrada" ? "Entradas Recentes" : "Saídas Recentes"}
          </p>
        </div>
        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma transação registrada.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${item.type === "entrada" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                  >
                    {item.type === "entrada" ? (
                      <ArrowUp className="h-5 w-5" />
                    ) : (
                      <ArrowDown className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.category}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.description ? `${item.description} • ` : ""}
                      {new Date(`${item.transaction_date}T00:00:00`).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold tnum ${item.type === "entrada" ? "text-success" : "text-danger"}`}
                >
                  {item.type === "entrada" ? "+" : "-"} {formatCurrency(Number(item.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="px-1 text-sm text-muted-foreground">
        O fluxo acima considera as transações registradas no banco de dados.
      </p>
    </div>
  );
}
