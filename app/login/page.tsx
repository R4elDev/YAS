import Link from "next/link";
import { YasPose } from "@/components/layout/yas-pose";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { YasBrand } from "@/components/layout/yas-brand";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string | string[] }>;
}) {
  const { erro } = await searchParams;
  const bancoConfigurado = hasSupabaseEnv();
  const contaInvalida = erro === "conta";
  return <main className="auth-shell">
    <section className="auth-story"><Link href="/" aria-label="YAS início"><YasBrand /></Link><div><p className="eyebrow">BOM TER VOCÊ AQUI</p><h2>Um novo dia.<br />Uma nova<br /><span className="text-primary">conquista.</span></h2></div><YasPose pose="personal" className="auth-avatar" priority sizes="320px" /><p className="text-sm text-muted-foreground">Sua evolução começa com constância.</p></section>
    <section className="auth-form-panel"><Link href="/" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={16} /> Voltar ao início</Link><div className="mx-auto my-auto w-full max-w-sm py-12"><div className="mb-9"><div className="mb-8 lg:hidden"><YasBrand /></div><p className="eyebrow">SEU ESPAÇO YAS</p><h1 className="mb-3 text-3xl font-semibold tracking-tight">Vamos ao treino?</h1><p className="text-sm leading-relaxed text-muted-foreground">Entre com seu email e senha para continuar de onde parou.</p></div><LoginForm bancoConfigurado={bancoConfigurado} contaInvalida={contaInvalida} /><div className="mt-8 flex items-start gap-3 rounded-2xl border border-border p-4"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary" /><p className="text-xs leading-relaxed text-muted-foreground">Seu acesso é criado pelo seu personal. Ainda não recebeu? Fale com ele para começar.</p></div></div><p className="text-center text-xs text-muted-foreground">YAS · Cuidando de cada etapa da sua evolução.</p></section>
  </main>;
}
