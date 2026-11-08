-- YAS — segurança e integridade. Idempotente: pode ser reexecutada e aplicada
-- em projetos que já executaram 0001–0005.
begin;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and tipo = 'admin' and ativo);
$$;

create or replace function public.is_active_user()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and ativo);
$$;

-- user_metadata é editável pelo usuário; nunca determina privilégios.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, nome, email, tipo, senha_provisoria)
  values (new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nome'), ''), split_part(new.email, '@', 1)),
    new.email, 'aluno', coalesce(new.raw_user_meta_data ->> 'senha_provisoria', 'false') = 'true');
  return new;
end;
$$;

create or replace function public.atualizar_exercicio_aluno(p_exercicio_id uuid, p_carga numeric, p_concluido boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare v_aluno_id uuid;
begin
  if auth.uid() is null or not public.is_active_user() then
    raise exception 'Não autorizado' using errcode = '42501';
  end if;
  if p_concluido is null or (p_carga is not null and (p_carga < 0 or p_carga >= 10000)) then
    raise exception 'Carga ou conclusão inválida' using errcode = '22023';
  end if;
  select t.aluno_id into v_aluno_id from public.exercicios e
    join public.treinos t on t.id = e.treino_id where e.id = p_exercicio_id;
  if v_aluno_id is distinct from auth.uid() then
    raise exception 'Não autorizado' using errcode = '42501';
  end if;
  update public.exercicios set carga = p_carga, concluido = p_concluido where id = p_exercicio_id;
end;
$$;

create or replace function public.finalizar_treino(p_treino_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_aluno_id uuid;
begin
  if auth.uid() is null or not public.is_active_user() then
    raise exception 'Não autorizado' using errcode = '42501';
  end if;
  select aluno_id into v_aluno_id from public.treinos where id = p_treino_id for update;
  if v_aluno_id is distinct from auth.uid() then
    raise exception 'Não autorizado' using errcode = '42501';
  end if;
  if not exists (select 1 from public.exercicios where treino_id = p_treino_id)
     or exists (select 1 from public.exercicios where treino_id = p_treino_id and not concluido) then
    raise exception 'Conclua os exercícios antes de finalizar o treino' using errcode = '22023';
  end if;
  update public.treinos set status = 'concluido', finalizado_em = coalesce(finalizado_em, now())
    where id = p_treino_id;
end;
$$;

revoke execute on function public.atualizar_exercicio_aluno(uuid,numeric,boolean), public.finalizar_treino(uuid) from public, anon;
grant execute on function public.atualizar_exercicio_aluno(uuid,numeric,boolean), public.finalizar_treino(uuid) to authenticated;
revoke execute on function public.handle_new_user(), public.protect_profile_fields(), public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.is_admin(), public.is_active_user() from public, anon;
grant execute on function public.is_admin(), public.is_active_user() to authenticated;

-- Policies restritivas se somam às regras de propriedade já existentes.
do $$
declare target text;
begin
  foreach target in array array['profiles','treinos','exercicios','progresso_peso','progresso_fotos','exercicios_catalogo'] loop
    execute format('drop policy if exists active_account on public.%I', target);
    execute format('create policy active_account on public.%I as restrictive for all to authenticated using (public.is_active_user()) with check (public.is_active_user())', target);
    execute format('revoke all on public.%I from anon', target);
  end loop;
end;
$$;

drop policy if exists active_account_storage on storage.objects;
create policy active_account_storage on storage.objects as restrictive for all to authenticated
  using (bucket_id not in ('avatars','exercicios','progresso-fotos') or public.is_active_user())
  with check (bucket_id not in ('avatars','exercicios','progresso-fotos') or public.is_active_user());

-- NOT VALID: vale para toda linha nova/alterada sem varrer dados legados.
alter table public.exercicios drop constraint if exists exercicios_series_positivas;
alter table public.exercicios add constraint exercicios_series_positivas check (series > 0) not valid;
alter table public.exercicios drop constraint if exists exercicios_carga_valida;
alter table public.exercicios add constraint exercicios_carga_valida check (carga is null or (carga >= 0 and carga < 10000)) not valid;
alter table public.progresso_peso drop constraint if exists progresso_peso_positivo;
alter table public.progresso_peso add constraint progresso_peso_positivo check (peso > 0 and peso < 1000) not valid;
alter table public.progresso_fotos drop constraint if exists progresso_foto_prefixo;
alter table public.progresso_fotos add constraint progresso_foto_prefixo check (split_part(foto_url, '/', 1) = aluno_id::text) not valid;
create index if not exists exercicios_catalogo_id_idx on public.exercicios(catalogo_id);
create index if not exists treinos_criado_por_idx on public.treinos(criado_por);

update storage.buckets set file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif']
  where id in ('avatars','exercicios','progresso-fotos');
commit;
