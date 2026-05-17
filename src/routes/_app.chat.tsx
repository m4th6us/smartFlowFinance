import { createFileRoute } from "@tanstack/react-router";
import { Plus, Send, Pencil } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Chat — WealthFlow" }] }),
});

const initial = [
  { id: 1, from: "them", time: "09:41", text: "Olá! Sou a Sara, do suporte WealthFlow. Como posso te ajudar com seu planejamento financeiro hoje?" },
  { id: 2, from: "me", time: "09:43", text: "Notei uma divergência no meu relatório de Fluxo de Caixa de ontem. Podemos revisar a sincronização recente das transações?" },
  { id: 3, from: "them", time: "09:44", text: "Claro. Estou vendo o log de sincronização aqui. Parece que a transferência de R$ 1.240 foi sinalizada para verificação manual. Quer que eu processe agora?" },
];

function ChatPage() {
  const [text, setText] = useState("");
  return (
    <div className="-mx-5 -mt-4 flex h-[calc(100vh-9rem)] flex-col">
      <div className="border-b border-border px-5 pb-3 pt-1">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-brand" /> Suporte Online
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-card px-5 py-5">
        <div className="mx-auto w-fit rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
          Hoje
        </div>

        {initial.map((m) =>
          m.from === "them" ? (
            <div key={m.id} className="flex items-end gap-2">
              <img src="https://i.pravatar.cc/40?img=47" alt="Sara" className="h-8 w-8 rounded-full" />
              <div className="max-w-[78%] rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3 text-sm">
                <p>{m.text}</p>
                <p className="mt-1 text-right text-[10px] text-muted-foreground">{m.time}</p>
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-brand px-4 py-3 text-sm text-brand-foreground">
                <p>{m.text}</p>
                <p className="mt-1 text-right text-[10px] opacity-70">{m.time}</p>
              </div>
            </div>
          ),
        )}

        <p className="flex items-center gap-2 pl-10 text-xs italic text-muted-foreground">
          <Pencil className="h-3 w-3" /> Sara está digitando…
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); setText(""); }}
        className="flex items-center gap-2 border-t border-border bg-background px-5 py-3"
      >
        <button type="button" aria-label="Anexar" className="rounded-full p-2 text-brand hover:bg-brand-soft">
          <Plus className="h-5 w-5" />
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva sua mensagem…"
          className="flex-1 rounded-full border border-input bg-card px-4 py-2.5 text-sm outline-none ring-ring/30 transition focus:border-ring focus:ring-2"
        />
        <button
          type="submit"
          aria-label="Enviar"
          className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
