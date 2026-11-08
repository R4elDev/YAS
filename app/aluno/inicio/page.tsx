import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { listTreinosPeriodo, getTreinoComExercicios } from "@/lib/queries/treinos";
import { getDiasDaSemana, getWeekRange, todayISODate } from "@/lib/utils/date";
import { TreinoDoDiaCard } from "@/components/treino/treino-do-dia-card";
import { SemanaDiasRow } from "@/components/treino/semana-dias-row";
import { YasFace } from "@/components/yas/yas-face";
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
  const percentualSemana =
    treinosSemana.length > 0
      ? Math.round((concluidos / treinosSemana.length) * 100)
      : 0;
  const primeiroNome = profile.nome.split(" ")[0];

  return (
    <main className="yas-page">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <p className="yas-kicker">Bom treino</p>
          <h1 className="truncate text-3xl font-semibold tracking-tight">
            {primeiroNome}
          </h1>
        </div>
        <Avatar className="size-12 shrink-0 border border-border">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.nome} />
          <AvatarFallback className="font-bold">
            {iniciais(profile.nome)}
          </AvatarFallback>
        </Avatar>
      </header>

      {treinosSemana.length > 0 ? (
        <section
          aria-label="Resumo da semana"
          className="yas-card flex flex-col gap-3 p-4"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Semana em andamento
            </span>
            <span className="text-sm font-semibold tabular-nums">
              {concluidos} de {treinosSemana.length} concluídos
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentualSemana}
            aria-label="Treinos concluídos na semana"
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${percentualSemana}%` }}
            />
          </div>
        </section>
      ) : null}

      {treinoDoDia ? (
        <TreinoDoDiaCard
          treino={treinoDoDia}
          totalExercicios={treinoDoDia.exercicios.length}
        />
      ) : (
        <section className="yas-empty">
          <YasFace rosto="cansada-sono" size={104} className="mb-5" />
          <strong>Dia de descanso</strong>
          <p>Nenhum treino para hoje. Recuperar também faz parte do resultado.</p>
        </section>
      )}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="yas-section-title">Sua semana</h2>
          <Link
            href="/aluno/progresso"
            className="flex min-h-11 items-center gap-1 text-sm font-medium text-primary"
          >
            Ver progresso
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <SemanaDiasRow dias={dias} treinos={treinosSemana} />
      </section>
    </main>
  );
}
