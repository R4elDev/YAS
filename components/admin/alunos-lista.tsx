"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
import type { Profile } from "@/lib/types/database.types";
import { AlunoListItem, type AlunoResumo } from "@/components/admin/aluno-list-item";
import { YasFace } from "@/components/yas/yas-face";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Filtro = "todos" | "ativos" | "inativos";

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "ativos", label: "Ativos" },
  { id: "inativos", label: "Inativos" },
];

function normalizar(texto: string) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function AlunosLista({
  alunos,
  resumos,
  vazioComAcao = true,
}: {
  alunos: Profile[];
  resumos?: Record<string, AlunoResumo>;
  vazioComAcao?: boolean;
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return alunos.filter((a) => {
      if (filtro === "ativos" && !a.ativo) return false;
      if (filtro === "inativos" && a.ativo) return false;
      return (
        !termo || normalizar(`${a.nome} ${a.email}`).includes(termo)
      );
    });
  }, [alunos, busca, filtro]);

  const contagem: Record<Filtro, number> = {
    todos: alunos.length,
    ativos: alunos.filter((a) => a.ativo).length,
    inativos: alunos.filter((a) => !a.ativo).length,
  };

  if (alunos.length === 0) {
    return (
      <div className="yas-empty">
        <strong>Nenhum aluno por aqui ainda</strong>
        <p>Cadastre o primeiro aluno para montar treinos e acompanhar a evolução.</p>
        {vazioComAcao ? (
          <div className="yas-empty-actions">
            <Button render={<Link href="/admin/alunos/novo" />} className="gap-2">
              <UserPlus className="size-4" />
              Adicionar aluno
            </Button>
          </div>
        ) : null}
        <YasFace rosto="pensativa" size={104} className="mt-3 mb-5" />
      </div>
    );
  }

  return (
    <div className="yas-stack">
      <div className="pa-toolbar">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            inputMode="search"
            placeholder="Buscar por nome ou email"
            aria-label="Buscar aluno"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="h-12 pl-10 text-base"
          />
        </div>
        <div className="yas-chip-row" role="group" aria-label="Filtrar alunos">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              className="yas-chip"
              aria-pressed={filtro === f.id}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}{" "}
              <span className="tabular-nums opacity-70">{contagem[f.id]}</span>
            </button>
          ))}
        </div>
      </div>

      {visiveis.length > 0 ? (
        <ul className="pa-list">
          {visiveis.map((aluno) => (
            <li key={aluno.id}>
              <AlunoListItem aluno={aluno} resumo={resumos?.[aluno.id]} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="yas-empty pb-6" role="status">
          <strong>Nenhum aluno encontrado</strong>
          <p>Tente outro nome, email ou mude o filtro.</p>
          <div className="yas-empty-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setBusca("");
                setFiltro("todos");
              }}
            >
              Limpar busca e filtro
            </Button>
          </div>
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {visiveis.length} {visiveis.length === 1 ? "aluno" : "alunos"} na lista
      </p>
    </div>
  );
}
