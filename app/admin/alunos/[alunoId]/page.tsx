import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import {
  listProgressoPeso,
  listProgressoFotos,
  resolverUrlsFotos,
} from "@/lib/queries/progresso";
import { getMapaProgressaoCarga, listHistoricoTreinos } from "@/lib/queries/treinos";
import { GraficoEvolucao } from "@/components/progresso/grafico-evolucao";
import { FotoGaleria } from "@/components/progresso/foto-galeria";
import { HistoricoTreinosList } from "@/components/progresso/historico-treinos-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AlunoProgressoAdminPage({
  params,
}: {
  params: Promise<{ alunoId: string }>;
}) {
  const { alunoId } = await params;
  const supabase = await createClient();

  const aluno = await getProfile(supabase, alunoId).catch(() => null);
  if (!aluno || aluno.tipo !== "aluno") notFound();

  const [pesoData, fotos, cargaMap, historico] = await Promise.all([
    listProgressoPeso(supabase, alunoId),
    listProgressoFotos(supabase, alunoId),
    getMapaProgressaoCarga(supabase, alunoId),
    listHistoricoTreinos(supabase, alunoId),
  ]);
  const fotosComUrl = await resolverUrlsFotos(supabase, fotos);

  return (
    <main className="flex flex-col gap-8 px-5 pt-8">
      <div className="flex items-center gap-3">
        <Avatar className="size-14">
          <AvatarImage src={aluno.avatar_url ?? undefined} alt={aluno.nome} />
          <AvatarFallback className="text-lg font-bold">
            {aluno.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold">{aluno.nome}</h1>
          <span className="text-sm text-muted-foreground">{aluno.email}</span>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
          Evolução
        </h2>
        <GraficoEvolucao pesoData={pesoData} cargaMap={cargaMap} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
          Fotos de evolução
        </h2>
        <FotoGaleria fotos={fotosComUrl} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
          Histórico de treinos
        </h2>
        <HistoricoTreinosList treinos={historico} />
      </section>
    </main>
  );
}
