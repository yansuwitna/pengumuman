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
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      <Sidebar session={session} />
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 w-full">
        <main className="flex-1 w-full max-w-full p-4 sm:p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
