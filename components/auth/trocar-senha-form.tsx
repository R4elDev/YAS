"use client";

import { useActionState } from "react";
import {
  trocarSenhaProvisoria,
  type TrocarSenhaFormState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: TrocarSenhaFormState = {};

export function TrocarSenhaForm() {
  const [state, formAction, isPending] = useActionState(
    trocarSenhaProvisoria,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Nova senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="h-12 text-base"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmarPassword">Confirmar nova senha</Label>
        <Input
          id="confirmarPassword"
          name="confirmarPassword"
          type="password"
          autoComplete="new-password"
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
        {isPending ? "Salvando..." : "Definir nova senha"}
      </Button>
    </form>
  );
}
