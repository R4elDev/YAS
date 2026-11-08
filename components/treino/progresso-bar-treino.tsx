export function ProgressoBarTreino({
  concluidos,
  total,
}: {
  concluidos: number;
  total: number;
}) {
  const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="yas-card yas-card-pad flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">Progresso do treino</span>
        <span className="text-muted-foreground tabular-nums">
          {concluidos} de {total} {total === 1 ? "exercício" : "exercícios"}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentual}
        aria-label="Exercícios concluídos no treino"
        className="h-2.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
