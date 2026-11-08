"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ITENS_POR_PAPEL, type NavItem, type Papel } from "@/components/layout/nav-itens";

export type { NavItem };

function ativo(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

/** Navegação inferior (mobile/tablet). Escondida em >=1024px pelo CSS. */
export function BottomNav({ itens }: { itens: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="yas-bottom-nav" aria-label="Navegação principal">
      <ul>
        {itens.map(({ href, label, icon: Icon }) => {
          const on = ativo(pathname, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={on ? "page" : undefined}>
                <Icon className="size-5" strokeWidth={on ? 2.5 : 2} aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Navegação lateral (desktop >=1024px). Escondida abaixo pelo CSS. */
export function SidebarNav({ papel }: { papel: Papel }) {
  const pathname = usePathname();

  return (
    <nav className="yas-sidebar-nav" aria-label="Navegação lateral">
      <ul>
        {ITENS_POR_PAPEL[papel].map(({ href, label, icon: Icon }) => {
          const on = ativo(pathname, href);
          return (
            <li key={href}>
              <Link href={href} aria-current={on ? "page" : undefined}>
                <Icon className="size-[18px]" strokeWidth={on ? 2.5 : 2} aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
