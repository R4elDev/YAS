import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Galeria "Ícones (rosto)" da Yas: 10 expressões, copiadas sem edição de arte
 * (apenas redimensionadas para 640px) em /public/yas/rostos. São imagens RGB
 * com fundo branco — não têm transparência —, por isso aparecem num avatar
 * branco arredondado.
 */
export const ROSTOS_YAS = [
  "feliz-orgulhosa",
  "surpresa-orgulho",
  "gargalhada",
  "pensativa",
  "bebendo-agua",
  "beijo-finalizacao",
  "cansada-sono",
  "cansada",
  "chateada",
  "brava",
] as const;

export type YasRosto = (typeof ROSTOS_YAS)[number];

interface YasFaceProps {
  rosto?: YasRosto;
  /** Lado do avatar em px. */
  size?: number;
  className?: string;
}

export function YasFace({
  rosto = "feliz-orgulhosa",
  size = 56,
  className,
}: YasFaceProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("yas-face", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/yas/rostos/${rosto}.png`}
        alt=""
        width={640}
        height={640}
        sizes={`${size * 2}px`}
      />
    </span>
  );
}
