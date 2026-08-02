-- YAS — catálogo de exercícios (importado de yuhonas/free-exercise-db,
-- licença Unlicense/domínio público, traduzido pra PT-BR).
-- Rode depois do 0001/0002/0003, no SQL Editor do seu projeto Supabase.

create table public.exercicios_catalogo (
  id text primary key,
  nome text not null,
  nome_original text not null,
  categoria text not null,
  nivel text not null,
  forca text,
  mecanica text,
  equipamento text,
  musculos_primarios text[] not null default '{}',
  musculos_secundarios text[] not null default '{}',
  instrucoes text[] not null default '{}',
  imagem_inicio_url text,
  imagem_fim_url text,
  created_at timestamptz not null default now()
);

create index exercicios_catalogo_nome_idx on public.exercicios_catalogo (nome);

-- Link opcional do exercício prescrito (linha em `exercicios`, específica de
-- um treino) pro item de catálogo que o originou. Nullable: continua
-- existindo a opção de digitar um exercício livre, fora do catálogo.
-- Nome/imagem prescritos continuam sendo uma cópia (snapshot) — editar o
-- catálogo depois não reescreve o histórico de treinos já criados.
alter table public.exercicios
  add column catalogo_id text references public.exercicios_catalogo (id) on delete set null;

-- Leitura compartilhada: qualquer usuário autenticado (aluno ou admin) pode
-- ver o catálogo. Sem policy de insert/update/delete — a importação roda via
-- service role (script local), fora do RLS.
alter table public.exercicios_catalogo enable row level security;

grant select on public.exercicios_catalogo to authenticated;

create policy "exercicios_catalogo_select" on public.exercicios_catalogo
  for select using (true);
