"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error?: string;
}

export async function signIn(
  _prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Preencha email e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email ou senha inválidos." };
  }

  redirect("/");
}

export interface TrocarSenhaFormState {
  error?: string;
}

export async function trocarSenhaProvisoria(
  _prevState: TrocarSenhaFormState | undefined,
  formData: FormData
): Promise<TrocarSenhaFormState> {
  const password = String(formData.get("password") ?? "");
  const confirmarPassword = String(formData.get("confirmarPassword") ?? "");

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }
  if (password !== confirmarPassword) {
    return { error: "As senhas não coincidem." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { error: updateAuthError } = await supabase.auth.updateUser({
    password,
  });
  if (updateAuthError) {
    return { error: "Não foi possível trocar a senha." };
  }

  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({ senha_provisoria: false })
    .eq("id", user.id);
  if (updateProfileError) {
    return { error: "Senha trocada, mas houve um erro ao atualizar seu perfil." };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
