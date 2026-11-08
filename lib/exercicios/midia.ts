/**
 * Mídia da ExerciseDB fica oculta na UI: o app usa só o catálogo do próprio
 * banco. Só esconde — imagem_url de snapshots antigos, Storage e banco ficam
 * intactos. Fotos do Supabase e imagens enviadas pelo personal aparecem.
 */
export function ehExternaExerciseDb(url: string | null | undefined): boolean {
  return Boolean(url && /^https?:\/\/([^/]+\.)?exercisedb\.dev\//i.test(url));
}

/** URL pronta para exibição: null quando for mídia da ExerciseDB. */
export function midiaVisivel(url: string | null | undefined): string | null {
  return url && !ehExternaExerciseDb(url) ? url : null;
}
