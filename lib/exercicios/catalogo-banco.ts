import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";
import {
  GRUPOS_MUSCULARES,
  traduzirEquipamento,
  traduzirMusculo,
} from "@/lib/exercicios/dicionario";
import type { PaginaCatalogo } from "@/lib/exercicios/tipos";

// Busca no catálogo do próprio Supabase (`exercicios_catalogo`, fonte
// 'exercisedb'). RLS: só usuário autenticado ativo lê; nenhuma chamada à
// ExerciseDB e nenhum service_role aqui.

const TAMANHO_PADRAO = 20;
const TAMANHO_MAX = 25;

/** Mesma normalização gravada em `nome_busca` pelo importador. */
export function normalizarBusca(t: string): string {
  return t.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

/** Tokens seguros para ilike: só letras/números/hífen (sem % _ , ( ) \). */
function tokensDe(busca: string): string[] {
  return normalizarBusca(busca)
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9-]/g, ""))
    .filter(Boolean)
    .slice(0, 6);
}

export async function buscarCatalogoBanco(
  supabase: SupabaseClient<Database>,
  params: {
    busca?: string;
    grupo?: string | null;
    pagina?: number;
    tamanho?: number;
  }
): Promise<PaginaCatalogo> {
  const tamanho = Math.min(Math.max(params.tamanho ?? TAMANHO_PADRAO, 1), TAMANHO_MAX);
  const pagina = Math.max(Math.floor(params.pagina ?? 1), 1);
  const inicio = (pagina - 1) * tamanho;

  let q = supabase
    .from("exercicios_catalogo")
    .select(
      "id, nome, nome_original, musculos_primarios, equipamentos, equipamento, imagem_inicio_url, imagem_fim_url",
      { count: "exact" }
    )
    .eq("fonte", "free-exercise-db");

  for (const t of tokensDe(params.busca ?? "")) {
    // nome_busca (sem acento) quando preenchido; linhas sem ele ainda casam
    // por nome/nome_original. t é [a-z0-9-].
    q = q.or(
      `nome_busca.ilike.%${t}%,nome.ilike.%${t}%,nome_original.ilike.%${t}%`
    );
  }
  if (params.grupo) {
    // Grupo desconhecido não filtra "tudo": devolve vazio (comportamento anterior).
    if (!Object.hasOwn(GRUPOS_MUSCULARES, params.grupo)) {
      return { itens: [], total: 0, pagina, temMais: false };
    }
    q = q.overlaps("musculos_primarios", [params.grupo]);
  }

  const { data, count, error } = await q
    .order("nome")
    .order("id")
    .range(inicio, inicio + tamanho - 1);
  if (error) throw error;

  const total = count ?? 0;
  return {
    itens: (data ?? []).map((r) => {
      const equip = r.equipamentos?.[0] ?? r.equipamento;
      return {
        id: r.id,
        nome: r.nome,
        nomeOriginal: r.nome_original,
        gifUrl: r.imagem_inicio_url,
        imagemFimUrl: r.imagem_fim_url,
        musculos: r.musculos_primarios.map(traduzirMusculo),
        equipamento: equip ? traduzirEquipamento(equip) : null,
      };
    }),
    total,
    pagina,
    temMais: inicio + tamanho < total,
  };
}
