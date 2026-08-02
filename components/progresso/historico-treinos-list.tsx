import { CircleCheck } from "lucide-react";
import type { Treino } from "@/lib/types/database.types";
import { formatDataLonga } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

export function HistoricoTreinosList({ treinos }: { treinos: Treino[] }) {
  if (treinos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        Nenhum treino no histórico ainda.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {treinos.map((treino) => (
        <li
          key={treino.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-bold">{treino.nome}</span>
            <span className="text-xs text-muted-foreground">
              {formatDataLonga(treino.data)}
            </span>
          </div>
          {treino.status === "concluido" ? (
            <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15">
              <CircleCheck className="size-3.5" />
              Concluído
            </Badge>
          ) : (
            <Badge variant="secondary">Pendente</Badge>
          )}
        </li>
      ))}
    </ul>
  );
}
