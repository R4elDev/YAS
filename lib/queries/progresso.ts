import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  ProgressoPeso,
  ProgressoFoto,
} from "@/lib/types/database.types";

export async function listProgressoPeso(
  supabase: SupabaseClient<Database>,
  alunoId: string
): Promise<ProgressoPeso[]> {
  const { data, error } = await supabase
    .from("progresso_peso")
    .select("*")
    .eq("aluno_id", alunoId)
    .order("data");
  if (error) throw error;
  return data;
}

export async function listProgressoFotos(
  supabase: SupabaseClient<Database>,
  alunoId: string
): Promise<ProgressoFoto[]> {
  const { data, error } = await supabase
    .from("progresso_fotos")
    .select("*")
    .eq("aluno_id", alunoId)
    .order("data", { ascending: false });
  if (error) throw error;
  return data;
}

export type ProgressoFotoComUrl = ProgressoFoto & { url: string | null };

/**
 * "progresso-fotos" é um bucket privado — `foto_url` guarda o caminho do
 * objeto, não uma URL pública. Resolve para signed URLs (1h) em lote.
 */
export async function resolverUrlsFotos(
  supabase: SupabaseClient<Database>,
  fotos: ProgressoFoto[]
): Promise<ProgressoFotoComUrl[]> {
  if (fotos.length === 0) return [];

  const { data, error } = await supabase.storage
    .from("progresso-fotos")
    .createSignedUrls(
      fotos.map((f) => f.foto_url),
      3600
    );
  if (error) throw error;

  return fotos.map((foto, i) => ({
    ...foto,
    url: data[i]?.signedUrl ?? null,
  }));
}
