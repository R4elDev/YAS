"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import type { Profile, Treino, Exercicio } from "@/lib/types/database.types";
import type { CatalogoResumo } from "@/lib/queries/catalogo";
import { criarTreino, atualizarTreino } from "@/lib/actions/treinos";
import { ExerciciosDndList } from "@/components/treino/exercicios-dnd-list";
import { ExercicioCatalogoSheet } from "@/components/treino/exercicio-catalogo-sheet";
import type { ExercicioDraft } from "@/components/treino/exercicio-form-row";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todayISODate } from "@/lib/utils/date";

interface TreinoBuilderProps {
  alunos: Profile[];
  catalogo: CatalogoResumo[];
  treino?: Treino;
  exerciciosIniciais?: Exercicio[];
}

function exercicioParaDraft(
  ex: Exercicio,
  catalogoPorId: Map<string, CatalogoResumo>
): ExercicioDraft {
  const doCatalogo = ex.catalogo_id ? catalogoPorId.get(ex.catalogo_id) : null;
  return {
    clientId: ex.id,
    catalogoId: ex.catalogo_id,
    nome: ex.nome,
    imagem_url: ex.imagem_url,
    imagemFimUrl: ex.imagem_fim_url,
    series: ex.series,
    repeticoes: ex.repeticoes,
    observacoes: ex.observacoes ?? "",
    musculosPrimarios: doCatalogo?.musculos_primarios,
  };
}

export function TreinoBuilder({
  alunos,
  catalogo,
  treino,
  exerciciosIniciais,
}: TreinoBuilderProps) {
  const isEdicao = Boolean(treino);
  const catalogoPorId = useMemo(
    () => new Map(catalogo.map((c) => [c.id, c])),
    [catalogo]
  );
  const [nome, setNome] = useState(treino?.nome ?? "");
  const [alunoId, setAlunoId] = useState(treino?.aluno_id ?? "");
  const [data, setData] = useState(treino?.data ?? todayISODate());
  const [exercicios, setExercicios] = useState<ExercicioDraft[]>(
    exerciciosIniciais?.map((ex) => exercicioParaDraft(ex, catalogoPorId)) ??
      []
  );
  const [catalogoAberto, setCatalogoAberto] = useState(false);
  const [salvando, startSalvando] = useTransition();
  const router = useRouter();

  function adicionarDoCatalogo(item: CatalogoResumo) {
    setExercicios((prev) => [
      ...prev,
      {
        clientId: crypto.randomUUID(),
        catalogoId: item.id,
        nome: item.nome,
        imagem_url: item.imagem_inicio_url,
        imagemFimUrl: item.imagem_fim_url,
        series: 3,
        repeticoes: "",
        observacoes: "",
        musculosPrimarios: item.musculos_primarios,
      },
    ]);
  }

  function adicionarPersonalizado() {
    setExercicios((prev) => [
      ...prev,
      {
        clientId: crypto.randomUUID(),
        catalogoId: null,
        nome: "",
        imagem_url: null,
        imagemFimUrl: null,
        series: 3,
        repeticoes: "",
        observacoes: "",
      },
    ]);
  }

  function validar(): string | null {
    if (!nome.trim()) return "Dê um nome ao treino.";
    if (!alunoId) return "Selecione o aluno.";
    if (!data) return "Selecione a data.";
    if (exercicios.length === 0) return "Adicione pelo menos um exercício.";
    if (
      exercicios.some(
        (e) => !e.nome.trim() || !e.series || !e.repeticoes.trim()
      )
    )
      return "Preencha nome, séries e repetições de todos os exercícios.";
    return null;
  }

  function handleSalvar() {
    const erro = validar();
    if (erro) {
      toast.error(erro);
      return;
    }

    startSalvando(async () => {
      try {
        const input = {
          alunoId,
          nome: nome.trim(),
          data,
          exercicios: exercicios.map((e) => ({
            catalogo_id: e.catalogoId,
            nome: e.nome.trim(),
            imagem_url: e.imagem_url,
            imagem_fim_url: e.imagemFimUrl,
            series: e.series,
            repeticoes: e.repeticoes.trim(),
            observacoes: e.observacoes.trim() || null,
          })),
        };

        if (isEdicao && treino) {
          await atualizarTreino(treino.id, input);
          toast.success("Treino atualizado!");
        } else {
          await criarTreino(input);
          toast.success("Treino criado e enviado para o aluno!");
        }
        router.push("/admin/treinos");
      } catch {
        toast.error("Não foi possível salvar o treino.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome-treino">Nome do treino</Label>
          <Input
            id="nome-treino"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Treino A"
            className="h-12 text-base"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Aluno</Label>
          <Select value={alunoId} onValueChange={(v) => setAlunoId(v ?? "")}>
            <SelectTrigger className="h-12 w-full text-base">
              <SelectValue placeholder="Selecione o aluno">
                {(value: string | null) =>
                  alunos.find((aluno) => aluno.id === value)?.nome ??
                  "Selecione o aluno"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {alunos.map((aluno) => (
                <SelectItem key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="data-treino">Data</Label>
          <Input
            id="data-treino"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="h-12 text-base"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide text-muted-foreground uppercase">
            Exercícios
          </h2>
          {exercicios.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setCatalogoAberto(true)}
            >
              <Plus className="size-4" />
              Adicionar
            </Button>
          ) : null}
        </div>

        {exercicios.length > 0 ? (
          <ExerciciosDndList exercicios={exercicios} onChange={setExercicios} />
        ) : (
          <button
            type="button"
            onClick={() => setCatalogoAberto(true)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border p-8 text-center transition-colors active:bg-accent"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Search className="size-5" />
            </span>
            <span className="text-sm font-bold">Buscar exercício</span>
            <span className="text-xs text-muted-foreground">
              Escolha no catálogo ou crie um personalizado
            </span>
          </button>
        )}
      </div>

      <Button
        size="lg"
        className="h-14 text-base font-bold"
        disabled={salvando}
        onClick={handleSalvar}
      >
        {salvando
          ? "Salvando..."
          : isEdicao
            ? "Salvar alterações"
            : "Salvar e enviar para o aluno"}
      </Button>

      <ExercicioCatalogoSheet
        open={catalogoAberto}
        onOpenChange={setCatalogoAberto}
        catalogo={catalogo}
        onSelecionar={adicionarDoCatalogo}
        onPersonalizado={adicionarPersonalizado}
      />
    </div>
  );
}
