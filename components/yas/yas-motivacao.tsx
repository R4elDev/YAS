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
import "./yas-motivacao.css";

const TEMPO_EXIBICAO_MS = 6000;
// Pequena espera: a página assenta antes da altura ser reservada.
const ATRASO_ENTRADA_MS = 350;
// Cobre a transição de altura (280ms) antes de desmontar.
const TEMPO_SAIDA_MS = 320;

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

/**
 * Recado da Yas. Renderizado DENTRO do conteúdo (ver AppShell): a altura é
 * reservada no fluxo, então nunca cobre botão, campo ou menu. Dispara só por
 * mudança de rota (não por re-render, form ou router.refresh).
 */
export function YasMotivacao({
  nome,
  papel,
  path,
  rosto,
  src,
  suprimir = false,
}: YasMotivacaoProps) {
  const [montado, setMontado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState<MensagemYas | null>(null);
  const exibidoPara = useRef<string | null>(null);
  const timers = useRef<number[]>([]);
  // nome/papel só alimentam o sorteio; fora das deps para não reabrir em re-render.
  const dados = useRef({ nome, papel });
  useEffect(() => {
    dados.current = { nome, papel };
  }, [nome, papel]);

  function limparTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function fechar() {
    limparTimers();
    setAberto(false);
    timers.current.push(
      window.setTimeout(() => setMontado(false), TEMPO_SAIDA_MS)
    );
  }

  useEffect(() => {
    if (suprimir || exibidoPara.current === path) return;
    exibidoPara.current = path;
    limparTimers();
    timers.current.push(
      window.setTimeout(() => {
        setMensagem(sortearMensagem(dados.current.papel, dados.current.nome));
        setMontado(true);
        // Frame seguinte: a transição parte do estado fechado.
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => setAberto(true))
        );
        timers.current.push(window.setTimeout(fechar, TEMPO_EXIBICAO_MS));
      }, ATRASO_ENTRADA_MS)
    );
    return () => {
      // Cleanup libera o guard: StrictMode (monta/desmonta/monta) agenda de novo.
      limparTimers();
      exibidoPara.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, suprimir]);

  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      // Dialog/sheet aberto tem prioridade sobre o Escape.
      if (document.querySelector('[role="dialog"]')) return;
      fechar();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto]);

  if (suprimir || !montado) return null;

  return (
    <div
      className="yas-aviso"
      data-aberto={aberto}
      // Fechando: sai da ordem de foco e do alcance do ponteiro.
      inert={!aberto}
      onFocus={() => {
        // Quem navega por teclado/leitor não perde o recado por timeout.
        limparTimers();
      }}
    >
      <div className="yas-aviso-miolo">
        <div className="yas-aviso-recuo">
          <div role="status" aria-live="polite" className="yas-aviso-card">
            <div className="flex size-12 shrink-0 items-center justify-center">
              {src ? (
                <Image
                  src={src}
                  alt=""
                  width={48}
                  height={48}
                  unoptimized
                  className="size-12 rounded-full object-cover"
                />
              ) : (
                <YasFace rosto={rosto ?? mensagem?.rosto} size={48} />
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[11px] font-bold tracking-[0.12em] text-primary uppercase">
                Yas
              </span>
              <p className="text-sm leading-snug font-medium text-foreground">
                {mensagem?.texto}
              </p>
            </div>
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar recado da Yas"
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[transform,background-color] duration-150 ease-out active:scale-95 active:bg-muted motion-reduce:transition-none"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
