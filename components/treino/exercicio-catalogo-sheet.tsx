"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Search, Dumbbell, PenLine } from "lucide-react";
import type { CatalogoResumo } from "@/lib/queries/catalogo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const GRUPOS_MUSCULARES = [
  "Abdômen",
  "Peitoral",
  "Dorsais",
  "Ombros",
  "Bíceps",
  "Tríceps",
  "Antebraços",
  "Quadríceps",
  "Posterior de coxa",
  "Glúteos",
  "Panturrilhas",
  "Abdutores",
  "Adutores",
  "Lombar",
  "Meio das costas",
  "Trapézio",
  "Pescoço",
];

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

interface ExercicioCatalogoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalogo: CatalogoResumo[];
  onSelecionar: (item: CatalogoResumo) => void;
  onPersonalizado: () => void;
}

export function ExercicioCatalogoSheet({
  open,
  onOpenChange,
  catalogo,
  onSelecionar,
  onPersonalizado,
}: ExercicioCatalogoSheetProps) {
  const [busca, setBusca] = useState("");
  const [grupoAtivo, setGrupoAtivo] = useState<string | null>(null);

  const resultados = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo && !grupoAtivo) return [];

    return catalogo
      .filter((ex) => {
        const bateBusca = !termo || normalizar(ex.nome).includes(termo);
        const bateGrupo =
          !grupoAtivo || ex.musculos_primarios.includes(grupoAtivo);
        return bateBusca && bateGrupo;
      })
      .slice(0, 60);
  }, [catalogo, busca, grupoAtivo]);

  function limparEfechar() {
    setBusca("");
    setGrupoAtivo(null);
    onOpenChange(false);
  }

  function selecionar(item: CatalogoResumo) {
    onSelecionar(item);
    limparEfechar();
  }

  function personalizado() {
    onPersonalizado();
    limparEfechar();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex flex-col gap-0 rounded-t-3xl p-0"
        style={{ height: "85vh" }}
      >
        <SheetHeader className="gap-3 border-b border-border pb-4">
          <SheetTitle>Adicionar exercício</SheetTitle>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar exercício..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="h-11 pl-9 text-base"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {GRUPOS_MUSCULARES.map((grupo) => (
              <button
                key={grupo}
                type="button"
                onClick={() =>
                  setGrupoAtivo((atual) => (atual === grupo ? null : grupo))
                }
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                  grupoAtivo === grupo
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {grupo}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {!busca && !grupoAtivo ? (
            <p className="px-1 py-8 text-center text-sm text-muted-foreground">
              Digite pra buscar ou escolha um grupo muscular.
            </p>
          ) : resultados.length > 0 ? (
            <div className="flex flex-col gap-2">
              {resultados.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selecionar(item)}
                  className="flex items-center gap-3 rounded-2xl bg-card p-2.5 text-left transition-colors active:bg-accent"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    {item.imagem_inicio_url ? (
                      <Image
                        src={item.imagem_inicio_url}
                        alt=""
                        width={56}
                        height={56}
                        className="size-14 object-cover"
                      />
                    ) : (
                      <Dumbbell className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-bold">
                      {item.nome}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {item.musculos_primarios.join(", ")}
                      {item.equipamento ? ` · ${item.equipamento}` : ""}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-1 py-8 text-center text-sm text-muted-foreground">
              Nenhum exercício encontrado no catálogo.
            </p>
          )}
        </div>

        <div className="border-t border-border p-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 w-full gap-2 text-base font-bold"
            onClick={personalizado}
          >
            <PenLine className="size-4" />
            Exercício personalizado
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
