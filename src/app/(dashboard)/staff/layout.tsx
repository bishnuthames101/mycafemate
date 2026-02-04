import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { StaffNav } from "@/components/layout/staff-nav";
import { InactivityLogout } from "@/components/auth/inactivity-logout";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <InactivityLogout timeoutMinutes={15} />
      <StaffNav user={session.user} />
      {children}
    </>
  );
}
