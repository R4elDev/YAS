"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { YasFace } from "@/components/yas/yas-face";
import {
  chaveOnboarding,
  passosOnboarding,
  type PapelOnboarding,
} from "@/components/yas/onboarding-passos";

/** true se o onboarding ainda nao foi concluido/pulado. Storage indisponivel => false. */
export function lerOnboardingPendente(userId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(chaveOnboarding(userId)) === null;
  } catch {
    return false;
  }
}

function gravarOnboarding(userId: string, estado: "concluido" | "pulado") {
  try {
    window.localStorage.setItem(chaveOnboarding(userId), estado);
  } catch {
    /* sem storage: segue sem persistir */
  }
}

interface YasOnboardingProps {
  papel: PapelOnboarding;
  userId: string;
  nome: string;
  onFechar: () => void;
}

export function YasOnboarding({
  papel,
  userId,
  nome,
  onFechar,
}: YasOnboardingProps) {
  const passos = useMemo(() => passosOnboarding(papel, nome), [papel, nome]);
  const [indice, setIndice] = useState(0);
  const [aberto, setAberto] = useState(true);

  // Sinal para outros pop-ups (ex.: motivacao) enquanto o onboarding esta ativo.
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.yasOnboarding = "ativo";
    window.dispatchEvent(
      new CustomEvent("yas:onboarding", { detail: { ativo: true } })
    );
    return () => {
      delete raiz.dataset.yasOnboarding;
      window.dispatchEvent(
        new CustomEvent("yas:onboarding", { detail: { ativo: false } })
      );
    };
  }, []);

  const passo = passos[indice];
  const ultimo = indice === passos.length - 1;

  function fechar(estado: "concluido" | "pulado") {
    gravarOnboarding(userId, estado);
    setAberto(false);
    onFechar();
  }

  return (
    <Dialog
      open={aberto}
      disablePointerDismissal
      onOpenChange={(open) => {
        if (!open) fechar("pulado"); // Esc = pular
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="gap-5 p-5 sm:max-w-sm"
      >
        <div
          key={passo.id}
          className="animate-in fade-in-0 slide-in-from-right-3 duration-200 motion-reduce:slide-in-from-right-0 flex flex-col items-center gap-3 text-center"
        >
          <YasFace rosto={passo.rosto} size={96} />
          <DialogTitle className="text-lg font-bold">{passo.titulo}</DialogTitle>
          <DialogDescription className="max-w-[32ch] text-sm leading-relaxed">
            {passo.texto}
          </DialogDescription>
        </div>

        <div
          className="flex items-center justify-center gap-2"
          role="group"
          aria-label={`Passo ${indice + 1} de ${passos.length}`}
        >
          {passos.map((p, i) => (
            <span
              key={p.id}
              aria-hidden="true"
              className={`h-2 rounded-full transition-[width,opacity] duration-200 ${
                i === indice ? "w-6 bg-primary" : "w-2 bg-primary/30"
              }`}
            />
          ))}
          <span className="sr-only" aria-live="polite">
            Passo {indice + 1} de {passos.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {indice > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 font-semibold"
              onClick={() => setIndice((i) => i - 1)}
            >
              Voltar
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="h-11 flex-1 font-semibold text-muted-foreground"
              onClick={() => fechar("pulado")}
            >
              Pular
            </Button>
          )}
          <Button
            type="button"
            autoFocus
            className="h-11 flex-1 font-bold"
            onClick={() =>
              ultimo ? fechar("concluido") : setIndice((i) => i + 1)
            }
          >
            {ultimo ? "Concluir" : "Próximo"}
          </Button>
        </div>
        {indice > 0 && !ultimo ? (
          <button
            type="button"
            onClick={() => fechar("pulado")}
            className="-mt-2 min-h-11 text-sm font-medium text-muted-foreground"
          >
            Pular
          </button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
