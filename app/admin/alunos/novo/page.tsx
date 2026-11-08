import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AlunoForm } from "@/components/admin/aluno-form";

export default function NovoAlunoPage() {
  return (
    <main className="yas-page">
      <Link
        href="/admin/alunos"
        className="inline-flex min-h-11 w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Alunos
      </Link>
      <div className="yas-page-narrow yas-stack">
        <header className="yas-page-header">
          <div>
            <p className="yas-kicker">Novo aluno</p>
            <h1>Adicionar aluno</h1>
            <p>Uma senha provisória é gerada. O aluno troca no primeiro acesso.</p>
          </div>
        </header>
        <AlunoForm />
      </div>
    </main>
  );
}
