import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { listCatalogoResumo } from "@/lib/queries/catalogo";
import { TreinoBuilder } from "@/components/treino/treino-builder";

export default async function NovoTreinoPage() {
  const supabase = await createClient();
  const [alunos, catalogo] = await Promise.all([
    listAlunos(supabase),
    listCatalogoResumo(supabase),
  ]);

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <h1 className="text-2xl font-extrabold">Criar treino</h1>
      <TreinoBuilder alunos={alunos} catalogo={catalogo} />
    </main>
  );
}
