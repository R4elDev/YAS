-- YAS — buckets de storage e policies
-- Rode depois do 0001_init.sql, no SQL Editor do seu projeto Supabase.

insert into storage.buckets (id, name, public)
values
  ('exercicios', 'exercicios', true),
  ('avatars', 'avatars', true),
  ('progresso-fotos', 'progresso-fotos', false)
on conflict (id) do nothing;

-- exercicios: leitura pública (imagens usadas nos cards de treino),
-- escrita só admin.
create policy "exercicios_bucket_read" on storage.objects
  for select using (bucket_id = 'exercicios');

create policy "exercicios_bucket_admin_write" on storage.objects
  for insert with check (bucket_id = 'exercicios' and public.is_admin());

create policy "exercicios_bucket_admin_update" on storage.objects
  for update using (bucket_id = 'exercicios' and public.is_admin());

create policy "exercicios_bucket_admin_delete" on storage.objects
  for delete using (bucket_id = 'exercicios' and public.is_admin());

-- avatars: leitura pública, escrita restrita ao próprio usuário.
-- Convenção de path: {user_id}/arquivo.ext
create policy "avatars_bucket_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_bucket_write_own" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_bucket_update_own" on storage.objects
  for update using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_bucket_delete_own" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- progresso-fotos: privado. Convenção de path: {aluno_id}/arquivo.ext
-- Aluno só acessa o próprio prefixo; admin lê tudo (visão de progresso).
create policy "progresso_fotos_bucket_select" on storage.objects
  for select using (
    bucket_id = 'progresso-fotos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text or public.is_admin()
    )
  );

create policy "progresso_fotos_bucket_insert" on storage.objects
  for insert with check (
    bucket_id = 'progresso-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "progresso_fotos_bucket_delete" on storage.objects
  for delete using (
    bucket_id = 'progresso-fotos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
