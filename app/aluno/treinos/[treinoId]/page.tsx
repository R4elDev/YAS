import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTreinoComExercicios } from "@/lib/queries/treinos";
import { TreinoDetalhe } from "@/components/treino/treino-detalhe";
import { formatDataLonga } from "@/lib/utils/date";

export default async function TreinoDetalhePage({
  params,
}: {
  params: Promise<{ treinoId: string }>;
}) {
  const { treinoId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const treino = await getTreinoComExercicios(supabase, treinoId);
  if (!treino || treino.aluno_id !== user!.id) notFound();

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">{treino.nome}</h1>
        <p className="text-sm text-muted-foreground">
          {formatDataLonga(treino.data)}
        </p>
      </div>
      <TreinoDetalhe treino={treino} exerciciosIniciais={treino.exercicios} />
    </main>
  );
}
