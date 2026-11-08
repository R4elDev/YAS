/**
 * GIFs de exercício estão ocultos na UI (decisão de produto). Só esconde: o
 * dado (imagem_url de snapshots antigos, Storage, banco) permanece intacto.
 * Imagens estáticas enviadas pelo personal continuam aparecendo.
 */
export function ehGif(url: string | null | undefined): boolean {
  return Boolean(url && /\.gif($|[?#])/i.test(url));
}

/** URL pronta para exibição: null quando for GIF. */
export function midiaVisivel(url: string | null | undefined): string | null {
  return url && !ehGif(url) ? url : null;
}
