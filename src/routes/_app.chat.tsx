import { createFileRoute } from "@tanstack/react-router";
import { Plus, Send, Pencil } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Chat — SmartFlowFinance" }] }),
});

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

        <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Pencil className="h-4 w-4" /> Nenhuma conversa registrada.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setText("");
        }}
        className="flex items-center gap-2 border-t border-border bg-background px-5 py-3"
      >
        <button
          type="button"
          aria-label="Anexar"
          className="rounded-full p-2 text-brand hover:bg-brand-soft"
        >
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
