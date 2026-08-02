import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { getTreinoComExercicios } from "@/lib/queries/treinos";
import { listCatalogoResumo } from "@/lib/queries/catalogo";
import { TreinoBuilder } from "@/components/treino/treino-builder";

export default async function EditarTreinoPage({
  params,
}: {
  params: Promise<{ treinoId: string }>;
}) {
  const { treinoId } = await params;
  const supabase = await createClient();

  const [treino, alunos, catalogo] = await Promise.all([
    getTreinoComExercicios(supabase, treinoId),
    listAlunos(supabase),
    listCatalogoResumo(supabase),
  ]);
  if (!treino) notFound();

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <h1 className="text-2xl font-extrabold">Editar treino</h1>
      <TreinoBuilder
        alunos={alunos}
        catalogo={catalogo}
        treino={treino}
        exerciciosIniciais={treino.exercicios}
      />
    </main>
  );
}
