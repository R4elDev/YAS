import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";
import "./aluno.css";

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo, nome, avatar_url, senha_provisoria")
    .eq("id", user.id)
    .single();
  if (profile?.tipo !== "aluno") redirect("/");
  // Senha provisória: o proxy já força /trocar-senha; defesa em profundidade.
  if (profile.senha_provisoria) redirect("/trocar-senha");

  return (
    <AppShell
      papel="aluno"
      usuarioId={user.id}
      nome={profile.nome}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </AppShell>
  );
}
