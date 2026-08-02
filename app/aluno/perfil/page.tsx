import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { AvatarUpload } from "@/components/perfil/avatar-upload";
import { NomeForm } from "@/components/perfil/nome-form";
import { LogoutButton } from "@/components/perfil/logout-button";

export default async function PerfilAlunoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile(supabase, user!.id);

  return (
    <main className="flex flex-col gap-8 px-5 pt-8">
      <h1 className="text-2xl font-extrabold">Perfil</h1>

      <AvatarUpload
        userId={profile.id}
        nome={profile.nome}
        avatarUrl={profile.avatar_url}
      />

      <div className="flex flex-col gap-4">
        <NomeForm nome={profile.nome} />
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Email</span>
          <p className="text-base">{profile.email}</p>
        </div>
      </div>

      <LogoutButton />
    </main>
  );
}
