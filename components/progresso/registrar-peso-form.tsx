"use client";

import { useActionState } from "react";
import { registrarPeso, type PesoFormState } from "@/lib/actions/progresso";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: PesoFormState = {};

export function RegistrarPesoForm() {
  const [state, formAction, isPending] = useActionState(
    registrarPeso,
    initialState
  );

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="peso" className="text-xs text-muted-foreground">
          Peso de hoje (kg)
        </label>
        <Input
          id="peso"
          name="peso"
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          required
          className="h-12 text-base"
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 font-bold"
      >
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
      {state?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
