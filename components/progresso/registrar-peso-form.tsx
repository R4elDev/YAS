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
    <form action={formAction} className="yas-card yas-card-pad flex flex-wrap items-end gap-3">
      <div className="flex min-w-0 flex-1 basis-40 flex-col gap-1.5">
        <label htmlFor="peso" className="text-xs font-semibold text-muted-foreground">
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
        className="h-12 min-w-28 font-bold"
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
