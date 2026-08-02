# YAS — Acompanhamento de treinos

App mobile-first (dark mode, preto + vermelho) com duas áreas: **Cliente**
(aluno) e **Admin** (personal trainer). Next.js (App Router) + TypeScript +
Tailwind + shadcn/ui no front, Supabase (Postgres + Auth + Storage) no back.

Não existe cadastro público — todo acesso é criado pelo admin (tela "+
Adicionar aluno"), com senha provisória que o aluno troca no primeiro login.
A landing page (`/`) só explica o app e leva pro login.

## 1. Criar o projeto no Supabase

1. Crie uma conta e um novo projeto em [supabase.com](https://supabase.com) (plano free serve).
2. Em **Project Settings → API**, copie:
   - `Project URL`
   - `anon public` key
   - `service_role` key (secreta — nunca exponha no client)
3. Copie `.env.local.example` para `.env.local` e preencha as três variáveis.

## 2. Rodar o schema

No painel do Supabase, abra o **SQL Editor** e rode, nesta ordem, o conteúdo de:

1. `supabase/migrations/0001_init.sql` — tabelas, RLS, funções e RPCs.
2. `supabase/migrations/0002_storage.sql` — buckets de imagem e suas policies.
3. `supabase/migrations/0003_senha_provisoria.sql` — flag de senha provisória.
4. `supabase/migrations/0004_exercicios_catalogo.sql` — catálogo de exercícios.
5. `supabase/migrations/0005_exercicio_imagem_fim.sql` — segunda imagem (posição final) no exercício prescrito.

Depois, popule o catálogo de exercícios (uma vez só, local):

```bash
npx tsx scripts/importar-catalogo-exercicios.ts
```

## 3. Criar o primeiro admin

O **primeiro usuário admin** não tem como se autopromover — precisa ser
criado manualmente uma única vez. Passo a passo em
`supabase/scripts/promover_primeiro_admin.sql`:

1. Em **Authentication → Users** no painel Supabase, clique em "Add user"
   (email + senha, marque "Auto Confirm User").
2. No **SQL Editor**, rode o conteúdo de `promover_primeiro_admin.sql`
   trocando o email pelo que você acabou de criar.

Depois disso, esse admin usa a tela "+ Adicionar aluno" pra criar todo o
resto dos acessos — sem precisar mais voltar ao SQL Editor.

## 4. Rodar o app

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — `/` é a landing page,
`/login` redireciona automaticamente para a área do aluno ou do admin
conforme o `tipo` do usuário em `profiles`.

## Estrutura

- `app/page.tsx` — landing page pública
- `app/aluno/*` — área do cliente (Início, Treinos, Detalhe do Treino, Progresso, Perfil)
- `app/admin/*` — área do personal (Alunos, Treinos, Progresso, Perfil)
- `proxy.ts` — sessão Supabase + redirecionamento por tipo de usuário (Next.js 16 renomeou `middleware.ts` para `proxy.ts`)
- `lib/supabase/` — clients Supabase (browser, server, admin/service-role)
- `lib/actions/` — Server Actions (mutações)
- `lib/queries/` — leituras de dados usadas pelos Server Components
- `supabase/migrations/` — schema, RLS e storage policies
- `supabase/scripts/` — scripts SQL de uso pontual (ex.: promover o primeiro admin)
- `scripts/` — scripts Node de manutenção (ex.: importação do catálogo de exercícios)
"# YAS" 
