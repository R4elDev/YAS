import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { listTodosTreinosComAluno } from "@/lib/queries/treinos";
import "./alunos.css";
import type { AlunoResumo } from "@/components/admin/aluno-list-item";
import { AlunosLista } from "@/components/admin/alunos-lista";
import { Button } from "@/components/ui/button";

export default async function AdminAlunosPage() {
  const supabase = await createClient();
  const [alunos, treinos] = await Promise.all([
    listAlunos(supabase),
    listTodosTreinosComAluno(supabase),
  ]);

  const ativos = alunos.filter((a) => a.ativo).length;
  const concluidos = treinos.filter((t) => t.status === "concluido").length;
  const pendentes = treinos.length - concluidos;

  const resumos: Record<string, AlunoResumo> = {};
  for (const t of treinos) {
    const r = (resumos[t.aluno_id] ??= {
      pendentes: 0,
      concluidos: 0,
      ultimoTreino: null,
    });
    if (t.status === "concluido") r.concluidos++;
    else r.pendentes++;
    if (!r.ultimoTreino || t.data > r.ultimoTreino) r.ultimoTreino = t.data;
  }

  // listTodosTreinosComAluno traz no máximo 100 registros (os mais recentes).
  // Ao atingir o limite, os números de treino são um recorte, não o total.
  const recorte = treinos.length >= 100;
  const sufixo = recorte ? " (últimos 100 treinos)" : "";

  const resumo = [
    { valor: alunos.length, rotulo: "Alunos" },
    { valor: ativos, rotulo: "Ativos" },
    { valor: pendentes, rotulo: `Treinos pendentes${sufixo}` },
    { valor: concluidos, rotulo: `Treinos concluídos${sufixo}` },
  ];

  return (
    <main className="yas-page personal-alunos">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Área do personal</p>
          <h1>Alunos</h1>
          <p>Veja quem está treinando, crie treinos e acompanhe a evolução de cada um.</p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            render={<Link href="/admin/alunos/novo" />}
          >
            <UserPlus className="size-4" />
            Adicionar aluno
          </Button>
          <Button
            size="lg"
            className="gap-2"
            render={<Link href="/admin/treinos/novo" />}
          >
            <Plus className="size-4" />
            Criar treino
          </Button>
        </div>
      </header>

      <section aria-label="Resumo" className="yas-stat-grid">
        {resumo.map((item) => (
          <div key={item.rotulo} className="yas-card yas-stat">
            <strong>{item.valor}</strong>
            <span>{item.rotulo}</span>
          </div>
        ))}
      </section>

      <section className="yas-stack" aria-labelledby="titulo-alunos">
        <h2 id="titulo-alunos" className="yas-section-title">
          Seus alunos
        </h2>
        {recorte ? (
          <p className="text-xs text-muted-foreground">
            Pendentes, concluídos e último treino de cada aluno consideram apenas
            os 100 treinos mais recentes de todos os alunos.
          </p>
        ) : null}
        <AlunosLista alunos={alunos} resumos={resumos} />
      </section>
    </main>
  );
}
