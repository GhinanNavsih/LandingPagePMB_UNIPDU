import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";
export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return <LoginForm />;
}
