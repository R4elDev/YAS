import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { listTreinosPeriodo, getTreinoComExercicios } from "@/lib/queries/treinos";
import { getDiasDaSemana, getWeekRange, todayISODate } from "@/lib/utils/date";
import { TreinoDoDiaCard } from "@/components/treino/treino-do-dia-card";
import { SemanaDiasRow } from "@/components/treino/semana-dias-row";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function iniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

  const concluidos = treinosSemana.filter((t) => t.status === "concluido").length;
  const primeiroNome = profile.nome.split(" ")[0];

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Bom treino,</span>
          <h1 className="text-2xl font-extrabold">{primeiroNome}</h1>
        </div>
        <Avatar className="size-11 border border-border">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.nome} />
          <AvatarFallback className="font-bold">
            {iniciais(profile.nome)}
          </AvatarFallback>
        </Avatar>
      </div>

      {treinosSemana.length > 0 ? (
        <div className="flex items-center gap-2 rounded-full bg-card px-4 py-3 text-sm">
          <Flame className="size-4 text-primary" />
          <span>
            <span className="font-bold text-primary">{concluidos}</span> de{" "}
            {treinosSemana.length} treinos da semana concluídos
          </span>
        </div>
      ) : null}

      {treinoDoDia ? (
        <TreinoDoDiaCard
          treino={treinoDoDia}
          totalExercicios={treinoDoDia.exercicios.length}
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          Nenhum treino atribuído para hoje. Aproveite pra descansar 💤
        </div>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Sua semana</h2>
          <Link
            href="/aluno/progresso"
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            Ver progresso
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <SemanaDiasRow dias={dias} treinos={treinosSemana} />
      </section>
    </main>
  );
}
