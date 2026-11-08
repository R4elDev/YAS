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
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-semibold tracking-[0.12em] text-primary-foreground/80 uppercase">
            {concluido ? "Treino de hoje · concluído" : "Treino de hoje"}
          </span>
          <span className="text-3xl leading-tight font-bold tracking-tight break-words text-balance">
            {treino.nome}
          </span>
          {totalExercicios > 0 ? (
            <span className="text-sm text-primary-foreground/80">
              {totalExercicios} {totalExercicios === 1 ? "exercício" : "exercícios"}
            </span>
          ) : null}
        </div>
        <YasFace
          rosto="feliz-orgulhosa"
          size={72}
          className="pointer-events-none sm:size-24!"
        />
      </div>

      <span className="relative flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-primary-foreground text-base font-semibold text-background">
        <Play aria-hidden className="size-4 fill-current" />
        {concluido ? "Ver treino" : "Começar treino"}
      </span>
    </Link>
  );
}
