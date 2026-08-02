"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Exercicio, Treino } from "@/lib/types/database.types";
import { ExercicioCard } from "@/components/treino/exercicio-card";
import { ProgressoBarTreino } from "@/components/treino/progresso-bar-treino";
import { Button } from "@/components/ui/button";
import { atualizarExercicioAluno } from "@/lib/actions/exercicios";
import { finalizarTreino } from "@/lib/actions/treinos";

interface TreinoDetalheProps {
  treino: Treino;
  exerciciosIniciais: Exercicio[];
}

export function TreinoDetalhe({
  treino,
  exerciciosIniciais,
}: TreinoDetalheProps) {
  const [exercicios, setExercicios] = useState(exerciciosIniciais);
  const [isSaving, startSaving] = useTransition();
  const [finalizando, startFinalizando] = useTransition();
  const router = useRouter();

  const concluidos = exercicios.filter((e) => e.concluido).length;
  const jaFinalizado = treino.status === "concluido";

  function atualizarLocal(
    id: string,
    patch: Partial<Pick<Exercicio, "carga" | "concluido">>
  ) {
    setExercicios((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  }

  function handleCargaChange(exercicio: Exercicio, valor: number | null) {
    atualizarLocal(exercicio.id, { carga: valor });
    startSaving(async () => {
      try {
        await atualizarExercicioAluno(
          exercicio.id,
          valor,
          exercicio.concluido
        );
      } catch {
        toast.error("Não foi possível salvar a carga.");
      }
    });
  }

  function handleConcluidoChange(exercicio: Exercicio, valor: boolean) {
    atualizarLocal(exercicio.id, { concluido: valor });
    startSaving(async () => {
      try {
        await atualizarExercicioAluno(exercicio.id, exercicio.carga, valor);
      } catch {
        toast.error("Não foi possível salvar.");
      }
    });
  }

  function handleFinalizar() {
    startFinalizando(async () => {
      try {
        await finalizarTreino(treino.id);
        toast.success("Treino finalizado!");
        router.push("/aluno/treinos");
      } catch {
        toast.error("Não foi possível finalizar o treino.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressoBarTreino concluidos={concluidos} total={exercicios.length} />

      <div className="flex flex-col gap-3">
        {exercicios.map((exercicio) => (
          <ExercicioCard
            key={exercicio.id}
            exercicio={exercicio}
            carga={exercicio.carga}
            concluido={exercicio.concluido}
            onCargaChange={(v) => handleCargaChange(exercicio, v)}
            onConcluidoChange={(v) => handleConcluidoChange(exercicio, v)}
          />
        ))}
      </div>

      <Button
        size="lg"
        className="h-14 text-base font-bold"
        disabled={finalizando || isSaving || jaFinalizado}
        onClick={handleFinalizar}
      >
        {jaFinalizado
          ? "Treino já concluído"
          : finalizando
            ? "Finalizando..."
            : "Finalizar treino"}
      </Button>
    </div>
  );
}
