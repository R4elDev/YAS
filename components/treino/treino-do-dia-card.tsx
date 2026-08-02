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
      className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground transition-opacity active:opacity-90"
    >
      <Dumbbell
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 size-40 rotate-12 text-white/10"
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold tracking-wide text-white/80 uppercase">
          Treino de hoje
        </span>
        <span className="text-3xl leading-tight font-extrabold">
          {treino.nome}
        </span>
        {totalExercicios > 0 ? (
          <span className="text-sm text-white/80">
            {totalExercicios} exercícios
          </span>
        ) : null}
      </div>

      <span className="flex h-14 items-center justify-center gap-2 rounded-full bg-black text-base font-bold text-white">
        <Play className="size-4 fill-white" />
        {concluido ? "Ver treino" : "Começar treino"}
      </span>
    </Link>
  );
}
