import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

export interface CatalogoResumo {
  id: string;
  nome: string;
  imagem_inicio_url: string | null;
  imagem_fim_url: string | null;
  categoria: string;
  equipamento: string | null;
  musculos_primarios: string[];
}

export async function listCatalogoResumo(
  supabase: SupabaseClient<Database>
): Promise<CatalogoResumo[]> {
  const { data, error } = await supabase
    .from("exercicios_catalogo")
    .select(
      "id, nome, imagem_inicio_url, imagem_fim_url, categoria, equipamento, musculos_primarios"
    )
    .order("nome");
  if (error) throw error;
  return data;
}
