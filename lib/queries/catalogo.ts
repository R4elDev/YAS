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

/**
 * Resumo só dos itens de catálogo usados pelo treino em edição. O catálogo
 * completo (1500+) é buscado sob demanda no sheet, nunca carregado inteiro.
 */
export async function listCatalogoResumoPorIds(
  supabase: SupabaseClient<Database>,
  ids: string[]
): Promise<CatalogoResumo[]> {
  const unicos = [...new Set(ids)];
  if (unicos.length === 0) return [];
  const { data, error } = await supabase
    .from("exercicios_catalogo")
    .select(
      "id, nome, imagem_inicio_url, imagem_fim_url, categoria, equipamento, musculos_primarios"
    )
    .in("id", unicos);
  if (error) throw error;
  return data;
}
