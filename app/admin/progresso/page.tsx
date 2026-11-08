import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { AlunosLista } from "@/components/admin/alunos-lista";

export default async function AdminProgressoPage() {
  const supabase = await createClient();
  const alunos = await listAlunos(supabase);

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Acompanhamento</p>
          <h1>Progresso</h1>
          <p>Escolha um aluno para ver peso, cargas, fotos e histórico de treinos.</p>
        </div>
      </header>

      <AlunosLista alunos={alunos} vazioComAcao={false} />
    </main>
  );
}
