"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registrarFoto } from "@/lib/actions/progresso";
import { Button } from "@/components/ui/button";

export function UploadFoto({ alunoId }: { alunoId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setEnviando(true);
    const supabase = createClient();
    const extensao = file.name.split(".").pop() ?? "jpg";
    const caminho = `${alunoId}/${Date.now()}.${extensao}`;

    const { data, error } = await supabase.storage
      .from("progresso-fotos")
      .upload(caminho, file);

    if (error || !data) {
      toast.error("Não foi possível enviar a foto.");
      setEnviando(false);
      return;
    }

    startTransition(async () => {
      try {
        await registrarFoto(data.path);
        toast.success("Foto adicionada ao seu progresso.");
        router.refresh();
      } catch {
        toast.error("Não foi possível salvar a foto.");
      } finally {
        setEnviando(false);
      }
    });
  }

  const carregando = enviando || isPending;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full gap-2 text-base font-bold"
        disabled={carregando}
        onClick={() => inputRef.current?.click()}
      >
        {carregando ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <ImagePlus className="size-5" />
        )}
        {carregando ? "Enviando..." : "Enviar foto de evolução"}
      </Button>
    </div>
  );
}
