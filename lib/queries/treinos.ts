import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Treino, Exercicio } from "@/lib/types/database.types";
import { toISODate } from "@/lib/utils/date";

export type TreinoComExercicios = Treino & { exercicios: Exercicio[] };

export async function listTreinosPeriodo(
  supabase: SupabaseClient<Database>,
  alunoId: string,
  inicio: Date,
  fim: Date
): Promise<Treino[]> {
  const { data, error } = await supabase
    .from("treinos")
    .select("*")
    .eq("aluno_id", alunoId)
    .gte("data", toISODate(inicio))
    .lte("data", toISODate(fim))
    .order("data");
  if (error) throw error;
  return data;
}

export async function listHistoricoTreinos(
  supabase: SupabaseClient<Database>,
  alunoId: string,
  limite = 50
): Promise<Treino[]> {
  const { data, error } = await supabase
    .from("treinos")
    .select("*")
    .eq("aluno_id", alunoId)
    .order("data", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return data;
}

export async function getTreinoComExercicios(
  supabase: SupabaseClient<Database>,
  treinoId: string
): Promise<TreinoComExercicios | null> {
  const { data: treino, error: treinoError } = await supabase
    .from("treinos")
    .select("*")
    .eq("id", treinoId)
    .single();
  if (treinoError) {
    if (treinoError.code === "PGRST116") return null;
    throw treinoError;
  }

  const { data: exercicios, error: exerciciosError } = await supabase
    .from("exercicios")
    .select("*")
    .eq("treino_id", treinoId)
    .order("ordem");
  if (exerciciosError) throw exerciciosError;

  return { ...treino, exercicios };
}

export async function listTreinosDoAluno(
  supabase: SupabaseClient<Database>,
  alunoId: string,
  limite = 50
): Promise<Treino[]> {
  const { data, error } = await supabase
    .from("treinos")
    .select("*")
    .eq("aluno_id", alunoId)
    .order("data", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return data;
}

export type TreinoComAluno = Treino & { aluno_nome: string };

export async function listTodosTreinosComAluno(
  supabase: SupabaseClient<Database>,
  limite = 100
): Promise<TreinoComAluno[]> {
  const { data, error } = await supabase
    .from("treinos")
    .select("*, profiles!treinos_aluno_id_fkey(nome)")
    .order("data", { ascending: false })
    .limit(limite);
  if (error) throw error;

  const linhas = data as unknown as (Treino & {
    profiles: { nome: string } | null;
  })[];
  return linhas.map((t) => ({ ...t, aluno_nome: t.profiles?.nome ?? "—" }));
}

export type PontoCarga = { data: string; carga: number };

/**
 * Progressão de carga por exercício (agrupado por nome normalizado) ao longo
 * do tempo — uma query só, agrupamento em memória.
 */
export async function getMapaProgressaoCarga(
  supabase: SupabaseClient<Database>,
  alunoId: string
): Promise<Record<string, PontoCarga[]>> {
  const { data, error } = await supabase
    .from("exercicios")
    .select("nome, carga, treinos!inner(data, aluno_id)")
    .eq("treinos.aluno_id", alunoId)
    .not("carga", "is", null)
    .order("data", { referencedTable: "treinos" });
  if (error) throw error;

  const linhas = data as unknown as {
    nome: string;
    carga: number;
    treinos: { data: string; aluno_id: string };
  }[];

  const mapa: Record<string, PontoCarga[]> = {};
  for (const linha of linhas) {
    const chave = linha.nome.trim();
    if (!mapa[chave]) mapa[chave] = [];
    mapa[chave].push({ data: linha.treinos.data, carga: linha.carga });
  }
  return mapa;
}
