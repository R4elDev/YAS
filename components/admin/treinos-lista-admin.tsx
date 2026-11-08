"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import type { TreinoComAluno } from "@/lib/queries/treinos";
import { TreinoAdminCard } from "@/components/admin/treino-admin-card";
import { YasFace } from "@/components/yas/yas-face";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Filtro = "todos" | "pendentes" | "concluidos";

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pendentes", label: "Pendentes" },
  { id: "concluidos", label: "Concluídos" },
];

function normalizar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function TreinosListaAdmin({ treinos }: { treinos: TreinoComAluno[] }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return treinos.filter((t) => {
      const concluido = t.status === "concluido";
      if (filtro === "pendentes" && concluido) return false;
      if (filtro === "concluidos" && !concluido) return false;
      return !termo || normalizar(`${t.nome} ${t.aluno_nome}`).includes(termo);
    });
  }, [treinos, busca, filtro]);

  if (treinos.length === 0) {
    return (
      <div className="yas-empty">
        <strong>Nenhum treino criado ainda</strong>
        <p>Monte o primeiro treino escolhendo exercícios com GIF no catálogo.</p>
        <div className="yas-empty-actions">
          <Button render={<Link href="/admin/treinos/novo" />} className="gap-2">
            <Plus className="size-4" />
            Criar treino
          </Button>
        </div>
        <YasFace rosto="pensativa" size={104} className="mt-3 mb-5" />
      </div>
    );
  }

  return (
    <div className="yas-stack">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            inputMode="search"
            placeholder="Buscar por treino ou aluno"
            aria-label="Buscar treino"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>
        <div className="yas-chip-row" role="group" aria-label="Filtrar treinos">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="yas-chip min-h-11"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visiveis.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiveis.map((treino) => (
            <TreinoAdminCard key={treino.id} treino={treino} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhum treino encontrado com esse filtro.
        </p>
      )}
    </div>
  );
}
