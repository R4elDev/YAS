// Validação central das variáveis do Supabase. Sem server-only: o proxy e
// componentes podem usar `hasSupabaseEnv()` para degradar com segurança
// (landing pública abre sem banco; áreas protegidas ficam fechadas).
// Importante: NEXT_PUBLIC_* precisa de acesso estático para ir ao bundle.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function urlValida(v?: string) {
  if (!v) return false;
  try {
    return /^https?:$/.test(new URL(v).protocol);
  } catch {
    return false;
  }
}

export function hasSupabaseEnv(): boolean {
  return urlValida(url) && !!anonKey?.trim();
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  if (!hasSupabaseEnv()) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local (veja .env.local.example)."
    );
  }
  return { url: url!, anonKey: anonKey! };
}
