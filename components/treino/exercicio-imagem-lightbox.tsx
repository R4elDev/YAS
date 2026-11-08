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
  /** "lg" amplia a miniatura (card do aluno). Padrão preserva o builder. */
  tamanho?: "md" | "lg";
}

export function ExercicioImagemLightbox({
  nome,
  imagemUrl,
  imagemFimUrl,
  tamanho = "md",
}: ExercicioImagemLightboxProps) {
  const lado = tamanho === "lg" ? "size-24" : "size-16";
  const px = tamanho === "lg" ? 96 : 64;
  const [open, setOpen] = useState(false);
  const [etapa, setEtapa] = useState<"inicio" | "fim">("inicio");

  if (!imagemUrl) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted", lado)}>
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
        className={cn("group relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted", lado)}
      >
        <Image
          src={imagemUrl}
          alt={nome}
          width={px}
          height={px}
          unoptimized={imagemUrl.endsWith(".gif")}
          className={cn("object-cover", lado)}
        />
        <span
          aria-hidden
          className="absolute right-1 bottom-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <Expand className="size-3.5" />
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
              unoptimized={imagemExibida.endsWith(".gif")}
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
                  "min-h-11 flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
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
                  "min-h-11 flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
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
