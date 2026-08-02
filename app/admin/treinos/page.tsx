import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listTodosTreinosComAluno } from "@/lib/queries/treinos";
import { TreinoAdminCard } from "@/components/admin/treino-admin-card";
import { Button } from "@/components/ui/button";

export default async function AdminTreinosPage() {
  const supabase = await createClient();
  const treinos = await listTodosTreinosComAluno(supabase);

  return (
    <main className="flex flex-col gap-6 px-5 pt-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Treinos</h1>
        <Button
          size="sm"
          className="gap-1"
          render={<Link href="/admin/treinos/novo" />}
        >
          <Plus className="size-4" />
          Novo treino
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {treinos.length > 0 ? (
          treinos.map((treino) => (
            <TreinoAdminCard key={treino.id} treino={treino} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum treino criado ainda.
          </p>
        )}
      </div>
    </main>
  );
}
