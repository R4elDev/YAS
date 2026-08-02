-- YAS — promove o primeiro usuário admin.
--
-- Não existe cadastro público no app: todo acesso é criado pelo admin
-- (tela "+ Adicionar aluno"). O primeiro admin, porém, precisa ser criado
-- manualmente uma única vez:
--
-- 1. No painel do Supabase: Authentication -> Users -> "Add user".
--    Preencha email e senha, marque "Auto Confirm User" e salve.
--    (isso já cria a linha correspondente em public.profiles, como aluno,
--    via trigger handle_new_user — falta só promover o tipo abaixo)
--
-- 2. Troque o email abaixo pelo email que você acabou de criar e rode
--    este script inteiro no SQL Editor.

update public.profiles
set tipo = 'admin'
where email = 'seu-email@exemplo.com';

-- 3. Confira que funcionou:
select id, nome, email, tipo from public.profiles where email = 'seu-email@exemplo.com';
