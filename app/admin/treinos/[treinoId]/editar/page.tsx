import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { getTreinoComExercicios } from "@/lib/queries/treinos";
import { listCatalogoResumoPorIds } from "@/lib/queries/catalogo";
import { TreinoBuilder } from "@/components/treino/treino-builder";

export default async function EditarTreinoPage({
  params,
}: {
  params: Promise<{ treinoId: string }>;
}) {
  const { treinoId } = await params;
  const supabase = await createClient();

  const [treino, alunos] = await Promise.all([
    getTreinoComExercicios(supabase, treinoId),
    listAlunos(supabase),
  ]);
  if (!treino) notFound();
  const catalogo = await listCatalogoResumoPorIds(
    supabase,
    treino.exercicios.flatMap((e) => (e.catalogo_id ? [e.catalogo_id] : []))
  );

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Treinos</p>
          <h1>Editar treino</h1>
          <p>As alterações valem para o aluno assim que você salvar.</p>
        </div>
      </header>
      <TreinoBuilder
        alunos={alunos}
        catalogo={catalogo}
        treino={treino}
        exerciciosIniciais={treino.exercicios}
      />
    </main>
  );
}
