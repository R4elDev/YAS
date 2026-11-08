import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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

  const concluido = treino.status === "concluido";

  return (
    <main className="yas-page">
      <Link
        href="/aluno/treinos"
        className="flex min-h-11 w-fit items-center gap-1 text-sm font-medium text-muted-foreground"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Meus treinos
      </Link>
      <header className="flex flex-col gap-2">
        <p className="yas-kicker">
          {concluido ? "Treino concluído" : "Treino do dia"}
        </p>
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
          {treino.nome}
        </h1>
        <p className="text-sm text-muted-foreground capitalize">
          {formatDataLonga(treino.data)}
        </p>
      </header>
      <TreinoDetalhe treino={treino} exerciciosIniciais={treino.exercicios} />
    </main>
  );
}
