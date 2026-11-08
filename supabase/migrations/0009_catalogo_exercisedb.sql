-- YAS — catálogo ExerciseDB: colunas de proveniência/busca em exercicios_catalogo.
-- ADITIVA e idempotente: sem DROP/DELETE/TRUNCATE; não toca em `exercicios`,
-- treinos, Auth ou Storage. Linhas existentes (free-exercise-db) permanecem
-- válidas (fonte default). RLS/grants vêm de 0004/0006/0008 e não mudam:
-- leitura só para authenticated ativo; escrita só via service_role (servidor).
begin;

alter table public.exercicios_catalogo
  add column if not exists fonte text not null default 'free-exercise-db',
  add column if not exists id_externo text,
  add column if not exists partes_corpo text[] not null default '{}',
  add column if not exists equipamentos text[] not null default '{}',
  add column if not exists atribuicao text,
  add column if not exists nome_busca text not null default '';

-- ExerciseDB não informa nível de dificuldade.
alter table public.exercicios_catalogo alter column nivel drop not null;

-- Um id externo por fonte (NULLs não colidem: itens antigos não têm id_externo).
create unique index if not exists exercicios_catalogo_fonte_id_externo_uq
  on public.exercicios_catalogo (fonte, id_externo);
create index if not exists exercicios_catalogo_nome_busca_idx
  on public.exercicios_catalogo (nome_busca);

commit;
