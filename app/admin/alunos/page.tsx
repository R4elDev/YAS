import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { listTodosTreinosComAluno } from "@/lib/queries/treinos";
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

  const resumo = [
    { valor: alunos.length, rotulo: "Alunos" },
    { valor: ativos, rotulo: "Ativos" },
    { valor: pendentes, rotulo: "Treinos pendentes" },
    { valor: concluidos, rotulo: "Treinos concluídos" },
  ];

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Área do personal</p>
          <h1>Alunos</h1>
          <p>Veja quem está treinando, crie treinos e acompanhe a evolução de cada um.</p>
        </div>
        <div className="flex flex-wrap gap-2">
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

      <section aria-label="Resumo" className="yas-stat-grid yas-rise">
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
        <AlunosLista alunos={alunos} />
      </section>
    </main>
  );
}
