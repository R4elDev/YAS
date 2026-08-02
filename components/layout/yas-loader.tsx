import { YasLetter } from "@/components/layout/yas-letter";

export function YasLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background">
      <div
        className="yas-loader-pulse flex text-6xl font-extrabold tracking-tight"
        aria-hidden="true"
      >
        <YasLetter char="Y" delayMs={0} />
        <YasLetter char="A" delayMs={280} />
        <YasLetter char="S" delayMs={560} />
      </div>
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
