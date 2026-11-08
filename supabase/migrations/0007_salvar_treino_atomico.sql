-- YAS — salvar_treino atômico. Idempotente (create or replace).
-- Grava prescrição e exercícios na mesma transação; uma falha preserva o treino anterior.
create or replace function public.salvar_treino(
  p_treino_id uuid, p_aluno_id uuid, p_nome text, p_data date, p_exercicios jsonb
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_ex jsonb;
  v_ordem integer := 0;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'Não autorizado' using errcode = '42501';
  end if;
  if p_nome is null or trim(p_nome) = '' or length(p_nome) > 200 or p_data is null then
    raise exception 'Informe nome e data do treino' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles where id = p_aluno_id and tipo = 'aluno' and ativo) then
    raise exception 'Aluno ativo não encontrado' using errcode = '22023';
  end if;
  if p_exercicios is null or jsonb_typeof(p_exercicios) <> 'array' then
    raise exception 'Exercícios inválidos' using errcode = '22023';
  end if;
  if jsonb_array_length(p_exercicios) < 1 or jsonb_array_length(p_exercicios) > 100 then
    raise exception 'Inclua de 1 a 100 exercícios' using errcode = '22023';
  end if;
  if p_treino_id is null then
    insert into public.treinos(aluno_id, criado_por, nome, data)
      values(p_aluno_id, auth.uid(), trim(p_nome), p_data) returning id into v_id;
  else
    select id into v_id from public.treinos where id = p_treino_id for update;
    if v_id is null then raise exception 'Treino não encontrado' using errcode = '22023'; end if;
    if exists(select 1 from public.treinos where id = v_id and status = 'concluido') then
      raise exception 'Duplique o treino concluído para preservar o histórico' using errcode = '22023';
    end if;
    -- Editar recria os exercícios (delete + insert); isso apagaria registros do aluno.
    if exists(select 1 from public.exercicios where treino_id = v_id and (concluido or carga is not null)) then
      raise exception 'Treino já tem exercícios concluídos ou cargas registradas; crie um novo treino para não perder o progresso do aluno' using errcode = '22023';
    end if;
    update public.treinos set aluno_id = p_aluno_id, nome = trim(p_nome), data = p_data where id = v_id;
    delete from public.exercicios where treino_id = v_id;
  end if;
  for v_ex in select value from jsonb_array_elements(p_exercicios) loop
    if coalesce(trim(v_ex ->> 'nome'), '') = '' or coalesce(trim(v_ex ->> 'repeticoes'), '') = ''
      or coalesce((v_ex ->> 'series')::integer, 0) not between 1 and 100
      or length(v_ex ->> 'nome') > 200 or length(v_ex ->> 'repeticoes') > 50 then
      raise exception 'Exercício precisa de nome, séries positivas e repetições' using errcode = '22023';
    end if;
    insert into public.exercicios(treino_id, catalogo_id, nome, imagem_url, imagem_fim_url, series, repeticoes, observacoes, ordem)
      values(v_id, nullif(v_ex ->> 'catalogo_id', ''), trim(v_ex ->> 'nome'),
        v_ex ->> 'imagem_url', v_ex ->> 'imagem_fim_url', (v_ex ->> 'series')::integer,
        v_ex ->> 'repeticoes', v_ex ->> 'observacoes', v_ordem);
    v_ordem := v_ordem + 1;
  end loop;
  return v_id;
end;
$$;
revoke execute on function public.salvar_treino(uuid,uuid,text,date,jsonb) from public, anon;
grant execute on function public.salvar_treino(uuid,uuid,text,date,jsonb) to authenticated;
