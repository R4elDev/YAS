import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

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
    <main className="yas-page">
      <Link
        href="/admin/alunos"
        className="inline-flex min-h-11 w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Alunos
      </Link>

      <header className="yas-card yas-card-pad flex flex-wrap items-center gap-x-4 gap-y-3">
        <Avatar className="size-14 sm:size-16">
          <AvatarImage src={aluno.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="text-xl font-bold">
            {aluno.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 basis-40 flex-col gap-1">
          <p className="yas-kicker">Aluno</p>
          <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl">
            {aluno.nome}
          </h1>
          <span className="truncate text-sm text-muted-foreground">
            {aluno.email}
          </span>
        </div>
        <Badge
          variant={aluno.ativo ? "default" : "secondary"}
          className="shrink-0"
        >
          {aluno.ativo ? "Ativo" : "Inativo"}
        </Badge>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] xl:items-start">
        <section className="yas-stack min-w-0" aria-labelledby="t-evolucao">
          <h2 id="t-evolucao" className="yas-section-title">
            Evolução
          </h2>
          <GraficoEvolucao pesoData={pesoData} cargaMap={cargaMap} />
        </section>

        <section className="yas-stack min-w-0" aria-labelledby="t-historico">
          <h2 id="t-historico" className="yas-section-title">
            Histórico de treinos
          </h2>
          <HistoricoTreinosList treinos={historico} />
        </section>
      </div>

      <section className="yas-stack" aria-labelledby="t-fotos">
        <h2 id="t-fotos" className="yas-section-title">
          Fotos de evolução
        </h2>
        <FotoGaleria fotos={fotosComUrl} />
      </section>
    </main>
  );
}
