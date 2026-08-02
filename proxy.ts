import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Next.js 16 renomeou middleware.ts -> proxy.ts (mesma função: roda antes da
// rota renderizar). Aqui: mantém a sessão Supabase atualizada e redireciona
// por tipo de usuário (aluno/admin).
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAlunoRoute = pathname.startsWith("/aluno");
  const isAdminRoute = pathname.startsWith("/admin");
  const isTrocarSenhaRoute = pathname === "/trocar-senha";
  // "/" é a landing page pública — só redireciona quando já há sessão.
  const isRotaSoDeslogado = pathname === "/login";

  if (!user) {
    if (isAlunoRoute || isAdminRoute || isTrocarSenhaRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  if (
    isAlunoRoute ||
    isAdminRoute ||
    isRotaSoDeslogado ||
    isTrocarSenhaRoute ||
    pathname === "/"
  ) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("tipo, senha_provisoria")
      .eq("id", user.id)
      .single();

    const destino =
      profile?.tipo === "admin" ? "/admin/alunos" : "/aluno/inicio";

    // Senha provisória: trava tudo em /trocar-senha até o usuário definir
    // uma senha nova.
    if (profile?.senha_provisoria) {
      if (!isTrocarSenhaRoute) {
        return NextResponse.redirect(new URL("/trocar-senha", request.url));
      }
      return supabaseResponse;
    }
    if (isTrocarSenhaRoute) {
      return NextResponse.redirect(new URL(destino, request.url));
    }

    if (isRotaSoDeslogado || pathname === "/") {
      return NextResponse.redirect(new URL(destino, request.url));
    }
    if (isAlunoRoute && profile?.tipo !== "aluno") {
      return NextResponse.redirect(new URL(destino, request.url));
    }
    if (isAdminRoute && profile?.tipo !== "admin") {
      return NextResponse.redirect(new URL(destino, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
