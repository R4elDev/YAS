import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { TreinoBuilder } from "@/components/treino/treino-builder";

export default async function NovoTreinoPage() {
  const supabase = await createClient();
  const alunos = await listAlunos(supabase);

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Treinos</p>
          <h1>Criar treino</h1>
          <p>Escolha o aluno, a data e monte a sequência de exercícios.</p>
        </div>
      </header>
      <TreinoBuilder alunos={alunos} catalogo={[]} />
    </main>
  );
}
