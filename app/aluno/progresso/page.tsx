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
    <main className="flex flex-col gap-8 px-5 pt-8">
      <h1 className="text-2xl font-extrabold">Meu progresso</h1>

      <section className="flex flex-col gap-4">
        <RegistrarPesoForm />
        <GraficoEvolucao pesoData={pesoData} cargaMap={cargaMap} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
          Fotos de evolução
        </h2>
        <UploadFoto alunoId={alunoId} />
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
