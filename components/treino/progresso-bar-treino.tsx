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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Progresso do treino</span>
        <span className="text-muted-foreground">
          {concluidos} de {total} exercícios
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
