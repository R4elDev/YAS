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
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex-1 pb-24">{children}</div>
      <BottomNavAdmin />
    </div>
  );
}
