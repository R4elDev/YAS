import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col px-6 py-8">
      <Link
        href="/"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3 text-center">
            <Image
              src="/logo-app.png"
              alt="YAS"
              width={96}
              height={96}
              priority
              className="mx-auto size-24 object-contain"
            />
            <p className="text-muted-foreground">
              Entre para ver seus treinos
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem conta? Fale com seu instrutor para ele liberar seu
            acesso.
          </p>
        </div>
      </div>
    </main>
  );
}
