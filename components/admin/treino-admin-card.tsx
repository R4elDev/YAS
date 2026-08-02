"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Pencil, Trash2 } from "lucide-react";
import type { TreinoComAluno } from "@/lib/queries/treinos";
import { duplicarTreino, excluirTreino } from "@/lib/actions/treinos";
import { formatDataCurta, todayISODate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TreinoAdminCard({ treino }: { treino: TreinoComAluno }) {
  const [novaData, setNovaData] = useState(todayISODate());
  const [dialogAberto, setDialogAberto] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDuplicar() {
    startTransition(async () => {
      try {
        await duplicarTreino(treino.id, novaData);
        toast.success("Treino duplicado!");
        setDialogAberto(false);
        router.refresh();
      } catch {
        toast.error("Não foi possível duplicar o treino.");
      }
    });
  }

  function handleExcluir() {
    if (
      !window.confirm(
        `Excluir o treino "${treino.nome}"? Essa ação não pode ser desfeita.`
      )
    )
      return;
    startTransition(async () => {
      try {
        await excluirTreino(treino.id);
        toast.success("Treino excluído.");
        router.refresh();
      } catch {
        toast.error("Não foi possível excluir o treino.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold">{treino.nome}</span>
          <span className="text-xs text-muted-foreground">
            {treino.aluno_nome} · {formatDataCurta(treino.data)}
          </span>
        </div>
        {treino.status === "concluido" ? (
          <Badge className="bg-primary/15 text-primary hover:bg-primary/15">
            Concluído
          </Badge>
        ) : (
          <Badge variant="secondary">Pendente</Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 gap-1"
          render={<Link href={`/admin/treinos/${treino.id}/editar`} />}
        >
          <Pencil className="size-3.5" />
          Editar
        </Button>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger
            render={<Button size="sm" variant="outline" className="flex-1 gap-1" />}
          >
            <Copy className="size-3.5" />
            Duplicar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duplicar treino</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-2">
              <Label htmlFor="nova-data">Nova data</Label>
              <Input
                id="nova-data"
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleDuplicar}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? "Duplicando..." : "Duplicar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          onClick={handleExcluir}
          disabled={isPending}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
