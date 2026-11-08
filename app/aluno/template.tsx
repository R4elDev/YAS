export default function Template({ children }: { children: React.ReactNode }) {
  // Remonta a cada navegação: dispara a entrada curta (180ms, opacidade/translate).
  return <div className="yas-page-enter">{children}</div>;
}
