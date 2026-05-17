export const formatCurrency = (value: number | null | undefined) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value ?? 0);

export const formatMonthLabel = (date: string | Date) =>
  new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(typeof date === "string" ? new Date(`${date}T00:00:00`) : date)
    .replace(".", "")
    .toUpperCase();

export const monthStart = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);

export const nextMonthStart = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString().slice(0, 10);

export const previousMonthStart = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString().slice(0, 10);
