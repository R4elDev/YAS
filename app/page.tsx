import Link from "next/link";
import Image from "next/image";
import {
  Dumbbell,
  LineChart,
  Images,
  Users,
  ClipboardList,
  Search,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PesosCaindo } from "@/components/landing/pesos-caindo";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { YasHeroMark } from "@/components/landing/yas-hero-mark";

const RECURSOS_ALUNO = [
  {
    icon: Dumbbell,
    titulo: "Treino do dia em destaque",
    descricao:
      "Abra o app e veja na hora o treino de hoje, os exercícios da semana e o que já foi concluído.",
  },
  {
    icon: ClipboardList,
    titulo: "Execução guiada",
    descricao:
      "Cada exercício com foto, séries, repetições e campo pra registrar a carga usada — sem depender de caderno ou planilha.",
  },
  {
    icon: LineChart,
    titulo: "Evolução visível",
    descricao:
      "Gráficos de peso corporal e de carga por exercício, pra você ver o progresso de verdade ao longo do tempo.",
  },
  {
    icon: Images,
    titulo: "Fotos de progresso",
    descricao:
      "Envie fotos organizadas por data e acompanhe sua transformação lado a lado com os treinos.",
  },
];

const RECURSOS_ADMIN = [
  {
    icon: Users,
    titulo: "Todos os alunos num só lugar",
    descricao:
      "Veja status, progresso e histórico de cada aluno sem precisar de planilha separada.",
  },
  {
    icon: Search,
    titulo: "Catálogo com +870 exercícios",
    descricao:
      "Busque por nome ou grupo muscular, com foto real de cada exercício, e monte o treino em minutos.",
  },
  {
    icon: UserPlus,
    titulo: "Acesso controlado",
    descricao:
      "Só você cadastra quem entra no app — cada aluno recebe login e senha provisória, sem cadastro aberto ao público.",
  },
];

const COMO_FUNCIONA = [
  {
    numero: "1",
    titulo: "Seu instrutor libera seu acesso",
    descricao: "Sem cadastro público — é o seu personal quem cria seu login.",
  },
  {
    numero: "2",
    titulo: "Você recebe email e senha",
    descricao: "Entra no app e já vê o treino do dia esperando por você.",
  },
  {
    numero: "3",
    titulo: "Treina e registra tudo",
    descricao: "Marca carga, conclui exercícios e acompanha sua evolução.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative flex flex-1 flex-col overflow-x-hidden">
      <PesosCaindo />

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-5 py-3 backdrop-blur">
        <Image
          src="/logo-app.png"
          alt="YAS"
          width={40}
          height={40}
          priority
          className="size-9 object-contain"
        />
        <Button size="sm" className="font-bold" render={<Link href="/login" />}>
          Entrar
        </Button>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 pt-14 pb-12 text-center">
        <YasHeroMark />
        <h1 className="max-w-lg text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
          Seus treinos e sua evolução, acompanhados de verdade
        </h1>
        <p className="max-w-md text-muted-foreground sm:text-lg">
          O YAS conecta você ao seu personal trainer: treinos montados sob
          medida, execução guiada e progresso visível — tudo no celular.
        </p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-bold"
            render={<Link href="/login" />}
          >
            Entrar no app
          </Button>
        </div>
      </section>

      {/* Como funciona */}
      <section className="flex flex-col gap-6 px-5 py-12">
        <ScrollReveal>
          <h2 className="text-center text-sm font-bold tracking-wide text-muted-foreground uppercase">
            Como funciona
          </h2>
        </ScrollReveal>
        <div className="mx-auto grid w-full max-w-3xl gap-4 sm:grid-cols-3">
          {COMO_FUNCIONA.map((passo, i) => (
            <ScrollReveal
              key={passo.numero}
              delayMs={i * 120}
              className="flex flex-col gap-2 rounded-2xl bg-card p-5"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                {passo.numero}
              </span>
              <h3 className="text-base font-bold">{passo.titulo}</h3>
              <p className="text-sm text-muted-foreground">
                {passo.descricao}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Recursos do aluno */}
      <section className="flex flex-col gap-6 px-5 py-12">
        <ScrollReveal className="mx-auto flex max-w-3xl flex-col gap-1 text-center">
          <h2 className="text-2xl font-extrabold">Pra quem treina</h2>
          <p className="text-sm text-muted-foreground">
            Tudo que você precisa pra seguir o plano do seu instrutor sem
            perder o fio.
          </p>
        </ScrollReveal>
        <div className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          {RECURSOS_ALUNO.map(({ icon: Icon, titulo, descricao }, i) => (
            <ScrollReveal
              key={titulo}
              delayMs={i * 100}
              className="flex items-start gap-4 rounded-2xl bg-card p-5"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold">{titulo}</h3>
                <p className="text-sm text-muted-foreground">{descricao}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Recursos do admin */}
      <section className="flex flex-col gap-6 bg-card/40 px-5 py-12">
        <ScrollReveal className="mx-auto flex max-w-3xl flex-col gap-1 text-center">
          <h2 className="text-2xl font-extrabold">Pra personal trainers</h2>
          <p className="text-sm text-muted-foreground">
            Monte e gerencie os treinos de todos os seus alunos em um só
            painel.
          </p>
        </ScrollReveal>
        <div className="mx-auto grid w-full max-w-3xl gap-3 sm:grid-cols-3">
          {RECURSOS_ADMIN.map(({ icon: Icon, titulo, descricao }, i) => (
            <ScrollReveal
              key={titulo}
              delayMs={i * 100}
              className="flex flex-col gap-3 rounded-2xl bg-card p-5"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold">{titulo}</h3>
                <p className="text-sm text-muted-foreground">{descricao}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <ScrollReveal className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <CheckCircle2 className="size-4 text-primary" />
          Acesso liberado direto pelo seu instrutor
        </span>
        <h2 className="text-2xl font-extrabold">Já tem seu login?</h2>
        <Button
          size="lg"
          className="h-12 w-full max-w-xs text-base font-bold"
          render={<Link href="/login" />}
        >
          Entrar no app
        </Button>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ainda não treina com a gente? Fale com seu instrutor pra ele criar
          seu acesso.
        </p>
      </ScrollReveal>

      <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        YAS — acompanhamento de treinos
      </footer>
    </main>
  );
}
