import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

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
      <Progress value={percentual}>
        <ProgressTrack className="h-2.5">
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    </div>
  );
}
