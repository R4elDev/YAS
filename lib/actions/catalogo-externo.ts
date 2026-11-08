"use server";

import { createClient } from "@/lib/supabase/server";
import { buscarCatalogoExterno } from "@/lib/exercicios/catalogo-externo";
import type { PaginaCatalogo } from "@/lib/exercicios/tipos";

export type ResultadoBuscaCatalogo =
  | ({ ok: true } & PaginaCatalogo)
  | { ok: false; erro: string };

export async function buscarExerciciosCatalogo(input: {
  busca: string;
  grupo: string | null;
  pagina: number;
}): Promise<ResultadoBuscaCatalogo> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, erro: "Não autenticado." };
    const { data: perfil } = await supabase
      .from("profiles")
      .select("tipo, ativo")
      .eq("id", user.id)
      .single();
    if (perfil?.tipo !== "admin" || !perfil.ativo) return { ok: false, erro: "Sem permissão." };

    const busca = typeof input.busca === "string" ? input.busca.slice(0, 80) : "";
    const grupo = typeof input.grupo === "string" ? input.grupo : null;
    const pagina = Number.isFinite(input.pagina)
      ? Math.min(Math.max(Math.trunc(input.pagina), 1), 200)
      : 1;

    return { ok: true, ...buscarCatalogoExterno({ busca, grupo, pagina }) };
  } catch {
    return { ok: false, erro: "Catálogo indisponível no momento." };
  }
}
