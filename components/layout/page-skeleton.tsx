import { Skeleton } from "@/components/ui/skeleton";

/** Esqueleto de página (cabeçalho + grade de cards) para loading.tsx. */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <main className="yas-page" aria-busy="true" aria-label="Carregando">
      <div className="yas-stack">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-56 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
      <div className="yas-grid">
        {Array.from({ length: cards }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-[1.25rem]" />
        ))}
      </div>
    </main>
  );
}
