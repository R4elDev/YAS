// Importa lib/exercicios/data/exercisedb-catalogo.json (local, sem rede de
// exercícios) em public.exercicios_catalogo via service_role. Idempotente:
// upsert por id ('exdb:<exerciseId>'); nunca deleta nem toca em `exercicios`.
// Sem GIFs: imagem_*_url ficam NULL. Proveniência preservada em fonte/id_externo/atribuicao.
// Uso (a partir da raiz do repo; segredos só via env, nunca no código):
//   npx tsx --env-file=.env.local scripts/importar-catalogo-exercisedb.ts           # dry-run
//   npx tsx --env-file=.env.local scripts/importar-catalogo-exercisedb.ts --apply   # grava
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import {
  traduzirEquipamento,
  traduzirMusculo,
  traduzirNome,
} from "../lib/exercicios/dicionario";

interface Item {
  id: string; nome: string; gif?: string;
  partes: string[]; equip: string[]; alvo: string[]; sec: string[];
}
const arquivo = JSON.parse(
  readFileSync(new URL("../lib/exercicios/data/exercisedb-catalogo.json", import.meta.url), "utf8"),
) as { fonte: string; baseUrl: string; geradoEm: string; total: number; itens: Item[] };

const FONTE = "exercisedb";
const ATRIBUICAO = `ExerciseDB OSS (${arquivo.baseUrl}); catálogo extraído em ${arquivo.geradoEm}. Mídia (GIF) não importada; consulte os termos da fonte antes de usá-la.`;

const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();

function linha(i: Item) {
  const nome = traduzirNome(i.nome);
  return {
    id: `exdb:${i.id}`,
    fonte: FONTE,
    id_externo: i.id,
    nome,
    nome_original: i.nome,
    nome_busca: norm(`${nome} ${i.nome}`),
    categoria: i.partes[0] ? traduzirMusculo(i.partes[0]) : "Geral",
    nivel: null,
    equipamento: i.equip[0] ? traduzirEquipamento(i.equip[0]) : null,
    equipamentos: i.equip,
    partes_corpo: i.partes,
    musculos_primarios: i.alvo,
    musculos_secundarios: i.sec,
    imagem_inicio_url: null,
    imagem_fim_url: null,
    atribuicao: ATRIBUICAO,
  };
}

async function main() {
const linhas = arquivo.itens.map(linha);
const ids = new Set(linhas.map((l) => l.id));
const traduzidos = linhas.filter((l) => l.nome.toLowerCase() !== l.nome_original.toLowerCase()).length;
console.log(`itens: ${linhas.length} | ids únicos: ${ids.size} | duplicados: ${linhas.length - ids.size} | nome PT diferente do original: ${traduzidos} (cobertura parcial)`);
if (ids.size !== linhas.length || linhas.length !== arquivo.total) {
  throw new Error("Manifesto inconsistente (duplicidade ou total divergente); abortando.");
}

if (!process.argv.includes("--apply")) {
  console.log("dry-run: nada gravado. Use --apply para gravar.");
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.");
const supabase = createClient(url, key, { auth: { persistSession: false } });

for (let n = 0; n < linhas.length; n += 200) {
  const { error } = await supabase
    .from("exercicios_catalogo")
    .upsert(linhas.slice(n, n + 200), { onConflict: "id" });
  if (error) throw new Error(`lote ${n}: ${error.message}`);
  console.log(`upsert ${Math.min(n + 200, linhas.length)}/${linhas.length}`);
}
console.log("concluído.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
