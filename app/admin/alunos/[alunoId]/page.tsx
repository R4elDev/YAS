import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "../alunos.css";
import { formatDataCurta } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
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

  const pendentes = historico.filter((t) => t.status !== "concluido");
  const concluidos = historico.length - pendentes.length;
  const recentes = historico.slice(0, 5);
  // listHistoricoTreinos limita a 50 registros (padrão da consulta).
  const sufixo = historico.length >= 50 ? " (últimos 50 treinos)" : "";
  const resumo = [
    { valor: pendentes.length, rotulo: `Treinos pendentes${sufixo}` },
    { valor: concluidos, rotulo: `Treinos concluídos${sufixo}` },
    {
      valor: historico[0] ? formatDataCurta(historico[0].data) : "—",
      rotulo: "Último treino",
    },
  ];

  return (
    <main className="yas-page personal-alunos">
      <Link href="/admin/alunos" className="pa-back">
        <ChevronLeft className="size-4" aria-hidden />
        Alunos
      </Link>

      <header className="yas-card yas-card-pad pa-profile">
        <Avatar className="size-14 sm:size-16">
          <AvatarImage src={aluno.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="text-xl font-bold">
            {aluno.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="pa-profile-main">
          <p className="yas-kicker">Aluno</p>
          <h1>{aluno.nome}</h1>
          <span className="pa-email">{aluno.email}</span>
        </div>
        <Badge
          variant={aluno.ativo ? "default" : "secondary"}
          className="shrink-0"
        >
          {aluno.ativo ? "Ativo" : "Inativo"}
        </Badge>
      </header>

      <section aria-label="Resumo do aluno" className="yas-stat-grid">
        {resumo.map((item) => (
          <div key={item.rotulo} className="yas-card yas-stat">
            <strong>{item.valor}</strong>
            <span>{item.rotulo}</span>
          </div>
        ))}
      </section>

      <nav aria-label="Seções do aluno" className="pa-anchors">
        {[
          ["#t-treinos", "Treinos"],
          ["#t-evolucao", "Evolução"],
          ["#t-historico", "Histórico"],
          ["#t-fotos", "Fotos"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="yas-chip">
            {label}
          </a>
        ))}
      </nav>

      <section className="yas-stack" aria-labelledby="t-treinos">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="t-treinos" className="yas-section-title">
            Treinos recentes
          </h2>
          <Button
            size="lg"
            className="gap-2"
            render={<Link href="/admin/treinos/novo" />}
          >
            <Plus className="size-4" />
            Criar treino
          </Button>
        </div>
        {recentes.length > 0 ? (
          <div className="yas-grid">
            {recentes.map((t) => (
              <Link
                key={t.id}
                href={`/admin/treinos/${t.id}/editar`}
                className="yas-card yas-card-link pa-treino"
              >
                <span>
                  <strong>{t.nome}</strong>
                  <small>
                    {formatDataCurta(t.data)} ·{" "}
                    {t.status === "concluido" ? "Concluído" : "Pendente"}
                  </small>
                </span>
                <ChevronRight
                  className="size-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="yas-empty pb-6" role="status">
            <strong>Nenhum treino para este aluno</strong>
            <p>Crie o primeiro treino para começar o acompanhamento.</p>
          </div>
        )}
      </section>

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
