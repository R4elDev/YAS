"use client";

import { useActionState } from "react";
import { atualizarNome, type PerfilFormState } from "@/lib/actions/perfil";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: PerfilFormState = {};

export function NomeForm({ nome }: { nome: string }) {
  const [state, formAction, isPending] = useActionState(
    atualizarNome,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Label htmlFor="nome">Nome</Label>
      <div className="flex gap-2">
        <Input
          id="nome"
          name="nome"
          defaultValue={nome}
          required
          className="h-12 flex-1 text-base"
        />
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="h-12 font-bold"
        >
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      {state?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
