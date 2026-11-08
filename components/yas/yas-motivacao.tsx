"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { YasFace, type YasRosto } from "@/components/yas/yas-face";
import {
  sortearMensagem,
  type MensagemYas,
  type PapelYas,
} from "@/components/yas/mensagens";
import { cn } from "@/lib/utils";

// Mobile fecha mais rápido: o balão fica sobre o conteúdo e a bottom-nav.
const TEMPO_DESKTOP_MS = 6000;
const TEMPO_MOBILE_MS = 4500;
const TEMPO_SAIDA_MS = 200;

function tempoExibicao(): number {
  if (typeof window === "undefined") return TEMPO_DESKTOP_MS;
  return window.matchMedia("(max-width: 1023px)").matches
    ? TEMPO_MOBILE_MS
    : TEMPO_DESKTOP_MS;
}

export interface YasMotivacaoProps {
  /** Usuário logado. Recebido para contrato; o componente não busca dados. */
  usuarioId: string;
  /** Nome completo; usamos só o primeiro. */
  nome: string;
  papel: PapelYas;
  /** Pathname atual, vindo do wrapper client. Cada mudança de rota reabre. */
  path: string;
  /** Força uma expressão; por padrão vem da mensagem sorteada. Ignorada com `src`. */
  rosto?: YasRosto;
  /** Imagem de galeria; substitui o rosto quando informada. */
  src?: string;
  /** Onboarding ativo: não mostra e não conta a abertura. */
  suprimir?: boolean;
}

export function YasMotivacao({
  nome,
  papel,
  path,
  rosto,
  src,
  suprimir = false,
}: YasMotivacaoProps) {
  const [montado, setMontado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const [mensagem, setMensagem] = useState<MensagemYas | null>(null);
  // Último pathname já exibido: StrictMode e re-renders não repetem.
  const exibidoPara = useRef<string | null>(null);
  const timerFechar = useRef<number | undefined>(undefined);
  const timerOcultar = useRef<number | undefined>(undefined);

  function fechar() {
    window.clearTimeout(timerFechar.current);
    setVisivel(false);
    window.clearTimeout(timerOcultar.current);
    timerOcultar.current = window.setTimeout(() => setMontado(false), TEMPO_SAIDA_MS);
  }

  useEffect(() => {
    if (suprimir || exibidoPara.current === path) return;
    exibidoPara.current = path;
    setMensagem(sortearMensagem(papel, nome));
    setMontado(true);
    // Sem cleanup de propósito: StrictMode roda o efeito duas vezes e a
    // segunda chamada retorna cedo; cancelar aqui deixaria o balão invisível.
    // Entrada no frame seguinte, para a transição de opacidade/translate rodar.
    window.requestAnimationFrame(() => setVisivel(true));
    window.clearTimeout(timerFechar.current);
    timerFechar.current = window.setTimeout(fechar, tempoExibicao());
  }, [path, suprimir, papel, nome]);

  useEffect(() => {
    if (!visivel) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") fechar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visivel]);

  if (suprimir || !montado) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        // Topo no mobile (não cobre 'Finalizar treino' nem inputs); canto inferior direito no desktop.
        "fixed inset-x-4 top-[calc(4.75rem+env(safe-area-inset-top))] z-40 mx-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-primary p-3 pr-2 text-primary-foreground shadow-lg",
        "lg:inset-x-auto lg:top-auto lg:right-8 lg:bottom-8 lg:max-w-xs",
        // Só o balão recebe ponteiro: o resto da tela segue clicável.
        "transition-[opacity,translate] duration-200 ease-[var(--ease-out)] motion-reduce:translate-y-0",
        visivel
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1.5 opacity-0 lg:translate-y-1.5"
      )}
    >
      <div className="flex size-14 shrink-0 items-center justify-center">
        {src ? (
          <Image
            src={src}
            alt=""
            width={56}
            height={56}
            unoptimized
            className="size-14 object-cover"
          />
        ) : (
          <YasFace rosto={rosto ?? mensagem?.rosto} size={56} />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase">
          Yas
        </span>
        <p className="text-sm leading-snug font-medium">{mensagem?.texto}</p>
      </div>
      <button
        type="button"
        onClick={fechar}
        aria-label="Fechar recado da Yas"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-150 ease-out active:scale-95"
      >
        <X aria-hidden className="size-5" />
      </button>
    </div>
  );
}
