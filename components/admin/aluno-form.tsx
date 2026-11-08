"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Copy, Check, KeyRound } from "lucide-react";
import { criarAluno, type AlunoFormState } from "@/lib/actions/alunos";
import { YasFace } from "@/components/yas/yas-face";
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
    <form action={formAction} className="yas-form yas-card yas-card-pad">
      <div className="flex flex-col gap-2">
        <Label htmlFor="nome">Nome do aluno</Label>
        <Input
          id="nome"
          name="nome"
          required
          autoComplete="off"
          autoCapitalize="words"
          placeholder="Ex.: Maria Souza"
          className="h-12 text-base"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          required
          placeholder="aluno@email.com"
          aria-describedby="email-ajuda"
          className="h-12 text-base"
        />
        <p id="email-ajuda" className="text-xs text-muted-foreground">
          É com este email que o aluno entra no app.
        </p>
      </div>
      <div aria-live="polite">
        {state?.error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {state.error}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="h-12 w-full text-base font-bold"
      >
        {isPending ? "Criando..." : "Criar aluno"}
      </Button>
    </form>
  );
}

function CredenciaisCriadas({ senha }: { senha: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(senha);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="yas-stack">
      <div className="yas-card relative overflow-hidden border-primary/40 bg-primary/10 p-5">
        <div className="pr-20 sm:pr-28">
          <p className="inline-flex items-center gap-2 text-sm font-bold">
            <KeyRound className="size-4 text-primary" aria-hidden />
            Aluno criado!
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Repasse esta senha provisória para ele — ela não será mostrada
            novamente. No primeiro login, ele vai ser obrigado a trocá-la antes
            de acessar o app.
          </p>
        </div>
        <YasFace
          rosto="feliz-orgulhosa"
          size={88}
          className="pointer-events-none absolute top-4 right-4"
        />
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-background px-4 py-2">
          <span className="min-w-0 break-all font-mono text-lg font-bold select-all">
            {senha}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copiar}
            aria-label={copiado ? "Senha copiada" : "Copiar senha"}
          >
            {copiado ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>
        <p className="sr-only" role="status">
          {copiado ? "Senha copiada" : ""}
        </p>
      </div>
      <Button
        size="lg"
        className="h-12 w-full text-base font-bold"
        render={<Link href="/admin/alunos" />}
      >
        Voltar para alunos
      </Button>
    </div>
  );
}
