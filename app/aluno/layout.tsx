import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNavAluno } from "@/components/layout/bottom-nav-aluno";

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
    .select("tipo")
    .eq("id", user.id)
    .single();
  if (profile?.tipo !== "aluno") redirect("/");

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex-1 pb-24">{children}</div>
      <BottomNavAluno />
    </div>
  );
}
