// Gera lib/exercicios/data/exercisedb-catalogo.json a partir da API OSS
// gratuita (https://oss.exercisedb.dev/api/v1). Uso único/manual: a API tem
// rate limit estrito (Cloudflare 1015 -> HTTP 429 com corpo texto).
// Contrato observado: /exercises?limit<=25&after=<cursor> -> {meta:{total,
// hasNextPage,nextCursor},data:[...]}. Retoma de .partial.json se interrompido.
// Uso: node scripts/importar-exercisedb.mjs
import { readFile, writeFile, rename } from "node:fs/promises";

const BASE = process.env.EXERCISEDB_BASE_URL ?? "https://oss.exercisedb.dev/api/v1";
const OUT = new URL("../lib/exercicios/data/exercisedb-catalogo.json", import.meta.url);
const PARTIAL = new URL("../lib/exercicios/data/.partial.json", import.meta.url);
const ESPERA_MS = 12_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function pagina(after) {
  let backoff = 60_000;
  for (let tentativa = 0; tentativa < 8; tentativa++) {
    try {
      const url = `${BASE}/exercises?limit=25${after ? `&after=${encodeURIComponent(after)}` : ""}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      const tipo = res.headers.get("content-type") ?? "";
      if (res.ok && tipo.includes("application/json")) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) return json;
      }
      console.warn(`HTTP ${res.status} (${tipo || "sem content-type"}); aguardando ${backoff / 1000}s`);
    } catch (e) {
      console.warn(`erro de rede: ${e.message}; aguardando ${backoff / 1000}s`);
    }
    await sleep(backoff);
    backoff = Math.min(backoff * 2, 600_000);
  }
  throw new Error("API indisponível após várias tentativas");
}

let estado = { after: null, itens: [] };
try { estado = JSON.parse(await readFile(PARTIAL, "utf8")); console.log(`retomando: ${estado.itens.length} itens`); } catch {}

let total = 0;
for (;;) {
  const json = await pagina(estado.after);
  total = json.meta?.total ?? total;
  for (const e of json.data) {
    estado.itens.push({
      id: e.exerciseId, nome: e.name, gif: e.gifUrl,
      partes: e.bodyParts ?? [], equip: e.equipments ?? [],
      alvo: e.targetMuscles ?? [], sec: e.secondaryMuscles ?? [],
    });
  }
  estado.after = json.meta?.nextCursor ?? null;
  await writeFile(PARTIAL, JSON.stringify(estado));
  console.log(`${estado.itens.length}/${total}`);
  if (!json.meta?.hasNextPage || !estado.after) break;
  await sleep(ESPERA_MS);
}

const unicos = [...new Map(estado.itens.map((i) => [i.id, i])).values()]
  .sort((a, b) => a.nome.localeCompare(b.nome));
if (total && unicos.length < total * 0.98) throw new Error(`incompleto: ${unicos.length}/${total}`);
await writeFile(OUT, JSON.stringify({
  fonte: "exercisedb-oss", baseUrl: BASE, geradoEm: new Date().toISOString(),
  total: unicos.length, itens: unicos,
}));
await rename(PARTIAL, new URL("../lib/exercicios/data/.partial.done", import.meta.url));
console.log(`ok: ${unicos.length} exercícios`);
