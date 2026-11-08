"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
import type { Profile } from "@/lib/types/database.types";
import { AlunoListItem } from "@/components/admin/aluno-list-item";
import { YasPose } from "@/components/layout/yas-pose";
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
  vazioComAcao = true,
}: {
  alunos: Profile[];
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
        <YasPose pose="convite" className="yas-empty-pose" sizes="120px" />
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
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visiveis.length > 0 ? (
        <div className="yas-grid">
          {visiveis.map((aluno) => (
            <AlunoListItem key={aluno.id} aluno={aluno} />
          ))}
        </div>
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
