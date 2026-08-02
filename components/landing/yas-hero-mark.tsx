import Image from "next/image";

/** Logo animada "crescendo" de baixo pra cima ao entrar na tela — mesma
 * ideia de evolução do YasLoader, só que aplicada à logo de verdade. */
export function YasHeroMark() {
  return (
    <div className="hero-logo-reveal w-56 sm:w-72">
      <Image
        src="/logo-landing.png"
        alt="YAS — Treine. Evolua. Supere-se."
        width={500}
        height={500}
        priority
        className="h-auto w-full"
      />
    </div>
  );
}
