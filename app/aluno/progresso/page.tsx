import { YasPose } from "@/components/layout/yas-pose";
import { createClient } from "@/lib/supabase/server";
import { listProgressoPeso, listProgressoFotos, resolverUrlsFotos } from "@/lib/queries/progresso";
import { getMapaProgressaoCarga, listHistoricoTreinos } from "@/lib/queries/treinos";
import { GraficoEvolucao } from "@/components/progresso/grafico-evolucao";
import { RegistrarPesoForm } from "@/components/progresso/registrar-peso-form";
import { UploadFoto } from "@/components/progresso/upload-foto";
import { FotoGaleria } from "@/components/progresso/foto-galeria";
import { HistoricoTreinosList } from "@/components/progresso/historico-treinos-list";

export default async function ProgressoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const alunoId = user!.id;

  const [pesoData, fotos, cargaMap, historico] = await Promise.all([
    listProgressoPeso(supabase, alunoId),
    listProgressoFotos(supabase, alunoId),
    getMapaProgressaoCarga(supabase, alunoId),
    listHistoricoTreinos(supabase, alunoId),
  ]);
  const fotosComUrl = await resolverUrlsFotos(supabase, fotos);

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Cada passo conta</p>
          <h1>Meu progresso</h1>
          <p>Sua jornada merece ser acompanhada.</p>
        </div>
        <YasPose pose="jornada" className="aluno-pose-destaque" sizes="112px" />
      </header>

      <section className="yas-stack">
        <RegistrarPesoForm />
        <GraficoEvolucao pesoData={pesoData} cargaMap={cargaMap} />
      </section>

      <section className="yas-stack">
        <h2 className="yas-section-title">Fotos de evolução</h2>
        <UploadFoto alunoId={alunoId} />
        <FotoGaleria fotos={fotosComUrl} />
      </section>

      <section className="yas-stack">
        <h2 className="yas-section-title">Histórico de treinos</h2>
        <HistoricoTreinosList treinos={historico} />
      </section>
    </main>
  );
}
