import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin-auth";
import { getContent } from "@/lib/content-store";
import { adminContent } from "@/lib/content-schema";
import AdminEditor from "@/components/admin/AdminEditor";
export default async function AdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  const record = await getContent();
  return <AdminEditor initial={{ ...record, content: adminContent(record.content) }} email={admin.email} />;
}
