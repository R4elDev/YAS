import { createClient } from "@/lib/supabase/server";
import { listProgressoPeso, listProgressoFotos, resolverUrlsFotos } from "@/lib/queries/progresso";
import { getMapaProgressaoCarga, listHistoricoTreinos } from "@/lib/queries/treinos";
import { ProgressoView } from "@/components/aluno/progresso-view";

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
    <ProgressoView
      alunoId={alunoId}
      pesoData={pesoData}
      cargaMap={cargaMap}
      fotos={fotosComUrl}
      historico={historico}
    />
  );
}
