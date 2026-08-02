"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AlunoFormState {
  error?: string;
  senhaGerada?: string;
}

function gerarSenhaProvisoria() {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let senha = "";
  for (let i = 0; i < 10; i++) {
    senha += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return senha;
}

export async function criarAluno(
  _prevState: AlunoFormState | undefined,
  formData: FormData
): Promise<AlunoFormState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!nome || !email) {
    return { error: "Preencha nome e email." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: quemChama } = await supabase
    .from("profiles")
    .select("tipo")
    .eq("id", user.id)
    .single();
  if (quemChama?.tipo !== "admin") return { error: "Não autorizado." };

  const senha = gerarSenhaProvisoria();
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome, tipo: "aluno", senha_provisoria: true },
  });

  if (error) {
    const jaExiste = error.message.toLowerCase().includes("already");
    return {
      error: jaExiste
        ? "Já existe uma conta com esse email."
        : "Não foi possível criar o aluno.",
    };
  }

  revalidatePath("/admin/alunos");
  return { senhaGerada: senha };
}
