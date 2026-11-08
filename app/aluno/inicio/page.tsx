import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { listTreinosPeriodo, getTreinoComExercicios } from "@/lib/queries/treinos";
import { getDiasDaSemana, getWeekRange, todayISODate } from "@/lib/utils/date";
import { InicioView } from "@/components/aluno/inicio-view";

export default async function InicioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getProfile(supabase, user!.id);
  const dias = getDiasDaSemana();
  const { start, end } = getWeekRange();
  const treinosSemana = await listTreinosPeriodo(supabase, user!.id, start, end);

  const hoje = todayISODate();
  const treinoDoDiaBase = treinosSemana.find((t) => t.data === hoje);
  const treinoDoDia = treinoDoDiaBase
    ? await getTreinoComExercicios(supabase, treinoDoDiaBase.id)
    : null;

  return (
    <InicioView
      nome={profile.nome}
      avatarUrl={profile.avatar_url}
      dias={dias}
      treinosSemana={treinosSemana}
      treinoDoDia={treinoDoDia}
      totalExerciciosDoDia={treinoDoDia?.exercicios.length ?? 0}
    />
  );
}
