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
      <TabsList className="h-11 w-full">
        <TabsTrigger value="peso" className="min-h-11 flex-1">
          Peso
        </TabsTrigger>
        <TabsTrigger value="carga" className="min-h-11 flex-1">
          Carga
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
  const primeiro = pontos[0].valor;
  const ultimo = pontos[pontos.length - 1].valor;
  const delta = Math.round((ultimo - primeiro) * 10) / 10;
  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  return (
    <div className="yas-card flex min-w-0 flex-col gap-3 p-3 sm:p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-1">
        <span className="text-2xl font-bold tabular-nums">
          {fmt(ultimo)} {unidade}
        </span>
        <span className="text-xs text-muted-foreground">
          {delta === 0
            ? "Sem variação no período"
            : `${delta > 0 ? "+" : ""}${fmt(delta)} ${unidade} desde ${pontos[0].label}`}
        </span>
      </div>
      <div className="h-56 w-full min-w-0 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={pontos} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={24}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={36}
            tickCount={5}
            domain={["dataMin - 1", "dataMax + 1"]}
            tickFormatter={(v: number) => String(Math.round(v))}
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
            formatter={(v) => [`${fmt(Number(v))} ${unidade}`, ""]}
            separator=""
          />
          <Line
            type="monotone"
            dataKey="valor"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--primary)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}

function EstadoVazio({ texto }: { texto: string }) {
  return (
    <div className="yas-empty pb-6">
      <p>{texto}</p>
    </div>
  );
}
