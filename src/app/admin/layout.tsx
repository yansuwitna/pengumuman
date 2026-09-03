import Sidebar from "@/components/admin/Sidebar";
import { getAdminSession } from "@/actions/auth.actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Jika belum login saat mengakses seluruh halaman admin, redirect langsung ke /login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 font-sans">
      <Sidebar session={session} />
      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
