import { AdminShell } from "@/src/components/admin/AdminShell";
import { requireAdmin } from "@/src/lib/admin-auth";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const identity = await requireAdmin();

  return <AdminShell identity={identity}>{children}</AdminShell>;
}
