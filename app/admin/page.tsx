import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin-auth";
import { getContent } from "@/lib/content-store";
import AdminEditor from "@/components/admin/AdminEditor";
export default async function AdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return <AdminEditor initial={await getContent()} email={admin.email} />;
}
