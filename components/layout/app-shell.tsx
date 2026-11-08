import Link from "next/link";
import { YasBrand } from "@/components/layout/yas-brand";
import { YasPose } from "@/components/layout/yas-pose";
import { BottomNav, SidebarNav } from "@/components/layout/bottom-nav";
import type { Papel } from "@/components/layout/nav-itens";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { YasPopups } from "@/components/yas/yas-popups";

const ROTULO: Record<Papel, string> = {
  admin: "Área do personal",
  aluno: "Seu espaço de treino",
};

interface AppShellProps {
  papel: Papel;
  usuarioId: string;
  nome: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}

/**
 * Casca compartilhada admin + aluno.
 * >=1024px: sidebar fixa + conteúdo largo. <1024px: topbar + bottom-nav.
 * As páginas só renderizam <main className="yas-page">.
 */
export function AppShell({
  papel,
  usuarioId,
  nome,
  avatarUrl,
  children,
}: AppShellProps) {
  const perfilHref = papel === "admin" ? "/admin/perfil" : "/aluno/perfil";

  return (
    <div className="app-shell">
      <a href="#conteudo" className="yas-skip-link">
        Pular para o conteúdo
      </a>

      <aside className="app-sidebar">
        <Link href="/" aria-label="YAS início" className="app-sidebar-brand">
          <YasBrand />
        </Link>
        <p className="app-sidebar-role">{ROTULO[papel]}</p>
        <SidebarNav papel={papel} />
        <div className="app-sidebar-pose" aria-hidden="true">
          <YasPose
            pose={papel === "admin" ? "planejamento" : "forca"}
            sizes="220px"
          />
        </div>
        <Link href={perfilHref} className="app-sidebar-user">
          <Avatar className="size-10">
            <AvatarImage src={avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="font-bold">
              {nome.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0">
            <strong>{nome}</strong>
            <small>Ver perfil</small>
          </span>
        </Link>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <Link href="/" aria-label="YAS início">
            <YasBrand />
          </Link>
          <span className="app-topbar-label">{ROTULO[papel]}</span>
        </header>
        <div id="conteudo" className="app-content">
          {/* No fluxo: o recado da Yas reserva altura acima da página. */}
          <YasPopups papel={papel} usuarioId={usuarioId} nome={nome} />
          {children}
        </div>
      </div>

      <BottomNav papel={papel} />
    </div>
  );
}
