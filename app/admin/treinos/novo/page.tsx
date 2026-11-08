import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { listCatalogoResumo } from "@/lib/queries/catalogo";
import { TreinoBuilder } from "@/components/treino/treino-builder";

export default async function NovoTreinoPage() {
  const supabase = await createClient();
  const [alunos, catalogo] = await Promise.all([
    listAlunos(supabase),
    listCatalogoResumo(supabase),
  ]);

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Treinos</p>
          <h1>Criar treino</h1>
          <p>Escolha o aluno, a data e monte a sequência de exercícios.</p>
        </div>
      </header>
      <TreinoBuilder alunos={alunos} catalogo={catalogo} />
    </main>
  );
}
