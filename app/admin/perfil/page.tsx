import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/queries/profiles";
import { AvatarUpload } from "@/components/perfil/avatar-upload";
import { NomeForm } from "@/components/perfil/nome-form";
import { LogoutButton } from "@/components/perfil/logout-button";

export default async function PerfilAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = await getProfile(supabase, user!.id);

  return (
    <main className="yas-page">
      <header className="yas-page-header">
        <div>
          <p className="yas-kicker">Conta</p>
          <h1>Perfil</h1>
        </div>
      </header>

      <div className="yas-page-narrow yas-stack">
        <section className="yas-card yas-card-pad">
          <AvatarUpload
            userId={profile.id}
            nome={profile.nome}
            avatarUrl={profile.avatar_url}
          />
        </section>

        <section className="yas-card yas-card-pad yas-stack">
          <NomeForm nome={profile.nome} />
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Email</span>
            <p className="text-base break-all">{profile.email}</p>
          </div>
        </section>

        <LogoutButton />
      </div>
    </main>
  );
}
