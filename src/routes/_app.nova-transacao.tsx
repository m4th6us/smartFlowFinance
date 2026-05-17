import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Loader2, Trash2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/nova-transacao")({
  component: NovaTransacaoPage,
  head: () => ({ meta: [{ title: "Nova Transação — WealthFlow" }] }),
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

const schema = z.object({
  type: z.enum(["entrada", "saida"]),
  amount: z.number().positive("Informe um valor maior que zero").max(99999999, "Valor muito alto"),
  category: z.string().trim().min(1, "Categoria obrigatória").max(60),
  description: z.string().trim().max(500).optional(),
  transaction_date: z.string().min(1, "Data obrigatória"),
});

function NovaTransacaoPage() {
  const { user } = useAuth();
  const [type, setType] = useState<TxType>("entrada");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);
  const [list, setList] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadList() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("id, type, amount, category, description, transaction_date")
      .order("transaction_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) toast.error("Erro ao carregar transações");
    else setList((data ?? []) as Transaction[]);
    setLoading(false);
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({
      type,
      amount: Number(amount.replace(",", ".")),
      category,
      description: description || undefined,
      transaction_date: date,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      ...parsed.data,
      description: parsed.data.description ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Erro ao salvar transação");
      return;
    }
    toast.success("Transação registrada!");
    setAmount("");
    setCategory("");
    setDescription("");
    loadList();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Transação excluída");
      setList((l) => l.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
      >
        <div>
          <p className="text-sm font-bold text-brand">Nova Transação</p>
          <p className="text-xs text-muted-foreground">Registre uma entrada ou saída.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
          <button
            type="button"
            onClick={() => setType("entrada")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
              type === "entrada" ? "bg-card text-success shadow-sm" : "text-muted-foreground"
            }`}
          >
            <ArrowUp className="h-4 w-4" /> Entrada
          </button>
          <button
            type="button"
            onClick={() => setType("saida")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition ${
              type === "saida" ? "bg-card text-danger shadow-sm" : "text-muted-foreground"
            }`}
          >
            <ArrowDown className="h-4 w-4" /> Saída
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            placeholder="Ex: Salário, Aluguel, Mercado..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={60}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Detalhes da transação..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={2}
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar transação"}
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <p className="mb-3 text-sm font-bold text-brand">Últimas transações</p>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : list.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma transação registrada ainda.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {list.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-xl ${
                      t.type === "entrada"
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {t.type === "entrada" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.transaction_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold tnum ${
                      t.type === "entrada" ? "text-success" : "text-danger"
                    }`}
                  >
                    {t.type === "entrada" ? "+" : "-"} R$ {Number(t.amount).toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={() => handleDelete(t.id)}
                    aria-label="Excluir"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
