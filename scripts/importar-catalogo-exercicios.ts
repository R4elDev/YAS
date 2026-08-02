// Importa o catálogo de exercícios (dados de scripts/data/exercicios_catalogo.json,
// já traduzidos pra PT-BR — ver supabase/migrations/0004_exercicios_catalogo.sql)
// pro Supabase: baixa as imagens originais do free-exercise-db, reenvia pro
// nosso bucket "exercicios" e faz upsert da linha em exercicios_catalogo.
//
// Roda uma vez, localmente, fora do runtime do Next.js:
//   npx tsx scripts/importar-catalogo-exercicios.ts
//
// Não importa lib/supabase/admin.ts (tem `import "server-only"`, que quebra
// fora do bundler do Next) — cria o client admin direto aqui.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface CatalogoExercicioRaw {
  id: string;
  nome: string;
  nome_original: string;
  categoria: string;
  nivel: string;
  forca: string | null;
  mecanica: string | null;
  equipamento: string | null;
  musculos_primarios: string[];
  musculos_secundarios: string[];
  instrucoes: string[];
  images: string[];
}

const RAW_BASE_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const BUCKET = "exercicios";
const CONCORRENCIA = 8;

async function baixarEEnviarImagem(
  pathRelativo: string,
  destino: string
): Promise<string | null> {
  const resp = await fetch(RAW_BASE_URL + pathRelativo);
  if (!resp.ok) {
    console.warn(`  aviso: falha ao baixar ${pathRelativo} (${resp.status})`);
    return null;
  }
  const buffer = Buffer.from(await resp.arrayBuffer());
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(destino, buffer, { contentType: "image/jpeg", upsert: true });
  if (error) {
    console.warn(`  aviso: falha ao enviar ${destino}: ${error.message}`);
    return null;
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(destino);
  return publicUrl;
}

async function importarUm(ex: CatalogoExercicioRaw): Promise<boolean> {
  try {
    const [imagemInicioUrl, imagemFimUrl] = await Promise.all([
      ex.images[0]
        ? baixarEEnviarImagem(ex.images[0], `catalogo/${ex.id}/inicio.jpg`)
        : Promise.resolve(null),
      ex.images[1]
        ? baixarEEnviarImagem(ex.images[1], `catalogo/${ex.id}/fim.jpg`)
        : Promise.resolve(null),
    ]);

    const { error } = await supabase.from("exercicios_catalogo").upsert({
      id: ex.id,
      nome: ex.nome,
      nome_original: ex.nome_original,
      categoria: ex.categoria,
      nivel: ex.nivel,
      forca: ex.forca,
      mecanica: ex.mecanica,
      equipamento: ex.equipamento,
      musculos_primarios: ex.musculos_primarios,
      musculos_secundarios: ex.musculos_secundarios,
      instrucoes: ex.instrucoes,
      imagem_inicio_url: imagemInicioUrl,
      imagem_fim_url: imagemFimUrl,
    });

    if (error) throw new Error(error.message);
    return true;
  } catch (err) {
    console.warn(
      `  FALHOU ${ex.id}: ${err instanceof Error ? err.message : String(err)}`
    );
    return false;
  }
}

async function main() {
  const dataPath = path.resolve(
    process.cwd(),
    "scripts/data/exercicios_catalogo.json"
  );
  const exercicios: CatalogoExercicioRaw[] = JSON.parse(
    readFileSync(dataPath, "utf8")
  );

  console.log(`Importando ${exercicios.length} exercícios...`);

  let ok = 0;
  let falhas = 0;

  for (let i = 0; i < exercicios.length; i += CONCORRENCIA) {
    const lote = exercicios.slice(i, i + CONCORRENCIA);
    const resultados = await Promise.all(lote.map(importarUm));
    ok += resultados.filter(Boolean).length;
    falhas += resultados.filter((r) => !r).length;
    console.log(
      `  ${Math.min(i + CONCORRENCIA, exercicios.length)}/${exercicios.length} processados (${ok} ok, ${falhas} falhas até agora)`
    );
  }

  console.log(`\nConcluído: ${ok} ok, ${falhas} falhas de ${exercicios.length} total.`);
  if (falhas > 0) process.exitCode = 1;
}

main();
