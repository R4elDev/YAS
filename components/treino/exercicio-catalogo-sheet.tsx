"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Search, Dumbbell, PenLine, Loader2, RefreshCw } from "lucide-react";
import { buscarExerciciosCatalogo } from "@/lib/actions/catalogo-externo";
import { NOMES_GRUPOS } from "@/lib/exercicios/dicionario";
import type { ItemCatalogoExterno } from "@/lib/exercicios/tipos";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExercicioCatalogoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelecionar: (item: ItemCatalogoExterno) => void;
  onPersonalizado: () => void;
}

export function ExercicioCatalogoSheet({
  open,
  onOpenChange,
  onSelecionar,
  onPersonalizado,
}: ExercicioCatalogoSheetProps) {
  const [busca, setBusca] = useState("");
  const [grupoAtivo, setGrupoAtivo] = useState<string | null>(null);
  const [itens, setItens] = useState<ItemCatalogoExterno[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [temMais, setTemMais] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const requisicao = useRef(0);

  const carregar = useCallback(
    async (termo: string, grupo: string | null, proxima: number) => {
      const id = ++requisicao.current;
      setCarregando(true);
      setErro(null);
      try {
        const res = await buscarExerciciosCatalogo({
          busca: termo,
          grupo,
          pagina: proxima,
        });
        if (id !== requisicao.current) return; // resposta obsoleta
        if (!res.ok) {
          setErro(res.erro);
          return;
        }
        setItens((atual) =>
          proxima === 1 ? res.itens : [...atual, ...res.itens]
        );
        setTotal(res.total);
        setPagina(res.pagina);
        setTemMais(res.temMais);
      } catch {
        if (id === requisicao.current) {
          setErro("Não foi possível carregar o catálogo.");
        }
      } finally {
        if (id === requisicao.current) setCarregando(false);
      }
    },
    []
  );

  const filtroAtivo = busca.trim().length > 0 || grupoAtivo !== null;

  useEffect(() => {
    if (!open || !filtroAtivo) {
      requisicao.current++;
      return;
    }
    const t = setTimeout(() => carregar(busca.trim(), grupoAtivo, 1), 300);
    return () => clearTimeout(t);
  }, [open, busca, grupoAtivo, filtroAtivo, carregar]);

  function limparEfechar() {
    setBusca("");
    setGrupoAtivo(null);
    setItens([]);
    setErro(null);
    onOpenChange(false);
  }

  function selecionar(item: ItemCatalogoExterno) {
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
              placeholder="Buscar exercício (PT ou EN)..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setItens([]);
              }}
              className="h-11 pl-9 text-base"
            />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {NOMES_GRUPOS.map((grupo) => (
              <button
                key={grupo}
                type="button"
                onClick={() => {
                  setGrupoAtivo((atual) => (atual === grupo ? null : grupo));
                  setItens([]);
                }}
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
          {!filtroAtivo ? (
            <p className="px-1 py-8 text-center text-sm text-muted-foreground">
              Digite pra buscar ou escolha um grupo muscular.
            </p>
          ) : erro ? (
            <div className="flex flex-col items-center gap-3 px-1 py-8 text-center">
              <p className="text-sm text-muted-foreground">{erro}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => carregar(busca.trim(), grupoAtivo, 1)}
              >
                <RefreshCw className="size-4" />
                Tentar de novo
              </Button>
              <p className="text-xs text-muted-foreground">
                Ou use &quot;Exercício personalizado&quot; abaixo.
              </p>
            </div>
          ) : itens.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-xs text-muted-foreground">
                {total} {total === 1 ? "resultado" : "resultados"}
              </p>
              {itens.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selecionar(item)}
                  className="flex items-center gap-3 yas-card p-2.5 text-left transition-colors active:bg-accent"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item.gifUrl}
                      alt=""
                      width={56}
                      height={56}
                      unoptimized
                      loading="lazy"
                      className="size-14 object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-bold">
                      {item.nome}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {item.musculos.join(", ")}
                      {item.equipamento ? ` · ${item.equipamento}` : ""}
                    </span>
                  </div>
                </button>
              ))}
              {temMais ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={carregando}
                  onClick={() =>
                    carregar(busca.trim(), grupoAtivo, pagina + 1)
                  }
                >
                  {carregando ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Carregar mais"
                  )}
                </Button>
              ) : null}
            </div>
          ) : carregando ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <p className="px-1 py-8 text-center text-sm text-muted-foreground">
              <Dumbbell className="mx-auto mb-2 size-5" />
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
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Exercícios e GIFs: ExerciseDB / AscendAPI
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
