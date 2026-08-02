export function YasLetter({
  char,
  delayMs,
}: {
  char: string;
  delayMs: number;
}) {
  return (
    <span className="yas-loader-letter">
      <span className="yas-loader-letter-base">{char}</span>
      <span
        className="yas-loader-letter-fill"
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {char}
      </span>
    </span>
  );
}
