-- Enum para tipo de transação
CREATE TYPE public.transaction_type AS ENUM ('entrada', 'saida');

-- Tabela de transações
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.transaction_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  category TEXT NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- View de relatórios mensais (respeita RLS da tabela base)
CREATE VIEW public.monthly_reports
WITH (security_invoker = true) AS
SELECT
  user_id,
  date_trunc('month', transaction_date)::date AS month,
  COALESCE(SUM(amount) FILTER (WHERE type = 'entrada'), 0) AS total_entradas,
  COALESCE(SUM(amount) FILTER (WHERE type = 'saida'), 0) AS total_saidas,
  COALESCE(SUM(amount) FILTER (WHERE type = 'entrada'), 0) - COALESCE(SUM(amount) FILTER (WHERE type = 'saida'), 0) AS saldo,
  COUNT(*) AS total_transactions
FROM public.transactions
GROUP BY user_id, date_trunc('month', transaction_date);