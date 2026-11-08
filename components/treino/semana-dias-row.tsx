import Link from "next/link";
import { Check } from "lucide-react";
import type { Treino } from "@/lib/types/database.types";
import type { DiaSemana } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface SemanaDiasRowProps {
  dias: DiaSemana[];
  treinos: Treino[];
}

// Grade fixa de 7 colunas: cabe em 320px sem rolagem, então nenhum dia
// fica escondido. "Hoje" recebe borda, fundo e aria-current.
export function SemanaDiasRow({ dias, treinos }: SemanaDiasRowProps) {
  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-3">
      {dias.map((dia) => {
        const treino = treinos.find((t) => t.data === dia.data);
        const concluido = treino?.status === "concluido";

        const conteudo = (
          <div
            className={cn(
              "flex min-h-24 min-w-0 flex-col items-center justify-between gap-1.5 rounded-xl border px-0.5 py-2.5 sm:rounded-2xl sm:px-2",
              dia.isHoje
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            )}
          >
            <span
              className={cn(
                "text-[10px] font-bold tracking-wide uppercase",
                dia.isHoje ? "text-primary" : "text-muted-foreground"
              )}
            >
              {dia.label}
            </span>
            <span className="text-base font-semibold tabular-nums sm:text-lg">
              {dia.numero}
            </span>
            {treino ? (
              <span
                aria-hidden
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  concluido
                    ? "bg-primary text-primary-foreground"
                    : "border border-muted-foreground/60"
                )}
              >
                {concluido && <Check className="size-3" strokeWidth={3} />}
              </span>
            ) : (
              <span aria-hidden className="text-xs text-muted-foreground/60">
                –
              </span>
            )}
            {!treino ? <span className="sr-only">Sem treino</span> : null}
          </div>
        );

        return treino ? (
          <Link
            key={dia.data}
            href={`/aluno/treinos/${treino.id}`}
            aria-current={dia.isHoje ? "date" : undefined}
            aria-label={`${treino.nome}, ${dia.label} ${dia.numero}${concluido ? ", concluído" : ""}`}
            className="aluno-tap min-w-0"
          >
            {conteudo}
          </Link>
        ) : (
          <div key={dia.data} aria-current={dia.isHoje ? "date" : undefined} className="min-w-0">
            {conteudo}
          </div>
        );
      })}
    </div>
  );
}
