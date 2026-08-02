"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { criarAluno, type AlunoFormState } from "@/lib/actions/alunos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: AlunoFormState = {};

export function AlunoForm() {
  const [state, formAction, isPending] = useActionState(
    criarAluno,
    initialState
  );

  if (state?.senhaGerada) {
    return <CredenciaisCriadas senha={state.senhaGerada} />;
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome</Label>
        <Input id="nome" name="nome" required className="h-12 text-base" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="h-12 text-base"
        />
      </div>
      {state?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="h-12 text-base font-bold"
      >
        {isPending ? "Criando..." : "Criar aluno"}
      </Button>
    </form>
  );
}

function CredenciaisCriadas({ senha }: { senha: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(senha);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-5">
        <p className="text-sm text-muted-foreground">
          Aluno criado! Repasse esta senha provisória para ele — ela não será
          mostrada novamente. No primeiro login, ele vai ser obrigado a
          trocá-la antes de acessar o app.
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-background px-4 py-3">
          <span className="font-mono text-lg font-bold">{senha}</span>
          <Button type="button" variant="ghost" size="icon" onClick={copiar}>
            {copiado ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>
      </div>
      <Button
        size="lg"
        className="h-12 text-base font-bold"
        render={<Link href="/admin/alunos" />}
      >
        Voltar para alunos
      </Button>
    </div>
  );
}
