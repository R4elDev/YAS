import Link from "next/link";
import { Play } from "lucide-react";
import { YasFace } from "@/components/yas/yas-face";
import type { Treino } from "@/lib/types/database.types";

interface TreinoDoDiaCardProps {
  treino: Treino;
  totalExercicios: number;
}

export function TreinoDoDiaCard({
  treino,
  totalExercicios,
}: TreinoDoDiaCardProps) {
  const concluido = treino.status === "concluido";

  return (
    <Link
      href={`/aluno/treinos/${treino.id}`}
      className="aluno-tap relative flex flex-col gap-5 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground sm:gap-6 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-[11px] font-bold tracking-[0.14em] text-primary-foreground/80 uppercase">
            {concluido ? "Hoje · concluído" : "Treino de hoje"}
          </span>
          <span className="text-2xl leading-tight font-bold tracking-tight break-words text-balance sm:text-3xl">
            {treino.nome}
          </span>
          {totalExercicios > 0 ? (
            <span className="text-sm text-primary-foreground/80 tabular-nums">
              {totalExercicios}{" "}
              {totalExercicios === 1 ? "exercício" : "exercícios"}
            </span>
          ) : null}
        </div>
        <YasFace
          rosto="feliz-orgulhosa"
          size={48}
          className="pointer-events-none sm:size-16!"
        />
      </div>

      <span className="flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-primary-foreground text-base font-semibold text-background">
        <Play aria-hidden className="size-4 fill-current" />
        {concluido ? "Ver treino" : "Começar treino"}
      </span>
    </Link>
  );
}
