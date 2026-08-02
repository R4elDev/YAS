import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const PESOS = [
  { left: "4%", size: 60, blur: "blur-sm", opacity: 0.12, duration: 22, delay: -2 },
  { left: "16%", size: 96, blur: "blur-md", opacity: 0.08, duration: 29, delay: -14 },
  { left: "30%", size: 44, blur: "blur-sm", opacity: 0.16, duration: 17, delay: -6 },
  { left: "46%", size: 112, blur: "blur-lg", opacity: 0.06, duration: 33, delay: -20 },
  { left: "60%", size: 52, blur: "blur-sm", opacity: 0.14, duration: 19, delay: -9 },
  { left: "74%", size: 84, blur: "blur-md", opacity: 0.09, duration: 26, delay: -3 },
  { left: "86%", size: 40, blur: "blur-sm", opacity: 0.17, duration: 15, delay: -11 },
  { left: "94%", size: 72, blur: "blur-md", opacity: 0.1, duration: 24, delay: -17 },
] as const;

/** Decoração ambiente: halteres desfocados caindo devagar atrás do conteúdo. */
export function PesosCaindo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {PESOS.map((peso, i) => (
        <Dumbbell
          key={i}
          className={cn("falling-weight absolute -top-24 text-primary", peso.blur)}
          style={{
            left: peso.left,
            width: peso.size,
            height: peso.size,
            opacity: peso.opacity,
            animationDuration: `${peso.duration}s`,
            animationDelay: `${peso.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
