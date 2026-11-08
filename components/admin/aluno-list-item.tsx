import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Profile } from "@/lib/types/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AlunoListItem({ aluno }: { aluno: Profile }) {
  return (
    <Link
      href={`/admin/alunos/${aluno.id}`}
      className="yas-card yas-card-link flex min-h-[72px] items-center justify-between gap-3 px-4 py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage src={aluno.avatar_url ?? undefined} alt="" />
          <AvatarFallback className="font-bold">
            {aluno.nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-base font-bold">{aluno.nome}</span>
          <span className="truncate text-xs text-muted-foreground">
            {aluno.email}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={aluno.ativo ? "default" : "secondary"}>
          {aluno.ativo ? "Ativo" : "Inativo"}
        </Badge>
        <ChevronRight className="size-5 text-muted-foreground" aria-hidden />
      </div>
    </Link>
  );
}
