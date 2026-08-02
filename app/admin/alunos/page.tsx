import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAlunos } from "@/lib/queries/profiles";
import { AlunoListItem } from "@/components/admin/aluno-list-item";

export default async function AdminAlunosPage() {
  const supabase = await createClient();
  const alunos = await listAlunos(supabase);

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <h1 className="text-2xl font-extrabold">Alunos</h1>

      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <Link
          href="/admin/treinos/novo"
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-primary p-4 text-center text-primary-foreground transition-opacity active:opacity-90"
        >
          <Plus className="size-8" />
          <span className="text-sm leading-tight font-bold">
            Criar novo treino
          </span>
        </Link>
        <Link
          href="/admin/alunos/novo"
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-colors active:bg-accent"
        >
          <UserPlus className="size-8 text-muted-foreground" />
          <span className="text-sm leading-tight font-bold">
            Adicionar aluno
          </span>
        </Link>
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
