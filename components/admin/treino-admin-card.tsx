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
  DialogDescription,
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
  const [excluirAberto, setExcluirAberto] = useState(false);
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
    startTransition(async () => {
      try {
        await excluirTreino(treino.id);
        toast.success("Treino excluído.");
        setExcluirAberto(false);
        router.refresh();
      } catch {
        toast.error("Não foi possível excluir o treino.");
      }
    });
  }

  return (
    <div className="yas-card yas-card-pad flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-base font-bold">{treino.nome}</span>
          <span className="truncate text-xs text-muted-foreground">
            {treino.aluno_nome} · {formatDataCurta(treino.data)}
          </span>
        </div>
        {treino.status === "concluido" ? (
          <Badge className="shrink-0 bg-primary/15 text-primary hover:bg-primary/15">
            Concluído
          </Badge>
        ) : (
          <Badge variant="secondary" className="shrink-0">
            Pendente
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 gap-1.5"
          render={<Link href={`/admin/treinos/${treino.id}/editar`} />}
        >
          <Pencil className="size-4" />
          Editar
        </Button>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger
            render={<Button variant="outline" className="flex-1 gap-1.5" />}
          >
            <Copy className="size-4" />
            Duplicar
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duplicar treino</DialogTitle>
              <DialogDescription>
                Cria uma cópia de &quot;{treino.nome}&quot; na data escolhida.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-2">
              <Label htmlFor={`nova-data-${treino.id}`}>Nova data</Label>
              <Input
                id={`nova-data-${treino.id}`}
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleDuplicar}
                disabled={isPending}
                size="lg"
                className="w-full"
              >
                {isPending ? "Duplicando..." : "Duplicar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={excluirAberto} onOpenChange={setExcluirAberto}>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                aria-label={`Excluir treino ${treino.nome}`}
              />
            }
          >
            <Trash2 className="size-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir treino?</DialogTitle>
              <DialogDescription>
                &quot;{treino.nome}&quot; de {treino.aluno_nome} será removido. Essa
                ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setExcluirAberto(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={handleExcluir}
                disabled={isPending}
              >
                {isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
