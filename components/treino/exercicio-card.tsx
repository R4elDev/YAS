"use client";

import type { Exercicio } from "@/lib/types/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExercicioImagemLightbox } from "@/components/treino/exercicio-imagem-lightbox";
import { cn } from "@/lib/utils";
import { CircleCheck, Circle } from "lucide-react";

interface ExercicioCardProps {
  exercicio: Exercicio;
  carga: number | null;
  concluido: boolean;
  onCargaChange: (valor: number | null) => void;
  onConcluidoChange: (valor: boolean) => void;
}

export function ExercicioCard({
  exercicio,
  carga,
  concluido,
  onCargaChange,
  onConcluidoChange,
}: ExercicioCardProps) {
  const cargaId = `carga-${exercicio.id}`;
  const concluidoId = `concluido-${exercicio.id}`;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4 transition-colors duration-200 motion-reduce:transition-none",
        concluido ? "border-primary/60 bg-primary/5" : "border-border bg-card"
      )}
    >
      <div className="flex gap-3">
        <ExercicioImagemLightbox
          nome={exercicio.nome}
          imagemUrl={exercicio.imagem_url}
          imagemFimUrl={exercicio.imagem_fim_url}
          tamanho="lg"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="text-base leading-snug font-bold break-words text-balance">
            {exercicio.nome}
          </h3>
          <span className="w-fit rounded-full bg-muted px-3 py-1 text-sm font-semibold text-foreground tabular-nums">
            {exercicio.series} séries × {exercicio.repeticoes}
          </span>
          {exercicio.observacoes ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {exercicio.observacoes}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Label htmlFor={cargaId} className="text-xs text-muted-foreground">
            Carga (kg)
          </Label>
          <Input
            id={cargaId}
            type="number"
            inputMode="decimal"
            step="0.5"
            min="0"
            className="h-12 text-base tabular-nums"
            defaultValue={carga ?? ""}
            onBlur={(e) => {
              const valor =
                e.target.value === "" ? null : Number(e.target.value);
              onCargaChange(valor);
            }}
          />
        </div>
        <label
          htmlFor={concluidoId}
          className={cn(
            "aluno-tap flex min-h-12 min-w-28 shrink-0 select-none cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors duration-200",
            concluido
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background text-foreground"
          )}
        >
          <input
            id={concluidoId}
            type="checkbox"
            className="sr-only"
            checked={concluido}
            onChange={(e) => onConcluidoChange(e.target.checked)}
          />
          {concluido ? (
            <CircleCheck aria-hidden className="size-4" />
          ) : (
            <Circle aria-hidden className="size-4" />
          )}
          {concluido ? "Feito" : "Marcar"}
        </label>
      </div>
    </article>
  );
}
