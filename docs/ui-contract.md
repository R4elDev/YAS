# Contrato de UI — YAS (admin + aluno)

Dono do contrato: Prisma (shell, `app/globals.css`, `components/layout/*`, `components/ui/*`, admin).
Aluno (Crivo) consome; falta algo → pedir, não inventar utilitário global.

## Casca (`components/layout/app-shell.tsx`)

- `>= 1024px`: sidebar fixa 272px + conteúdo (`.app-content`, máx. 1240px, centralizado).
- `< 1024px`: topbar sticky + bottom-nav flutuante (`.yas-bottom-nav`) com safe-area.
- `.app-content` já reserva o espaço da bottom-nav. **Páginas não põem `pb`/`pt` de navegação nem `max-w` no `<main>`.**
- Itens de navegação: `components/layout/nav-itens.ts` (fonte única; sidebar e bottom-nav).

## Página

```tsx
<main className="yas-page">
  <header className="yas-page-header">
    <div>
      <p className="yas-kicker">Seção</p>
      <h1>Título</h1>
      <p>Descrição curta.</p>
    </div>
    {/* ações (Button) */}
  </header>
  ...
</main>
```

`.yas-page`: coluna com `gap` 24/28/32, padding 16 (mobile) → 24 (≥640) → 48 (≥1024). Formulários: `yas-page-narrow` no container (máx. 640px).

## Utilitários (todos em `globals.css`)

| Classe | Uso |
|---|---|
| `.yas-card` (+ `.yas-card-pad`) | superfície padrão |
| `.yas-card-link` | card clicável (hover só com mouse, `:active` scale .985) |
| `.yas-hero-card` / `.yas-cream-card` | destaque coral / creme |
| `.yas-section-title` | rótulo de seção (caixa alta, 12px) |
| `.yas-kicker` | micro-rótulo coral acima do h1 |
| `.yas-stack` | coluna com gap 12 |
| `.yas-grid` | grade responsiva `auto-fill, minmax(320px)` |
| `.yas-stat-grid` + `.yas-stat` | números-resumo (2 col mobile, 4 col ≥640) |
| `.yas-chip` (`aria-pressed`/`data-active`) | filtro/pílula; 44px em touch, 36px com mouse |
| `.yas-chip-row` | linha de chips: scroll horizontal no mobile, quebra ≥640 |
| `.yas-empty` (+ `.yas-empty-pose`, `.yas-empty-actions`) | estado vazio com YasPose |
| `.yas-form` | coluna de campos (gap 20) |

## Regras

- Alvo de toque mínimo **44px** (botões `h-11`/`h-12`, chips, itens de lista). Ícone-botão: `size="icon"` (44px).
- Sem overflow horizontal em 320px: textos longos com `truncate`/`min-w-0`; flex com `min-w-0`.
- Cores só por token (`--primary` coral, `--cream`, `--card`, `--muted-foreground`). Sem hex solto.
- Animação: só `transform`/`opacity`, ease-out `var(--ease-out)`, ≤ 300ms; `:active` scale .97–.985; hover sob `@media (hover:hover) and (pointer:fine)`.
- Loading: `YasLoader` para rota inteira; skeleton (`components/ui/skeleton`) dentro de listas.
- Poses: `YasPose` (`/public/yas/*.png`) em estados vazios e destaques, 1 por tela, `sizes` pequeno. Nunca como fundo repetido.
- Estilos exclusivos do aluno: `app/aluno/aluno.css`, prefixo `.aluno-*` (importado em `app/aluno/layout.tsx`).

## Breakpoints de verificação

320, 390, 768, 1024+, 1440.
