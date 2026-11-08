import "server-only";
import snapshot from "@/lib/exercicios/data/exercisedb-catalogo.json";
import {
  GRUPOS_MUSCULARES,
  traduzirEquipamento,
  traduzirMusculo,
  traduzirNome,
} from "@/lib/exercicios/dicionario";
import type {
  ItemCatalogoExterno,
  PaginaCatalogo,
} from "@/lib/exercicios/tipos";

// Fonte: snapshot versionado gerado por scripts/importar-exercisedb.mjs a
// partir da ExerciseDB OSS. A API pública tem rate limit estrito (HTTP 429),
// então NENHUMA requisição de usuário chama a API: busca, filtro e paginação
// rodam aqui no servidor sobre o snapshot, indexado uma vez por processo.

interface Bruto {
  id: string;
  nome: string;
  gif: string;
  partes: string[];
  equip: string[];
  alvo: string[];
  sec: string[];
}

interface Indexado {
  item: ItemCatalogoExterno;
  nomeNorm: string;
  texto: string;
  alvo: Set<string>;
}

const TAMANHO_PADRAO = 20;
const TAMANHO_MAX = 25;

const normalizar = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

let indice: Indexado[] | null = null;

function obterIndice(): Indexado[] {
  if (indice) return indice;
  const brutos = (snapshot as { itens: Bruto[] }).itens;
  indice = brutos
    .map((b) => {
      const nome = traduzirNome(b.nome);
      return {
        item: {
          id: b.id,
          nome,
          nomeOriginal: b.nome,
          gifUrl: b.gif,
          musculos: b.alvo.map(traduzirMusculo),
          equipamento: b.equip[0] ? traduzirEquipamento(b.equip[0]) : null,
        },
        nomeNorm: normalizar(nome),
        texto: normalizar(`${nome} ${b.nome}`),
        alvo: new Set(b.alvo),
      };
    })
    .sort((a, b) => a.item.nome.localeCompare(b.item.nome, "pt-BR"));
  return indice;
}

export function buscarCatalogoExterno(params: {
  busca?: string;
  grupo?: string | null;
  pagina?: number;
  tamanho?: number;
}): PaginaCatalogo {
  const tokens = normalizar(params.busca ?? "")
    .split(/\s+/)
    .filter(Boolean);
  const musculos = params.grupo
    ? Object.hasOwn(GRUPOS_MUSCULARES, params.grupo)
      ? GRUPOS_MUSCULARES[params.grupo]
      : []
    : undefined;
  const tamanho = Math.min(
    Math.max(params.tamanho ?? TAMANHO_PADRAO, 1),
    TAMANHO_MAX
  );
  const pagina = Math.max(Math.floor(params.pagina ?? 1), 1);

  const filtrados = obterIndice().filter(
    (e) =>
      (!musculos || musculos.some((m) => e.alvo.has(m))) &&
      tokens.every((t) => e.texto.includes(t))
  );

  if (tokens.length > 0) {
    const primeiro = tokens[0];
    const peso = (e: Indexado) => (e.nomeNorm.startsWith(primeiro) ? 0 : 1);
    filtrados.sort((a, b) => peso(a) - peso(b));
  }

  const inicio = (pagina - 1) * tamanho;
  return {
    itens: filtrados.slice(inicio, inicio + tamanho).map((e) => e.item),
    total: filtrados.length,
    pagina,
    temMais: inicio + tamanho < filtrados.length,
  };
}
