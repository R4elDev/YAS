import { createClient } from "@/lib/supabase/server";
import { listTreinosDoAluno } from "@/lib/queries/treinos";
import { TreinosLista } from "@/components/treino/treinos-lista";

export default async function TreinosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const treinos = await listTreinosDoAluno(supabase, user!.id, 100);

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <h1 className="text-2xl font-extrabold">Meus treinos</h1>
      <TreinosLista treinos={treinos} />
    </main>
  );
}
