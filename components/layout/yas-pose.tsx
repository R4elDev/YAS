import Image from "next/image";

export type YasPoseName = "convite" | "personal" | "hidratacao" | "forca" | "jornada" | "halter" | "planejamento" | "preparo" | "alongamento" | "conquista";

export function YasPose({ pose, className = "", priority = false, sizes = "(max-width: 640px) 80vw, 320px" }: { pose: YasPoseName; className?: string; priority?: boolean; sizes?: string }) {
  return <Image src={`/yas/${pose}.png`} alt="" width={1122} height={1402} sizes={sizes} priority={priority} className={className} />;
}
