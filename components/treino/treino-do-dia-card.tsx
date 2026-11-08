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
      className="yas-hero-card flex flex-col gap-6 p-6 transition-transform active:scale-[0.99]"
    >
      <Dumbbell
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 size-40 rotate-12 text-primary-foreground/10"
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-[0.12em] text-primary-foreground/75 uppercase">
          Treino de hoje
        </span>
        <span className="text-3xl leading-tight font-bold tracking-tight">
          {treino.nome}
        </span>
        {totalExercicios > 0 ? (
          <span className="text-sm text-primary-foreground/75">
            {totalExercicios} exercícios
          </span>
        ) : null}
      </div>

      <span className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary-foreground text-base font-semibold text-cream">
        <Play className="size-4 fill-current" />
        {concluido ? "Ver treino" : "Começar treino"}
      </span>
    </Link>
  );
}
