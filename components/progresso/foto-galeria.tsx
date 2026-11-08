import Image from "next/image";
import type { ProgressoFotoComUrl } from "@/lib/queries/progresso";
import { formatDataLonga } from "@/lib/utils/date";

export function FotoGaleria({ fotos }: { fotos: ProgressoFotoComUrl[] }) {
  if (fotos.length === 0) {
    return (
      <div className="yas-empty pb-6">
        <strong>Nenhuma foto ainda</strong>
        <p>Envie uma foto para comparar sua evolução ao longo do tempo.</p>
      </div>
    );
  }

  const grupos = new Map<string, ProgressoFotoComUrl[]>();
  for (const foto of fotos) {
    const lista = grupos.get(foto.data) ?? [];
    lista.push(foto);
    grupos.set(foto.data, lista);
  }

  return (
    <div className="flex flex-col gap-5">
      {Array.from(grupos.entries()).map(([data, fotosData]) => (
        <div key={data} className="flex flex-col gap-2">
          <h3 className="text-sm font-bold text-muted-foreground">
            {formatDataLonga(data)}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {fotosData.map((foto) =>
              foto.url ? (
                <div
                  key={foto.id}
                  className="relative aspect-square overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={foto.url}
                    alt={`Foto de progresso de ${formatDataLonga(foto.data)}`}
                    fill
                    sizes="(min-width: 640px) 25vw, (min-width: 400px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
