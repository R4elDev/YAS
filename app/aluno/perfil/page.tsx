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
    <main className="yas-page yas-page-narrow">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Sua conta</p>
          <h1>Perfil</h1>
        </div>
      </header>

      <AvatarUpload
        userId={profile.id}
        nome={profile.nome}
        avatarUrl={profile.avatar_url}
      />

      <section className="yas-card yas-card-pad yas-form">
        <NomeForm nome={profile.nome} />
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">Email</span>
          <p className="min-w-0 truncate text-base">{profile.email}</p>
        </div>
      </section>

      <LogoutButton />
    </main>
  );
}
