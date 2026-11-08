"use client";

import { Users, Dumbbell, TrendingUp, User } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";

const ITENS = [
  { href: "/admin/alunos", label: "Alunos", icon: Users },
  { href: "/admin/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/admin/progresso", label: "Progresso", icon: TrendingUp },
  { href: "/admin/perfil", label: "Perfil", icon: User },
];

export function BottomNavAdmin() {
  return <BottomNav itens={ITENS} />;
}
