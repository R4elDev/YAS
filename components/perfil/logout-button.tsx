"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={signOut}>
      <Button
        type="submit"
        variant="outline"
        size="lg"
        className="h-12 w-full gap-2 border-destructive/40 text-base font-bold text-destructive hover:bg-destructive/10"
      >
        <LogOut className="size-5" />
        Sair
      </Button>
    </form>
  );
}
