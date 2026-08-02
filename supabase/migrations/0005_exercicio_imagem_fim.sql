-- YAS — segunda imagem (posição final do movimento) no exercício prescrito,
-- pra permitir mostrar início/fim ao aluno (sem GIF real disponível no
-- catálogo importado). Rode depois do 0004, no SQL Editor do seu projeto.

alter table public.exercicios
  add column imagem_fim_url text;
