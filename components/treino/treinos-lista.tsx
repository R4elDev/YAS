"use client";

import { useMemo, useState } from "react";
import type { Treino } from "@/lib/types/database.types";
import { TreinoCard } from "@/components/treino/treino-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Filtro = "todos" | "pendente" | "concluido";

const TITULO_VAZIO: Record<Filtro, string> = {
  todos: "Nenhum treino por enquanto",
  pendente: "Tudo em dia",
  concluido: "Nenhum concluído ainda",
};

const VAZIO: Record<Filtro, string> = {
  todos: "Seu personal ainda não montou nenhum treino. Quando montar, ele aparece aqui.",
  pendente: "Nenhum treino pendente. Você está em dia.",
  concluido: "Nenhum treino concluído ainda. O primeiro conta muito.",
};

export function TreinosLista({ treinos }: { treinos: Treino[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const contagem = useMemo(
    () => ({
      todos: treinos.length,
      pendente: treinos.filter((t) => t.status !== "concluido").length,
      concluido: treinos.filter((t) => t.status === "concluido").length,
    }),
    [treinos]
  );

  const filtrados = useMemo(
    () =>
      filtro === "todos"
        ? treinos
        : treinos.filter((t) =>
            filtro === "concluido"
              ? t.status === "concluido"
              : t.status !== "concluido"
          ),
    [treinos, filtro]
  );

  return (
    <Tabs
      value={filtro}
      onValueChange={(v) => setFiltro(v as Filtro)}
      className="flex flex-col gap-5"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="todos" className="min-h-11">
          Todos ({contagem.todos})
        </TabsTrigger>
        <TabsTrigger value="pendente" className="min-h-11">
          Pendentes ({contagem.pendente})
        </TabsTrigger>
        <TabsTrigger value="concluido" className="min-h-11">
          Concluídos ({contagem.concluido})
        </TabsTrigger>
      </TabsList>
      <TabsContent value={filtro} className="flex flex-col gap-3">
        {filtrados.length > 0 ? (
          filtrados.map((treino) => (
            <TreinoCard key={treino.id} treino={treino} />
          ))
        ) : (
          <div className="yas-empty">
            <strong>{TITULO_VAZIO[filtro]}</strong>
            <p>{VAZIO[filtro]}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
