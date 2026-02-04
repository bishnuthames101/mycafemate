import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/layout/admin-nav";
import { InactivityLogout } from "@/components/auth/inactivity-logout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <>
      <InactivityLogout timeoutMinutes={15} />
      <AdminNav user={session.user} />
      {children}
    </>
  );
}
