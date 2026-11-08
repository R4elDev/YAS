import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Treino } from "@/lib/types/database.types";
import type { DiaSemana } from "@/lib/utils/date";
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

interface InicioViewProps {
  nome: string;
  avatarUrl: string | null;
  dias: DiaSemana[];
  treinosSemana: Treino[];
  treinoDoDia: Treino | null;
  totalExerciciosDoDia: number;
}

/** Apresentação da Início do aluno. A página busca os dados; aqui só se desenha. */
export function InicioView({
  nome,
  avatarUrl,
  dias,
  treinosSemana,
  treinoDoDia,
  totalExerciciosDoDia,
}: InicioViewProps) {
  const concluidos = treinosSemana.filter((t) => t.status === "concluido").length;
  const percentualSemana =
    treinosSemana.length > 0
      ? Math.round((concluidos / treinosSemana.length) * 100)
      : 0;
  const primeiroNome = nome.split(" ")[0];

  return (
    <main className="yas-page">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <p className="yas-kicker">Bom treino</p>
          <h1 className="truncate text-3xl font-semibold tracking-tight">
            {primeiroNome}
          </h1>
        </div>
        <Link
          href="/aluno/perfil"
          aria-label="Abrir meu perfil"
          className="aluno-tap shrink-0 rounded-full"
        >
          <Avatar className="size-12 border border-border">
            <AvatarImage src={avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="font-bold">{iniciais(nome)}</AvatarFallback>
          </Avatar>
        </Link>
      </header>

      {treinoDoDia ? (
        <TreinoDoDiaCard
          treino={treinoDoDia}
          totalExercicios={totalExerciciosDoDia}
        />
      ) : (
        <section className="yas-empty">
          <YasFace rosto="cansada-sono" size={96} className="mb-5" />
          <strong>Dia de descanso</strong>
          <p className="pb-6">
            Nenhum treino para hoje. Recuperar também faz parte do resultado.
          </p>
        </section>
      )}

      <section
        aria-labelledby="titulo-semana"
        className="yas-card flex flex-col gap-4 p-4 sm:p-5"
      >
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id="titulo-semana" className="yas-section-title">
              Sua semana
            </h2>
            {treinosSemana.length > 0 ? (
              <p className="text-sm font-semibold tabular-nums">
                {concluidos} de {treinosSemana.length}{" "}
                {treinosSemana.length === 1 ? "treino concluído" : "treinos concluídos"}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum treino marcado nesta semana.
              </p>
            )}
          </div>
          <Link
            href="/aluno/progresso"
            className="-mr-2 flex min-h-11 shrink-0 items-center gap-1 px-2 text-sm font-medium text-primary"
          >
            Progresso
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        {treinosSemana.length > 0 ? (
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentualSemana}
            aria-label="Treinos concluídos na semana"
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${percentualSemana}%` }}
            />
          </div>
        ) : null}

        <SemanaDiasRow dias={dias} treinos={treinosSemana} />
      </section>
    </main>
  );
}
