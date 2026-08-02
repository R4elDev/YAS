"use client";

import type { Exercicio } from "@/lib/types/database.types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExercicioImagemLightbox } from "@/components/treino/exercicio-imagem-lightbox";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border p-4 transition-colors",
        concluido ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      )}
    >
      <div className="flex gap-3">
        <ExercicioImagemLightbox
          nome={exercicio.nome}
          imagemUrl={exercicio.imagem_url}
          imagemFimUrl={exercicio.imagem_fim_url}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="truncate text-base font-bold">
            {exercicio.nome}
          </span>
          <span className="text-sm text-muted-foreground">
            {exercicio.series} séries x {exercicio.repeticoes} reps
          </span>
          {exercicio.observacoes ? (
            <span className="text-xs text-muted-foreground">
              {exercicio.observacoes}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor={cargaId} className="text-xs text-muted-foreground">
            Carga (kg)
          </Label>
          <Input
            id={cargaId}
            type="number"
            inputMode="decimal"
            step="0.5"
            min="0"
            className="h-12 text-base"
            defaultValue={carga ?? ""}
            onBlur={(e) => {
              const valor =
                e.target.value === "" ? null : Number(e.target.value);
              onCargaChange(valor);
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span aria-hidden className="text-xs text-transparent select-none">
            Feito
          </span>
          <label
            htmlFor={concluidoId}
            className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-input px-4"
          >
            <Checkbox
              id={concluidoId}
              checked={concluido}
              onCheckedChange={(v) => onConcluidoChange(v === true)}
            />
            <span className="text-sm font-medium">Feito</span>
          </label>
        </div>
      </div>
    </div>
  );
}
