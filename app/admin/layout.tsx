import Link from "next/link";
import { YasBrand } from "@/components/layout/yas-brand";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNavAdmin } from "@/components/layout/bottom-nav-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tipo")
    .eq("id", user.id)
    .single();
  if (profile?.tipo !== "admin") redirect("/");

  return (
    <div className="app-frame flex flex-1 flex-col">
      <header className="app-topbar"><Link href="/" aria-label="YAS início"><YasBrand /></Link><span className="app-topbar-label">Área do personal</span></header><div className="app-content flex-1 pb-28">{children}</div>
      <BottomNavAdmin />
    </div>
  );
}
