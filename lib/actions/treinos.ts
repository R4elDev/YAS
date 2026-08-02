"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getTreinoComExercicios } from "@/lib/queries/treinos";

export async function finalizarTreino(treinoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("finalizar_treino", {
    p_treino_id: treinoId,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/aluno/treinos/${treinoId}`);
  revalidatePath("/aluno/inicio");
  revalidatePath("/aluno/treinos");
}

export interface ExercicioInput {
  catalogo_id: string | null;
  nome: string;
  imagem_url: string | null;
  imagem_fim_url: string | null;
  series: number;
  repeticoes: string;
  observacoes: string | null;
}

export interface TreinoInput {
  alunoId: string;
  nome: string;
  data: string;
  exercicios: ExercicioInput[];
}

// Não usa redirect() de propósito: quem chama (client component) faz o
// router.push após o await resolver, evitando o gotcha de capturar o sinal
// de redirect do Next dentro de um try/catch no cliente.
export async function criarTreino(input: TreinoInput): Promise<{ id: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { data: treino, error } = await supabase
    .from("treinos")
    .insert({
      aluno_id: input.alunoId,
      criado_por: user.id,
      nome: input.nome,
      data: input.data,
    })
    .select()
    .single();
  if (error || !treino) throw new Error(error?.message ?? "Erro ao criar treino.");

  if (input.exercicios.length > 0) {
    const { error: exError } = await supabase.from("exercicios").insert(
      input.exercicios.map((ex, i) => ({
        treino_id: treino.id,
        catalogo_id: ex.catalogo_id,
        nome: ex.nome,
        imagem_url: ex.imagem_url,
        imagem_fim_url: ex.imagem_fim_url,
        series: ex.series,
        repeticoes: ex.repeticoes,
        observacoes: ex.observacoes,
        ordem: i,
      }))
    );
    if (exError) throw new Error(exError.message);
  }

  revalidatePath("/admin/treinos");
  revalidatePath("/aluno/inicio");
  return { id: treino.id };
}

export async function atualizarTreino(
  treinoId: string,
  input: TreinoInput
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("treinos")
    .update({ aluno_id: input.alunoId, nome: input.nome, data: input.data })
    .eq("id", treinoId);
  if (error) throw new Error(error.message);

  // Estratégia simples: apaga os exercícios antigos e recria a partir do
  // array atual — a ordem sempre reflete a posição no array no momento do save.
  const { error: delError } = await supabase
    .from("exercicios")
    .delete()
    .eq("treino_id", treinoId);
  if (delError) throw new Error(delError.message);

  if (input.exercicios.length > 0) {
    const { error: exError } = await supabase.from("exercicios").insert(
      input.exercicios.map((ex, i) => ({
        treino_id: treinoId,
        catalogo_id: ex.catalogo_id,
        nome: ex.nome,
        imagem_url: ex.imagem_url,
        imagem_fim_url: ex.imagem_fim_url,
        series: ex.series,
        repeticoes: ex.repeticoes,
        observacoes: ex.observacoes,
        ordem: i,
      }))
    );
    if (exError) throw new Error(exError.message);
  }

  revalidatePath("/admin/treinos");
  revalidatePath(`/aluno/treinos/${treinoId}`);
  revalidatePath("/aluno/inicio");
}

export async function excluirTreino(treinoId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("treinos").delete().eq("id", treinoId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/treinos");
}

export async function duplicarTreino(
  treinoId: string,
  novaData: string
): Promise<void> {
  const supabase = await createClient();
  const treino = await getTreinoComExercicios(supabase, treinoId);
  if (!treino) throw new Error("Treino não encontrado.");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: novo, error } = await supabase
    .from("treinos")
    .insert({
      aluno_id: treino.aluno_id,
      criado_por: user?.id,
      nome: treino.nome,
      data: novaData,
    })
    .select()
    .single();
  if (error || !novo) throw new Error(error?.message ?? "Erro ao duplicar.");

  if (treino.exercicios.length > 0) {
    const { error: exError } = await supabase.from("exercicios").insert(
      treino.exercicios.map((ex) => ({
        treino_id: novo.id,
        catalogo_id: ex.catalogo_id,
        nome: ex.nome,
        imagem_url: ex.imagem_url,
        imagem_fim_url: ex.imagem_fim_url,
        series: ex.series,
        repeticoes: ex.repeticoes,
        observacoes: ex.observacoes,
        ordem: ex.ordem,
      }))
    );
    if (exError) throw new Error(exError.message);
  }

  revalidatePath("/admin/treinos");
}
