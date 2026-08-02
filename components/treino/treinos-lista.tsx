"use client";

import { useMemo, useState } from "react";
import type { Treino } from "@/lib/types/database.types";
import { TreinoCard } from "@/components/treino/treino-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Filtro = "todos" | "pendente" | "concluido";

export function TreinosLista({ treinos }: { treinos: Treino[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const filtrados = useMemo(
    () =>
      filtro === "todos"
        ? treinos
        : treinos.filter((t) => t.status === filtro),
    [treinos, filtro]
  );

  return (
    <Tabs
      value={filtro}
      onValueChange={(v) => setFiltro(v as Filtro)}
      className="flex flex-col gap-4"
    >
      <TabsList className="w-full">
        <TabsTrigger value="todos" className="flex-1">
          Todos
        </TabsTrigger>
        <TabsTrigger value="pendente" className="flex-1">
          Pendentes
        </TabsTrigger>
        <TabsTrigger value="concluido" className="flex-1">
          Concluídos
        </TabsTrigger>
      </TabsList>
      <TabsContent value={filtro} className="flex flex-col gap-2">
        {filtrados.length > 0 ? (
          filtrados.map((treino) => (
            <TreinoCard key={treino.id} treino={treino} />
          ))
        ) : (
          <p className="px-1 text-sm text-muted-foreground">
            Nenhum treino encontrado.
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
