import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

// Client com a service role key — nunca importar isto de um Client Component.
// Usado apenas para ações administrativas que exigem a Admin API do
// Supabase Auth (ex.: criar login de aluno).
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
