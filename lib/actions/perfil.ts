"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface PerfilFormState {
  error?: string;
  success?: boolean;
}

export async function atualizarNome(
  _prevState: PerfilFormState | undefined,
  formData: FormData
): Promise<PerfilFormState> {
  const nome = String(formData.get("nome") ?? "").trim();
  if (!nome) return { error: "Informe um nome." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({ nome })
    .eq("id", user.id);
  if (error) return { error: "Não foi possível salvar." };

  revalidatePath("/aluno/perfil");
  revalidatePath("/admin/perfil");
  revalidatePath("/admin/alunos");
  return { success: true };
}

export async function atualizarAvatar(url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado.");

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: url })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/aluno/perfil");
  revalidatePath("/admin/perfil");
  revalidatePath("/admin/alunos");
}
