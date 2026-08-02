import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { AlunoListItem } from "@/components/admin/aluno-list-item";

export default async function AdminProgressoPage() {
  const supabase = await createClient();
  const alunos = await listAlunos(supabase);

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold">Progresso</h1>
        <p className="text-sm text-muted-foreground">
          Selecione um aluno para ver a evolução.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {alunos.length > 0 ? (
          alunos.map((aluno) => (
            <AlunoListItem key={aluno.id} aluno={aluno} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum aluno cadastrado ainda.
          </p>
        )}
      </div>
    </main>
  );
}
