import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="yas-page" aria-busy="true" aria-label="Carregando alunos">
      <div className="yas-stack">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-40 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="yas-stat-grid">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[84px] rounded-[1.25rem]" />
        ))}
      </div>
      <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
      <div className="yas-stack">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-[1.25rem] lg:h-16" />
        ))}
      </div>
    </main>
  );
}
