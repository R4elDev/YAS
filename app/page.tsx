import Link from "next/link";
import Image from "next/image";
import { YasPose, type YasPoseName } from "@/components/layout/yas-pose";
import { ArrowUpRight, ArrowRight, Dumbbell, ChartNoAxesCombined, CalendarDays, Check, MoveUpRight, Sparkles } from "lucide-react";
import { YasBrand } from "@/components/layout/yas-brand";

const recursos = [
  { icon: Dumbbell, number: "01", pose: "halter" as YasPoseName, title: "Seu treino. Seu ritmo.", text: "Exercícios, séries e repetições organizados pelo seu personal. Tudo à mão, do aquecimento à última série." },
  { icon: ChartNoAxesCombined, number: "02", pose: "forca" as YasPoseName, title: "Cada conquista conta.", text: "Registre suas cargas, acompanhe seu peso e veja sua evolução ganhar forma ao longo do tempo." },
  { icon: CalendarDays, number: "03", pose: "planejamento" as YasPoseName, title: "Constância, com direção.", text: "Sua semana de treinos em um só lugar. Saiba o que fazer hoje e acompanhe o que já conquistou." },
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <header className="landing-header">
        <Link href="/" aria-label="YAS início"><YasBrand /></Link>
        <nav aria-label="Menu principal" className="flex items-center gap-7">
          <a href="#experiencia" className="hidden text-sm text-muted-foreground sm:block">A experiência</a>
          <Link href="/login" className="landing-login">Entrar <ArrowUpRight size={16} /></Link>
        </nav>
      </header>
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="size-2 rounded-full bg-primary" /> TREINO COM PROPÓSITO</p>
          <h1>Mais forte.<br />Mais confiante.<br /><span className="text-primary">Mais você.</span></h1>
          <p className="hero-description">Seu próximo passo começa aqui. Treinos personalizados, evolução de verdade e a Yas acompanhando cada conquista.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/login" className="primary-link">Acessar meus treinos <ArrowUpRight size={20} /></Link>
            <a href="#experiencia" className="inline-flex items-center gap-2 text-sm font-medium">Conhecer o YAS <ArrowRight size={16} /></a>
          </div>
          <div className="hero-footnote"><span className="flex size-9 items-center justify-center rounded-full border border-border"><Check size={16} /></span><span>Planejado pelo seu personal.<br /><strong>Feito para a sua jornada.</strong></span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-visual-top"><span>YAS / PERSONAL TRAINING</span><Sparkles size={20} /></div>
          <span className="hero-backdrop-word" aria-hidden="true">YAS</span>
          <YasPose pose="convite" priority className="hero-avatar" sizes="(max-width: 640px) 90vw, 480px" />
          <div className="hero-coach-label"><Image src="/yas/avatar-coach.png" alt="Yas, personal trainer" width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" /><div><strong>Vamos juntas?</strong><p>Um treino de cada vez.</p></div><ArrowUpRight size={20} className="ml-auto" /></div>
          <div className="hero-visual-bottom"><span>FOCO EM VOCÊ.</span><span>FORÇA EM CADA PASSO.</span></div>
        </div>
      </section>
      <div className="landing-strip" aria-hidden="true"><span>SEU CORPO</span><span className="text-primary">+</span><span>SEU RITMO</span><span className="text-primary">+</span><span>SUA EVOLUÇÃO</span><ArrowUpRight className="text-primary" /></div>
      <section id="experiencia" className="landing-features">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow">MENOS COMPLICAÇÃO. MAIS MOVIMENTO.</p><h2>Tudo para você<br />seguir em frente.</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">O cuidado do seu personal encontra a praticidade de ter seu treino sempre com você.</p></div>
        <div className="feature-grid">{recursos.map(({ icon: Icon, number, title, text, pose }) => <article key={number} className="feature-item"><div className="flex items-center justify-between"><Icon size={28} strokeWidth={1.5} className="text-primary" /><span className="text-xs text-muted-foreground">/{number}</span></div><div className="feature-portrait"><YasPose pose={pose} className="feature-pose" /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="landing-ritual" aria-labelledby="ritual-title">
        <div className="ritual-heading"><p className="eyebrow">CUIDADO EM CADA ETAPA</p><h2 id="ritual-title">Seu momento.<br /><span className="text-primary">Do começo ao fim.</span></h2><p>Reserve um tempo para você e siga as orientações do seu personal em cada etapa do treino.</p></div>
        <div className="ritual-grid">
          {([
            { pose: "alongamento", title: "Entre no ritmo", text: "Prepare-se para o treino do dia." },
            { pose: "preparo", title: "Esteja presente", text: "Concentre-se em cada movimento." },
            { pose: "hidratacao", title: "Cuide de você", text: "Faça suas pausas e mantenha a água por perto." },
          ] as const).map(({ pose, title, text }) => <article className="ritual-item" key={pose}><div className="ritual-portrait"><YasPose pose={pose} className="ritual-pose" /></div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
      <section className="landing-start"><div><p className="eyebrow">O PRIMEIRO PASSO É SEU</p><h2>Seu treino te espera.</h2><p>Já recebeu seu acesso? Entre e comece sua jornada.<br />Para fazer parte, fale com seu personal.</p></div><YasPose pose="conquista" className="start-pose" sizes="240px" /><Link href="/login" className="start-circle" aria-label="Entrar no YAS"><MoveUpRight size={38} strokeWidth={1.5} /></Link></section>
      <footer className="landing-footer"><YasBrand /><span>Treino com propósito. Evolução com você.</span><span>YAS © {new Date().getFullYear()}</span></footer>
    </main>
  );
}
