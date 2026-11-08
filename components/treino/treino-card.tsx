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
      className="yas-card yas-card-link flex min-h-16 items-center gap-4 px-4 py-3"
    >
      <span
        aria-hidden
        className={cn(
          "aluno-barra-status",
          concluido ? "bg-primary" : "bg-border"
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-base font-bold">{treino.nome}</span>
        <span className="text-xs text-muted-foreground">
          {formatDiaSemanaCurto(treino.data)} · {formatDataCurta(treino.data)}
        </span>
      </div>
      <span
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
          concluido
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {concluido ? (
          <CircleCheck aria-hidden className="size-3.5" />
        ) : (
          <Clock aria-hidden className="size-3.5" />
        )}
        {concluido ? "Concluído" : "Pendente"}
      </span>
      <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}
