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
      className="aluno-tap relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground"
    >
      <div className="relative flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 text-xs font-semibold tracking-[0.12em] text-primary-foreground/80 uppercase">
            {concluido ? "Treino de hoje · concluído" : "Treino de hoje"}
          </span>
          <YasFace
            rosto="feliz-orgulhosa"
            size={56}
            className="pointer-events-none sm:size-20!"
          />
        </div>
        <span className="text-2xl leading-tight font-bold tracking-tight break-words text-balance sm:text-3xl">
          {treino.nome}
        </span>
        {totalExercicios > 0 ? (
          <span className="text-sm text-primary-foreground/80">
            {totalExercicios} {totalExercicios === 1 ? "exercício" : "exercícios"}
          </span>
        ) : null}
      </div>

      <span className="relative flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-primary-foreground text-base font-semibold text-background">
        <Play aria-hidden className="size-4 fill-current" />
        {concluido ? "Ver treino" : "Começar treino"}
      </span>
    </Link>
  );
}
