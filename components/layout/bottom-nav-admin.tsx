"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Dumbbell, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITENS = [
  { href: "/admin/alunos", label: "Alunos", icon: Users },
  { href: "/admin/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/admin/progresso", label: "Progresso", icon: TrendingUp },
  { href: "/admin/perfil", label: "Perfil", icon: User },
];

export function BottomNavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {ITENS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
