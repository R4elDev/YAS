import { KeyRound } from "lucide-react";
import { TrocarSenhaForm } from "@/components/auth/trocar-senha-form";

export default function TrocarSenhaPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <KeyRound className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold">Defina sua senha</h1>
          <p className="text-sm text-muted-foreground">
            Você entrou com uma senha provisória. Crie uma senha nova antes
            de continuar.
          </p>
        </div>
        <TrocarSenhaForm />
      </div>
    </main>
  );
}
