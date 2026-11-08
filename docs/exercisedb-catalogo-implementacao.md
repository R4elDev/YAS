# Catálogo ExerciseDB (OSS) — implementação

Substitui, para **novos** exercícios, o catálogo `exercicios_catalogo` (free-exercise-db).
Aditivo: nenhuma migration, nenhum DELETE. Treinos existentes mantêm o snapshot gravado
(`nome`, `imagem_url`, `imagem_fim_url`, `catalogo_id`).

## Contrato observado (08/11/2026, `https://oss.exercisedb.dev/api/v1`)

| Rota | Observado |
|---|---|
| `GET /exercises?limit=N&after=<cursor>` | `limit` acima de 25 é cortado em 25. Envelope `{success, meta:{total, hasNextPage, hasPreviousPage, nextCursor, previousCursor?}, data[]}`. Itens: `exerciseId, name, gifUrl, bodyParts[], equipments[], targetMuscles[], secondaryMuscles[], instructions[]`. |
| `GET /exercises?targetMuscles=biceps` | Filtra de verdade (`total: 162`). |
| `GET /exercises?offset=` / `?search=` | **Ignorados** (devolvem a primeira página sem filtro). |
| `GET /exercises/search?search=squat` | Parâmetro é `search` (`q` devolve vazio). Fuzzy ("sqaut" acha squat). **Sem `meta`, sem paginação** (`limit`/`offset` ignorados), só `exerciseId, name, gifUrl`. |
| `GET /exercises/{id}` | `{success, data:{...completo}}`. |
| `GET /muscles`, `/bodyparts`, `/equipments` | `{success, data:[{name}]}`, inglês minúsculo. 37 músculos, 10 partes, 30 equipamentos. |
| Mídia | `https://static.exercisedb.dev/media/{id}.gif` (GIF animado único, 180p). Não existe imagem de "fim". |
| Rate limit | Cloudflare, ~7–12 requisições em poucos segundos → **HTTP 429, corpo texto `error code: 1015`** (não JSON). |

## Decisão de arquitetura

Como o rate limit é baixo e `/search` não pagina nem traz músculos, **nenhuma requisição de usuário chama a API**:

1. `scripts/importar-exercisedb.mjs` percorre `/exercises` (25 por página, cursor `after`, 12 s entre páginas, backoff em não-2xx/não-JSON, retomável) e grava
   `lib/exercicios/data/exercisedb-catalogo.json` (1.500 itens, sem `instructions`, que estão em inglês e não são usadas).
2. `lib/exercicios/catalogo-externo.ts` (server-only) indexa o snapshot uma vez por processo e faz busca, filtro por grupo e paginação (20 por página, máx. 25) no servidor.
3. `lib/actions/catalogo-externo.ts` expõe a busca como server action (exige admin) com erro recuperável: o sheet mostra "Tentar de novo" e mantém "Exercício personalizado".
4. Sem chaves: P1 não usa autenticação. A URL base é configurável por `EXERCISEDB_BASE_URL` (só no script).

Atualizar o snapshot: `node scripts/importar-exercisedb.mjs` e revisar o diff do JSON.

## Persistência (sem schema novo)

Exercício novo do catálogo grava em `exercicios`: `catalogo_id = null` (o `exerciseId` não existe em `exercicios_catalogo`; a FK exige id existente), `nome` (PT por dicionário, snapshot), `imagem_url = gifUrl`, `imagem_fim_url = null`.
Consequência: o `exerciseId` externo não fica gravado. Se for necessário rastrear a origem, a migration aditiva seria `exercicios.catalogo_fonte` + `catalogo_externo_id` — **não feita** por não ser necessária agora.
Na edição, um exercício com `catalogo_id` nulo e `imagem_url` em `exercisedb.dev` é tratado como do catálogo (nome/GIF fixos).

## PT-BR

`lib/exercicios/dicionario.ts`: grupos musculares da UI (os 17 chips anteriores) → `targetMuscles` da API; tradução de músculos, equipamentos e de palavras dos nomes. Cobertura parcial: palavra desconhecida fica em inglês e a busca casa PT **e** nome original.

## Termos de uso (P1) — pendente de decisão do usuário

Segundo a revisão Codex (não lida diretamente por mim): API gratuita é para uso pessoal, protótipo, educacional e não comercial; uso comercial/SaaS/monetizado exige plano pago RapidAPI; atribuição à AscendAPI é obrigatória. A UI mostra "Exercícios e GIFs: ExerciseDB / AscendAPI". **Não publicar em produção comercial sem confirmar o enquadramento.** Nenhum plano foi contratado. O GIF é hotlink (`static.exercisedb.dev`); copiar para o bucket tem a mesma exigência de termos.

## Tratamento de erros

- Scripts e qualquer cliente futuro devem checar status **e** `content-type` antes de `JSON.parse` (o 429 é texto).
- Se a busca falhar, o treino continua salvável com exercício personalizado.
