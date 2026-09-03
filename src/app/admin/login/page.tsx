"use client";

import React, { useState } from "react";
import { loginAdmin } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { Lock, User, KeyRound, Eye, EyeOff, Loader2, Award, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdmin(formData);
      if (res.success) {
        router.push("/admin/settings");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Username atau password salah!");
      }
    } catch {
      setErrorMsg("Terjadi kesalahan saat masuk ke sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 p-4 relative selection:bg-blue-600 selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Halaman Publik
        </Link>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/20 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 mb-1">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Login Administrator</h1>
            <p className="text-xs text-slate-500 font-medium">
              Masukkan akun admin untuk mengelola pengumuman.
            </p>
          </div>

          {/* Default Credentials Info Box */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-[11px] text-blue-900 leading-relaxed font-medium">
            <p className="font-bold text-blue-950 mb-0.5">ℹ️ Akun Awal Default:</p>
            <p>Username: <code className="font-bold bg-white px-1.5 py-0.5 rounded border text-blue-800">admin</code></p>
            <p>Password: <code className="font-bold bg-white px-1.5 py-0.5 rounded border text-blue-800">admin</code></p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  name="username"
                  defaultValue="admin"
                  required
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  name="password"
                  defaultValue="admin"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 outline-none text-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition duration-200 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Akses...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Panel Admin</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
