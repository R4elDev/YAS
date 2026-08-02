-- YAS — schema inicial (profiles, treinos, exercicios, progresso)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  email text not null,
  tipo text not null check (tipo in ('aluno', 'admin')),
  avatar_url text,
  ativo boolean not null default true,
  senha_provisoria boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.treinos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.profiles (id) on delete cascade,
  criado_por uuid references public.profiles (id) on delete set null,
  nome text not null,
  data date not null,
  status text not null default 'pendente' check (status in ('pendente', 'concluido')),
  finalizado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index treinos_aluno_data_idx on public.treinos (aluno_id, data);

create table public.exercicios (
  id uuid primary key default gen_random_uuid(),
  treino_id uuid not null references public.treinos (id) on delete cascade,
  nome text not null,
  imagem_url text,
  series integer not null,
  repeticoes text not null,
  carga numeric,
  concluido boolean not null default false,
  observacoes text,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);
create index exercicios_treino_ordem_idx on public.exercicios (treino_id, ordem);

create table public.progresso_peso (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.profiles (id) on delete cascade,
  data date not null default current_date,
  peso numeric not null,
  created_at timestamptz not null default now()
);
create index progresso_peso_aluno_data_idx on public.progresso_peso (aluno_id, data);

create table public.progresso_fotos (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references public.profiles (id) on delete cascade,
  data date not null default current_date,
  foto_url text not null,
  created_at timestamptz not null default now()
);
create index progresso_fotos_aluno_data_idx on public.progresso_fotos (aluno_id, data);

-- ---------------------------------------------------------------------------
-- Funções auxiliares
-- ---------------------------------------------------------------------------

-- is_admin(): evita subquery repetida/recursiva em cada policy.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and tipo = 'admin'
  );
$$;

-- Cria a linha em profiles automaticamente quando um novo auth.users é criado
-- (usado tanto pelo cadastro via admin quanto por qualquer signup futuro).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email, tipo, senha_provisoria)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'tipo', 'aluno'),
    coalesce((new.raw_user_meta_data ->> 'senha_provisoria')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impede que um aluno se autopromova a admin (ou reative a própria conta)
-- via update direto na própria linha de profiles.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() só existe dentro de uma requisição autenticada (PostgREST).
  -- No SQL Editor, em migrations ou via service role, auth.uid() é null —
  -- nesses casos deixa passar (é um contexto de confiança). Só bloqueia
  -- quando é de fato um usuário autenticado não-admin mexendo na própria linha.
  if auth.uid() is not null and not public.is_admin() then
    new.tipo := old.tipo;
    new.email := old.email;
    new.ativo := old.ativo;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_profile_fields_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger treinos_set_updated_at
  before update on public.treinos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RPCs — únicos caminhos de escrita do aluno em treinos/exercicios
-- (RLS não distingue coluna por role, então update direto do aluno fica
-- bloqueado nessas duas tabelas; tudo passa por aqui, validando ownership).
-- ---------------------------------------------------------------------------

create or replace function public.atualizar_exercicio_aluno(
  p_exercicio_id uuid,
  p_carga numeric,
  p_concluido boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aluno_id uuid;
begin
  select t.aluno_id into v_aluno_id
  from public.exercicios e
  join public.treinos t on t.id = e.treino_id
  where e.id = p_exercicio_id;

  if v_aluno_id is null then
    raise exception 'Exercício não encontrado';
  end if;

  if v_aluno_id <> auth.uid() then
    raise exception 'Não autorizado';
  end if;

  update public.exercicios
  set carga = p_carga, concluido = p_concluido
  where id = p_exercicio_id;
end;
$$;

grant execute on function public.atualizar_exercicio_aluno(uuid, numeric, boolean) to authenticated;

create or replace function public.finalizar_treino(p_treino_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aluno_id uuid;
begin
  select aluno_id into v_aluno_id from public.treinos where id = p_treino_id;

  if v_aluno_id is null then
    raise exception 'Treino não encontrado';
  end if;

  if v_aluno_id <> auth.uid() then
    raise exception 'Não autorizado';
  end if;

  update public.treinos
  set status = 'concluido', finalizado_em = now()
  where id = p_treino_id;
end;
$$;

grant execute on function public.finalizar_treino(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Grants de tabela (RLS abaixo restringe as linhas)
-- ---------------------------------------------------------------------------

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.treinos to authenticated;
grant select, insert, update, delete on public.exercicios to authenticated;
grant select, insert, update, delete on public.progresso_peso to authenticated;
grant select, insert, update, delete on public.progresso_fotos to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.treinos enable row level security;
alter table public.exercicios enable row level security;
alter table public.progresso_peso enable row level security;
alter table public.progresso_fotos enable row level security;

-- profiles: aluno vê/edita a própria linha (campos sensíveis protegidos pelo
-- trigger acima); admin vê e edita todas. Sem policy de insert/delete —
-- criação é feita pelo trigger handle_new_user (security definer) a partir
-- do cadastro via service role.
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- treinos: aluno só lê os próprios; toda escrita direta é só do admin
-- (aluno escreve via RPC finalizar_treino).
create policy "treinos_select" on public.treinos
  for select using (aluno_id = auth.uid() or public.is_admin());

create policy "treinos_insert" on public.treinos
  for insert with check (public.is_admin());

create policy "treinos_update" on public.treinos
  for update using (public.is_admin()) with check (public.is_admin());

create policy "treinos_delete" on public.treinos
  for delete using (public.is_admin());

-- exercicios: aluno só lê os do próprio treino; toda escrita direta é só do
-- admin (aluno escreve via RPC atualizar_exercicio_aluno).
create policy "exercicios_select" on public.exercicios
  for select using (
    exists (
      select 1 from public.treinos t
      where t.id = exercicios.treino_id
        and (t.aluno_id = auth.uid() or public.is_admin())
    )
  );

create policy "exercicios_insert" on public.exercicios
  for insert with check (public.is_admin());

create policy "exercicios_update" on public.exercicios
  for update using (public.is_admin()) with check (public.is_admin());

create policy "exercicios_delete" on public.exercicios
  for delete using (public.is_admin());

-- progresso_peso / progresso_fotos: dado do próprio aluno, sem conteúdo
-- prescrito por terceiros — escrita livre nas próprias linhas. Admin só lê.
create policy "progresso_peso_select" on public.progresso_peso
  for select using (aluno_id = auth.uid() or public.is_admin());

create policy "progresso_peso_write" on public.progresso_peso
  for all using (aluno_id = auth.uid()) with check (aluno_id = auth.uid());

create policy "progresso_fotos_select" on public.progresso_fotos
  for select using (aluno_id = auth.uid() or public.is_admin());

create policy "progresso_fotos_write" on public.progresso_fotos
  for all using (aluno_id = auth.uid()) with check (aluno_id = auth.uid());
