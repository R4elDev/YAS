"use client";

import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ImagePlus,
  Loader2,
  Trash2,
  BadgeCheck,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExercicioImagemLightbox } from "@/components/treino/exercicio-imagem-lightbox";
import { cn } from "@/lib/utils";

export interface ExercicioDraft {
  clientId: string;
  catalogoId: string | null;
  nome: string;
  imagem_url: string | null;
  imagemFimUrl: string | null;
  series: number;
  repeticoes: string;
  observacoes: string;
  /** Só pra exibição (badge de músculos); não é persistido em `exercicios`. */
  musculosPrimarios?: string[];
}

interface ExercicioFormRowProps {
  exercicio: ExercicioDraft;
  onChange: (patch: Partial<ExercicioDraft>) => void;
  onRemove: () => void;
}

export function ExercicioFormRow({
  exercicio,
  onChange,
  onRemove,
}: ExercicioFormRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercicio.clientId });
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const doCatalogo = Boolean(exercicio.catalogoId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setEnviando(true);
    const supabase = createClient();
    const extensao = file.name.split(".").pop() ?? "jpg";
    const caminho = `${crypto.randomUUID()}.${extensao}`;

    const { data, error } = await supabase.storage
      .from("exercicios")
      .upload(caminho, file);

    if (error || !data) {
      toast.error("Não foi possível enviar a imagem.");
      setEnviando(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("exercicios").getPublicUrl(data.path);
    onChange({ imagem_url: publicUrl });
    setEnviando(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-card p-4",
        isDragging && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-1 flex size-8 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground active:cursor-grabbing"
          aria-label="Reordenar exercício"
        >
          <GripVertical className="size-5" />
        </button>

        {doCatalogo ? (
          <ExercicioImagemLightbox
            nome={exercicio.nome}
            imagemUrl={exercicio.imagem_url}
            imagemFimUrl={exercicio.imagemFimUrl}
          />
        ) : exercicio.imagem_url ? (
          <div className="relative shrink-0">
            <ExercicioImagemLightbox
              nome={exercicio.nome || "Exercício personalizado"}
              imagemUrl={exercicio.imagem_url}
              imagemFimUrl={null}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={enviando}
              aria-label="Trocar imagem"
              className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
            >
              {enviando ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <Pencil className="size-3" />
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={enviando}
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted"
            >
              {enviando ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <ImagePlus className="size-5 text-muted-foreground" />
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </>
        )}

        <div className="flex flex-1 flex-col gap-2">
          {doCatalogo ? (
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1 text-base leading-tight font-bold">
                <BadgeCheck className="size-3.5 shrink-0 text-primary" />
                {exercicio.nome}
              </span>
              {exercicio.musculosPrimarios?.length ? (
                <span className="text-xs text-muted-foreground">
                  {exercicio.musculosPrimarios.join(", ")}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Label
                htmlFor={`nome-${exercicio.clientId}`}
                className="text-xs text-muted-foreground"
              >
                Nome do exercício
              </Label>
              <Input
                id={`nome-${exercicio.clientId}`}
                placeholder="Ex: Supino reto"
                value={exercicio.nome}
                onChange={(e) => onChange({ nome: e.target.value })}
                className="h-11 text-base font-bold"
              />
            </div>
          )}
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <Label
                htmlFor={`series-${exercicio.clientId}`}
                className="text-xs text-muted-foreground"
              >
                Séries
              </Label>
              <Input
                id={`series-${exercicio.clientId}`}
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="3"
                value={exercicio.series || ""}
                onChange={(e) =>
                  onChange({ series: Number(e.target.value) })
                }
                className="h-10"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <Label
                htmlFor={`repeticoes-${exercicio.clientId}`}
                className="text-xs text-muted-foreground"
              >
                Repetições
              </Label>
              <Input
                id={`repeticoes-${exercicio.clientId}`}
                type="number"
                inputMode="numeric"
                min="1"
                placeholder="12"
                value={exercicio.repeticoes}
                onChange={(e) => onChange({ repeticoes: e.target.value })}
                className="h-10"
              />
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <Label
          htmlFor={`observacoes-${exercicio.clientId}`}
          className="text-xs text-muted-foreground"
        >
          Observações (opcional)
        </Label>
        <Textarea
          id={`observacoes-${exercicio.clientId}`}
          placeholder="Ex: descanso de 60s entre séries"
          value={exercicio.observacoes}
          onChange={(e) => onChange({ observacoes: e.target.value })}
          className="min-h-16 text-sm"
        />
      </div>
    </div>
  );
}
