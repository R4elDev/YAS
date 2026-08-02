"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ProgressoPeso } from "@/lib/types/database.types";
import type { PontoCarga } from "@/lib/queries/treinos";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDataCurta } from "@/lib/utils/date";

interface GraficoEvolucaoProps {
  pesoData: ProgressoPeso[];
  cargaMap: Record<string, PontoCarga[]>;
}

export function GraficoEvolucao({ pesoData, cargaMap }: GraficoEvolucaoProps) {
  const nomesExercicios = useMemo(
    () => Object.keys(cargaMap).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [cargaMap]
  );
  const [exercicioSelecionado, setExercicioSelecionado] = useState(
    nomesExercicios[0]
  );

  const pesoPontos = pesoData.map((p) => ({
    data: p.data,
    valor: p.peso,
    label: formatDataCurta(p.data),
  }));

  const cargaPontos = (cargaMap[exercicioSelecionado] ?? []).map((p) => ({
    data: p.data,
    valor: p.carga,
    label: formatDataCurta(p.data),
  }));

  return (
    <Tabs defaultValue="peso" className="flex flex-col gap-4">
      <TabsList className="w-full">
        <TabsTrigger value="peso" className="flex-1">
          Peso corporal
        </TabsTrigger>
        <TabsTrigger value="carga" className="flex-1">
          Carga por exercício
        </TabsTrigger>
      </TabsList>

      <TabsContent value="peso">
        {pesoPontos.length > 1 ? (
          <EvolucaoChart pontos={pesoPontos} unidade="kg" />
        ) : (
          <EstadoVazio texto="Registre seu peso em pelo menos duas datas para ver o gráfico." />
        )}
      </TabsContent>

      <TabsContent value="carga" className="flex flex-col gap-4">
        {nomesExercicios.length > 0 ? (
          <>
            <Select
              value={exercicioSelecionado}
              onValueChange={(v) => setExercicioSelecionado(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent>
                {nomesExercicios.map((nome) => (
                  <SelectItem key={nome} value={nome}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {cargaPontos.length > 1 ? (
              <EvolucaoChart pontos={cargaPontos} unidade="kg" />
            ) : (
              <EstadoVazio texto="Ainda não há carga suficiente registrada para este exercício." />
            )}
          </>
        ) : (
          <EstadoVazio texto="Nenhuma carga registrada ainda." />
        )}
      </TabsContent>
    </Tabs>
  );
}

function EvolucaoChart({
  pontos,
  unidade,
}: {
  pontos: { label: string; valor: number }[];
  unidade: string;
}) {
  return (
    <div className="h-56 w-full rounded-2xl bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pontos} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit={unidade}
            width={48}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--popover-foreground)",
              fontSize: 13,
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--primary)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EstadoVazio({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
      {texto}
    </div>
  );
}
