import Link from "next/link";
import { ChevronRight, CircleCheck } from "lucide-react";
import type { Treino } from "@/lib/types/database.types";
import { formatDiaSemanaCurto, formatDataCurta } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

export function TreinoCard({ treino }: { treino: Treino }) {
  const concluido = treino.status === "concluido";

  return (
    <Link
      href={`/aluno/treinos/${treino.id}`}
      className="flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 transition-colors active:bg-accent"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-base font-bold">{treino.nome}</span>
        <span className="text-xs text-muted-foreground">
          {formatDiaSemanaCurto(treino.data)} · {formatDataCurta(treino.data)}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {concluido ? (
          <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
            <CircleCheck className="size-3.5" />
            Concluído
          </Badge>
        ) : (
          <Badge variant="secondary">Pendente</Badge>
        )}
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
    </Link>
  );
}
