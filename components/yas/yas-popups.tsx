"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { Papel } from "@/components/layout/nav-itens";
import {
  YasOnboarding,
  lerOnboardingPendente,
} from "@/components/yas/yas-onboarding";
import { YasMotivacao } from "@/components/yas/yas-motivacao";

interface YasPopupsProps {
  papel: Papel;
  usuarioId: string;
  nome: string;
}

const semAssinatura = () => () => {};

/**
 * Coordena os pop-ups da Yas dentro do shell protegido (já após a checagem de
 * senha provisória no layout): onboarding no primeiro acesso e, depois dele, a
 * mensagem motivacional a cada abertura de página.
 */
export function YasPopups({ papel, usuarioId, nome }: YasPopupsProps) {
  const pathname = usePathname();
  const [fechado, setFechado] = useState(false);

  // false no servidor/hidratação; true só no cliente já hidratado. Evita que a
  // motivação conte uma abertura antes de sabermos se há onboarding pendente.
  const hidratado = useSyncExternalStore(
    semAssinatura,
    () => true,
    () => false
  );
  const pendente = useSyncExternalStore(
    semAssinatura,
    () => lerOnboardingPendente(usuarioId),
    () => false
  );

  if (!hidratado) return null;
  const onboardingAberto = pendente && !fechado;

  return (
    <>
      {onboardingAberto ? (
        <YasOnboarding
          papel={papel}
          userId={usuarioId}
          nome={nome}
          onFechar={() => setFechado(true)}
        />
      ) : null}
      <YasMotivacao
        usuarioId={usuarioId}
        nome={nome}
        papel={papel}
        path={pathname}
        suprimir={onboardingAberto}
      />
    </>
  );
}
