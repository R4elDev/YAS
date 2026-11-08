"use client";

import { Home, Dumbbell, TrendingUp, User } from "lucide-react";
import { BottomNav } from "@/components/layout/bottom-nav";

const ITENS = [
  { href: "/aluno/inicio", label: "Início", icon: Home },
  { href: "/aluno/treinos", label: "Treinos", icon: Dumbbell },
  { href: "/aluno/progresso", label: "Progresso", icon: TrendingUp },
  { href: "/aluno/perfil", label: "Perfil", icon: User },
];

export function BottomNavAluno() {
  return <BottomNav itens={ITENS} />;
}
