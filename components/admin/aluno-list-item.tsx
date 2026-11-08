import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Profile } from "@/lib/types/database.types";
import { formatDataCurta } from "@/lib/utils/date";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type AlunoResumo = {
  pendentes: number;
  concluidos: number;
  /** ISO date do treino mais recente, se houver. */
  ultimoTreino: string | null;
};

export function AlunoListItem({
  aluno,
  resumo,
}: {
  aluno: Profile;
  resumo?: AlunoResumo;
}) {
  const r = resumo ?? { pendentes: 0, concluidos: 0, ultimoTreino: null };
  return (
    <Link
      href={`/admin/alunos/${aluno.id}`}
      className="yas-card yas-card-link pa-row"
    >
      <div className="pa-who">
        <Avatar className="size-12">
          <AvatarImage src={aluno.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="font-bold">
            {aluno.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <span className="pa-name">{aluno.nome}</span>
          <span className="pa-email">{aluno.email}</span>
        </div>
      </div>
      <div className="pa-end">
        <Badge variant={aluno.ativo ? "default" : "secondary"}>
          {aluno.ativo ? "Ativo" : "Inativo"}
        </Badge>
        <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <p className="pa-meta">
        <span>
          <b>{r.pendentes}</b> pendente{r.pendentes === 1 ? "" : "s"}
        </span>
        <span>
          <b>{r.concluidos}</b> concluído{r.concluidos === 1 ? "" : "s"}
        </span>
        <span>
          {r.ultimoTreino
            ? `Último: ${formatDataCurta(r.ultimoTreino)}`
            : "Sem treinos"}
        </span>
      </p>
    </Link>
  );
}
