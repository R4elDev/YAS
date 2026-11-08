import Link from "next/link";
import { Dumbbell, Play } from "lucide-react";
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
      <Dumbbell
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 size-40 rotate-12 text-primary-foreground/10"
      />

      <div className="relative flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-[0.12em] text-primary-foreground/80 uppercase">
          {concluido ? "Treino de hoje · concluído" : "Treino de hoje"}
        </span>
        <span className="text-3xl leading-tight font-bold tracking-tight text-balance">
          {treino.nome}
        </span>
        {totalExercicios > 0 ? (
          <span className="text-sm text-primary-foreground/80">
            {totalExercicios} {totalExercicios === 1 ? "exercício" : "exercícios"}
          </span>
        ) : null}
      </div>

      <span className="relative flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-primary-foreground text-base font-semibold text-cream">
        <Play aria-hidden className="size-4 fill-current" />
        {concluido ? "Ver treino" : "Começar treino"}
      </span>
    </Link>
  );
}
