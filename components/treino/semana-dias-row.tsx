import Link from "next/link";
import { Check } from "lucide-react";
import type { Treino } from "@/lib/types/database.types";
import type { DiaSemana } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface SemanaDiasRowProps {
  dias: DiaSemana[];
  treinos: Treino[];
}

export function SemanaDiasRow({ dias, treinos }: SemanaDiasRowProps) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1">
      {dias.map((dia) => {
        const treino = treinos.find((t) => t.data === dia.data);
        const concluido = treino?.status === "concluido";

        const conteudo = (
          <div
            className={cn(
              "flex w-16 shrink-0 flex-col items-center gap-2 rounded-2xl border bg-card px-2 py-3",
              dia.isHoje ? "border-primary" : "border-transparent"
            )}
          >
            <span
              className={cn(
                "text-[11px] font-bold tracking-wide",
                dia.isHoje ? "text-primary" : "text-muted-foreground"
              )}
            >
              {dia.label}
            </span>
            <span className="text-lg font-extrabold">{dia.numero}</span>
            {treino ? (
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  concluido
                    ? "bg-primary text-primary-foreground"
                    : "border border-muted-foreground/40"
                )}
              >
                {concluido && <Check className="size-3" strokeWidth={3} />}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-muted-foreground/50">
                OFF
              </span>
            )}
          </div>
        );

        return treino ? (
          <Link key={dia.data} href={`/aluno/treinos/${treino.id}`}>
            {conteudo}
          </Link>
        ) : (
          <div key={dia.data}>{conteudo}</div>
        );
      })}
    </div>
  );
}
