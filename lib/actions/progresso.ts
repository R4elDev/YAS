"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISODate } from "@/lib/utils/date";

export interface PesoFormState {
  error?: string;
}

export async function registrarPeso(
  _prevState: PesoFormState | undefined,
  formData: FormData
): Promise<PesoFormState> {
  const peso = Number(formData.get("peso"));
  if (!peso || peso <= 0) {
    return { error: "Informe um peso válido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { error } = await supabase.from("progresso_peso").insert({
    aluno_id: user.id,
    data: todayISODate(),
    peso,
  });
  if (error) return { error: "Não foi possível salvar o peso." };

  revalidatePath("/aluno/progresso");
  return {};
}

// `path` é o caminho do objeto no bucket privado "progresso-fotos"
// (ex.: "{alunoId}/171234-foto.jpg"), não uma URL pública — a leitura
// sempre passa por signed URL gerada no servidor.
export async function registrarFoto(path: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { error } = await supabase.from("progresso_fotos").insert({
    aluno_id: user.id,
    data: todayISODate(),
    foto_url: path,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/aluno/progresso");
}
