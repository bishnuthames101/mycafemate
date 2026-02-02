import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { KitchenNav } from "@/components/layout/kitchen-nav";

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "KITCHEN_STAFF") {
    redirect("/login");
  }

  return (
    <>
      <KitchenNav user={session.user} />
      {children}
    </>
  );
}
