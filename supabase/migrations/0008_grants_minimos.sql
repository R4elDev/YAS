-- YAS — privilégios mínimos nas tabelas do schema public. Idempotente.
-- Projetos Supabase concedem ALL (incl. DELETE/TRUNCATE) a anon/authenticated
-- por default privileges; o RLS cobre linhas, mas não TRUNCATE/REFERENCES.
-- Aqui o acesso é reduzido ao que o app realmente usa. service_role não muda.
begin;

revoke all on public.profiles, public.treinos, public.exercicios,
  public.progresso_peso, public.progresso_fotos, public.exercicios_catalogo
  from anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.treinos to authenticated;
grant select, insert, update, delete on public.exercicios to authenticated;
grant select, insert, update, delete on public.progresso_peso to authenticated;
grant select, insert, update, delete on public.progresso_fotos to authenticated;
grant select on public.exercicios_catalogo to authenticated;

-- Tabelas futuras criadas por este role não herdam acesso para anon.
alter default privileges in schema public revoke all on tables from anon;

commit;
