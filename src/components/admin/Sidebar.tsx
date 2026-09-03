"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/auth.actions";
import { showAlert } from "@/lib/alert";
import {
  LayoutDashboard,
  Sliders,
  ListFilter,
  Users,
  KeyRound,
  Database,
  ExternalLink,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({
  session,
}: {
  session?: { username: string; name: string } | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      color: "text-sky-400",
    },
    {
      href: "/admin/settings",
      label: "Nama Kegiatan & App",
      icon: Sliders,
      color: "text-blue-400",
    },
    {
      href: "/admin/validation-fields",
      label: "Setting Kolom Validasi",
      icon: ListFilter,
      color: "text-emerald-400",
    },
    {
      href: "/admin/participants",
      label: "Data Peserta & Kelulusan",
      icon: Users,
      color: "text-amber-400",
    },
    {
      href: "/admin/backup",
      label: "Backup & Reset Data",
      icon: Database,
      color: "text-purple-400",
    },
    {
      href: "/admin/change-password",
      label: "Ubah Password Admin",
      icon: KeyRound,
      color: "text-indigo-400",
    },
  ];

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await showAlert.confirm(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari panel admin?",
      "Ya, Keluar"
    );
    if (result.isConfirmed) {
      await logoutAdmin();
    }
  };

  const NavContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-md shadow-blue-600/30">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white leading-none">PANEL ADMIN</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-1">PORTAL PENGUMUMAN</p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Pill */}
        {session && (
          <div className="mb-5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{session.name || session.username}</p>
              <p className="text-[10px] text-emerald-400 font-medium font-mono">@{session.username}</p>
            </div>
          </div>
        )}

        <nav className="space-y-1.5 text-sm font-medium">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : item.color}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white py-2.5 px-3 rounded-xl hover:bg-slate-800 transition"
        >
          <span>Lihat Halaman Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <form onSubmit={handleLogout}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 py-2.5 px-3 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar / Logout</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top App Bar with Menu Button */}
      <div className="lg:hidden w-full bg-slate-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-xl">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-black text-white leading-none">PANEL ADMIN</h2>
            <p className="text-[9px] text-slate-400 mt-0.5">PORTAL PENGUMUMAN</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-over Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in"
        />
      )}

      {/* Mobile Slide-over Drawer Content */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-slate-900 text-white p-5 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white min-h-screen p-5 flex-col justify-between border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        <NavContent />
      </aside>
    </>
  );
}
