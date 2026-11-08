import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listTodosTreinosComAluno } from "@/lib/queries/treinos";
import { TreinosListaAdmin } from "@/components/admin/treinos-lista-admin";
import { Button } from "@/components/ui/button";

export default async function AdminTreinosPage() {
  const supabase = await createClient();
  const treinos = await listTodosTreinosComAluno(supabase);

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Área do personal</p>
          <h1>Treinos</h1>
          <p>Todos os treinos enviados aos alunos. Edite, duplique para outra data ou exclua.</p>
        </div>
        <Button
          size="lg"
          className="gap-2"
          render={<Link href="/admin/treinos/novo" />}
        >
          <Plus className="size-4" />
          Novo treino
        </Button>
      </header>

      <TreinosListaAdmin treinos={treinos} />
    </main>
  );
}
