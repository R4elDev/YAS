import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import "../alunos.css";
import { AlunoForm } from "@/components/admin/aluno-form";

export default function NovoAlunoPage() {
  return (
    <main className="yas-page personal-alunos">
      <Link href="/admin/alunos" className="pa-back">
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
        <ol className="pa-steps yas-card yas-card-pad">
          <li><b>1</b> Informe nome e email do aluno.</li>
          <li><b>2</b> Copie a senha provisória que aparece em seguida.</li>
          <li><b>3</b> Repasse ao aluno — ele troca no primeiro acesso.</li>
        </ol>
        <AlunoForm />
      </div>
    </main>
  );
}
