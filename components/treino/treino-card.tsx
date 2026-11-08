import Link from "next/link";
import { ChevronRight, CircleCheck, Clock } from "lucide-react";
import type { Treino } from "@/lib/types/database.types";
import { formatDiaSemanaCurto, formatDataCurta } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

export function TreinoCard({ treino }: { treino: Treino }) {
  const concluido = treino.status === "concluido";

  return (
    <Link
      href={`/aluno/treinos/${treino.id}`}
      className="yas-card yas-card-link flex min-h-20 items-center gap-3 py-3 pr-3 pl-4 sm:gap-4 sm:pr-4"
    >
      <span
        aria-hidden
        className={cn(
          "aluno-barra-status self-stretch",
          concluido ? "bg-primary" : "bg-border"
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="line-clamp-2 text-base leading-snug font-bold break-words">
          {treino.nome}
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="capitalize">
            {formatDiaSemanaCurto(treino.data)} · {formatDataCurta(treino.data)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 font-semibold",
              concluido ? "text-primary" : "text-muted-foreground"
            )}
          >
            {concluido ? (
              <CircleCheck aria-hidden className="size-3.5" />
            ) : (
              <Clock aria-hidden className="size-3.5" />
            )}
            {concluido ? "Concluído" : "Pendente"}
          </span>
        </div>
      </div>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
