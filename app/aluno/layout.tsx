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
    .select("tipo, nome, avatar_url")
    .eq("id", user.id)
    .single();
  if (profile?.tipo !== "aluno") redirect("/");

  return (
    <AppShell
      papel="aluno"
      nome={profile.nome}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </AppShell>
  );
}
