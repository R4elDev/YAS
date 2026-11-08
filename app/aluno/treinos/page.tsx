import { createClient } from "@/lib/supabase/server";
import { listTreinosDoAluno } from "@/lib/queries/treinos";
import { TreinosLista } from "@/components/treino/treinos-lista";

export default async function TreinosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const treinos = await listTreinosDoAluno(supabase, user!.id, 100);
  const concluidos = treinos.filter((t) => t.status === "concluido").length;

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <p className="yas-kicker">Sua agenda</p>
        <h1 className="text-3xl font-semibold tracking-tight">Meus treinos</h1>
        <p className="text-sm text-muted-foreground">
          {treinos.length > 0
            ? `${concluidos} de ${treinos.length} concluídos`
            : "Nenhum treino montado ainda"}
        </p>
      </header>
      <TreinosLista treinos={treinos} />
    </main>
  );
}
