import { Home, Dumbbell, TrendingUp, User, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export type Papel = "admin" | "aluno";

export const ITENS_ADMIN: NavItem[] = [
  { href: "/admin/alunos", label: "Alunos", icon: Users },
  { href: "/admin/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/admin/progresso", label: "Progresso", icon: TrendingUp },
  { href: "/admin/perfil", label: "Perfil", icon: User },
];

export const ITENS_ALUNO: NavItem[] = [
  { href: "/aluno/inicio", label: "Início", icon: Home },
  { href: "/aluno/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/aluno/progresso", label: "Progresso", icon: TrendingUp },
  { href: "/aluno/perfil", label: "Perfil", icon: User },
];

export const ITENS_POR_PAPEL: Record<Papel, NavItem[]> = {
  admin: ITENS_ADMIN,
  aluno: ITENS_ALUNO,
};
