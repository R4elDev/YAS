-- YAS — flag de senha provisória (força troca no primeiro login de contas
-- criadas pelo admin). Rode depois do 0001_init.sql e 0002_storage.sql.

alter table public.profiles
  add column senha_provisoria boolean not null default false;

-- Atualiza a trigger de criação de profile pra ler "senha_provisoria" do
-- user_metadata (setado pelo admin ao criar aluno). Cadastro público
-- (/cadastro) nunca passa essa chave, então continua default false.
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
