"use server";

import { createClient } from "@/lib/supabase/server";

export async function atualizarExercicioAluno(
  exercicioId: string,
  carga: number | null,
  concluido: boolean
) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("atualizar_exercicio_aluno", {
    p_exercicio_id: exercicioId,
    p_carga: carga,
    p_concluido: concluido,
  });
  if (error) throw new Error(error.message);
}
