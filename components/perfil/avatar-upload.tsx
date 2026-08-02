"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { atualizarAvatar } from "@/lib/actions/perfil";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  userId: string;
  nome: string;
  avatarUrl: string | null;
}

export function AvatarUpload({ userId, nome, avatarUrl }: AvatarUploadProps) {
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
    const caminho = `${userId}/avatar.${extensao}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(caminho, file, { upsert: true });

    if (error || !data) {
      toast.error("Não foi possível enviar a foto.");
      setEnviando(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    startTransition(async () => {
      try {
        await atualizarAvatar(`${publicUrl}?v=${Date.now()}`);
        toast.success("Foto de perfil atualizada.");
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
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={carregando}
        className="relative"
      >
        <Avatar className="size-24">
          <AvatarImage src={avatarUrl ?? undefined} alt={nome} />
          <AvatarFallback className="text-2xl font-bold">
            {nome.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {carregando ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
