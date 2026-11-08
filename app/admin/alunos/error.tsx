"use client";

import { YasFace } from "@/components/yas/yas-face";
import { Button } from "@/components/ui/button";

export default function ErroAlunos({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="yas-page">
      <div className="yas-empty" role="alert">
        <strong>Não foi possível carregar os alunos</strong>
        <p>Verifique sua conexão e tente de novo.</p>
        <div className="yas-empty-actions">
          <Button onClick={reset} size="lg">
            Tentar de novo
          </Button>
        </div>
        <YasFace rosto="chateada" size={96} className="mt-3 mb-5" />
      </div>
    </main>
  );
}
