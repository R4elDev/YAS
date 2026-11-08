import { YasFace } from "@/components/yas/yas-face";
import type { ProgressoPeso, Treino } from "@/lib/types/database.types";
import type { PontoCarga } from "@/lib/queries/treinos";
import type { ProgressoFotoComUrl } from "@/lib/queries/progresso";
import { GraficoEvolucao } from "@/components/progresso/grafico-evolucao";
import { RegistrarPesoForm } from "@/components/progresso/registrar-peso-form";
import { UploadFoto } from "@/components/progresso/upload-foto";
import { FotoGaleria } from "@/components/progresso/foto-galeria";
import { HistoricoTreinosList } from "@/components/progresso/historico-treinos-list";

interface ProgressoViewProps {
  alunoId: string;
  pesoData: ProgressoPeso[];
  cargaMap: Record<string, PontoCarga[]>;
  fotos: ProgressoFotoComUrl[];
  historico: Treino[];
}

const LIMITE_HISTORICO = 50;

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

/** Apresentação do Progresso do aluno. A página busca os dados; aqui só se desenha. */
export function ProgressoView({
  alunoId,
  pesoData,
  cargaMap,
  fotos,
  historico,
}: ProgressoViewProps) {
  // listHistoricoTreinos corta em 50: acima disso o número é um recorte, não o total.
  const recorteHistorico = historico.length >= LIMITE_HISTORICO;
  const concluidos = historico.filter((t) => t.status === "concluido").length;
  const pesoAtual = pesoData.length > 0 ? pesoData[pesoData.length - 1].peso : null;
  const variacao =
    pesoData.length > 1
      ? Math.round((pesoData[pesoData.length - 1].peso - pesoData[0].peso) * 10) / 10
      : null;

  return (
    <main className="yas-page">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="yas-kicker">Cada passo conta</p>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight">
            Meu progresso
          </h1>
        </div>
        <YasFace
          rosto="feliz-orgulhosa"
          size={56}
          className="sm:size-20!"
        />
      </header>

      <section aria-label="Resumo" className="yas-stat-grid">
        <div className="yas-card yas-stat">
          <strong className="tabular-nums">
            {pesoAtual !== null ? fmt(pesoAtual) : "–"}
            {pesoAtual !== null ? (
              <small className="ml-1 text-sm font-medium text-muted-foreground">kg</small>
            ) : null}
          </strong>
          <span>Peso atual</span>
        </div>
        <div className="yas-card yas-stat">
          <strong className="tabular-nums">
            {variacao !== null ? `${variacao > 0 ? "+" : ""}${fmt(variacao)}` : "–"}
            {variacao !== null ? (
              <small className="ml-1 text-sm font-medium text-muted-foreground">kg</small>
            ) : null}
          </strong>
          <span>Variação no período</span>
        </div>
        <div className="yas-card yas-stat">
          <strong className="tabular-nums">{concluidos}</strong>
          <span>
            {recorteHistorico
              ? `Concluídos nos últimos ${historico.length} treinos`
              : concluidos === 1
                ? "Treino concluído"
                : "Treinos concluídos"}
          </span>
        </div>
        <div className="yas-card yas-stat">
          <strong className="tabular-nums">{fotos.length}</strong>
          <span>{fotos.length === 1 ? "Foto de evolução" : "Fotos de evolução"}</span>
        </div>
      </section>

      <section className="yas-stack" aria-labelledby="titulo-evolucao">
        <h2 id="titulo-evolucao" className="yas-section-title">
          Evolução
        </h2>
        <GraficoEvolucao pesoData={pesoData} cargaMap={cargaMap} />
        <RegistrarPesoForm />
      </section>

      <section className="yas-stack" aria-labelledby="titulo-fotos">
        <h2 id="titulo-fotos" className="yas-section-title">
          Fotos de evolução
        </h2>
        <UploadFoto alunoId={alunoId} />
        <FotoGaleria fotos={fotos} />
      </section>

      <section className="yas-stack" aria-labelledby="titulo-historico">
        <h2 id="titulo-historico" className="yas-section-title">
          Histórico de treinos
        </h2>
        <HistoricoTreinosList treinos={historico} />
      </section>
    </main>
  );
}
