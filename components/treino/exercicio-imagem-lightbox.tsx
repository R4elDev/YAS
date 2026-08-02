"use client";

import { useState } from "react";
import Image from "next/image";
import { Dumbbell, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ExercicioImagemLightboxProps {
  nome: string;
  imagemUrl: string | null;
  imagemFimUrl: string | null;
}

export function ExercicioImagemLightbox({
  nome,
  imagemUrl,
  imagemFimUrl,
}: ExercicioImagemLightboxProps) {
  const [open, setOpen] = useState(false);
  const [etapa, setEtapa] = useState<"inicio" | "fim">("inicio");

  if (!imagemUrl) {
    return (
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        <Dumbbell className="size-6 text-muted-foreground" />
      </div>
    );
  }

  const temDuasEtapas = Boolean(imagemFimUrl);
  const imagemExibida = etapa === "fim" && imagemFimUrl ? imagemFimUrl : imagemUrl;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar imagem de ${nome}`}
        className="group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted"
      >
        <Image
          src={imagemUrl}
          alt={nome}
          width={64}
          height={64}
          className="size-16 object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-active:bg-black/30">
          <Expand className="size-4 text-white opacity-0 transition-opacity group-active:opacity-100" />
        </span>
      </button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEtapa("inicio");
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md gap-3 p-4">
          <DialogTitle className="pr-6 text-base font-bold">
            {nome}
          </DialogTitle>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              key={imagemExibida}
              src={imagemExibida}
              alt={nome}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 448px"
            />
          </div>
          {temDuasEtapas ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEtapa("inicio")}
                className={cn(
                  "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
                  etapa === "inicio"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                Início
              </button>
              <button
                type="button"
                onClick={() => setEtapa("fim")}
                className={cn(
                  "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
                  etapa === "fim"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                Fim
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
