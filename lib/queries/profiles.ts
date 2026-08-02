import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@/lib/types/database.types";

export async function getProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function listAlunos(
  supabase: SupabaseClient<Database>
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("tipo", "aluno")
    .order("nome");
  if (error) throw error;
  return data;
}
