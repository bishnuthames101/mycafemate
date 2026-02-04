import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/layout/SignOutButton";
import SuperAdminHeader from "@/components/layout/SuperAdminHeader";
import { InactivityLogout } from "@/components/auth/inactivity-logout";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Ensure only super admins can access
  if (!session || session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InactivityLogout timeoutMinutes={4} />
      {/* Header */}
      <SuperAdminHeader userEmail={session.user.email || ""} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
