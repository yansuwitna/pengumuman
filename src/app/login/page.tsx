"use client";

import React, { useState } from "react";
import { loginAdmin } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await loginAdmin(formData);
      if (res.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg(res.message || "Username atau password salah.");
      }
    } catch {
      setErrorMsg("Terjadi kendala saat login. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animate-moving-bg flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-blue-600 selection:text-white font-sans">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/90 p-6 sm:p-9 md:p-10 rounded-[2.2rem] shadow-2xl shadow-blue-950/5 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header Bersih & Cerah */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-600/25 mb-1">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Masuk untuk mengelola data kegiatan, peserta, dan kolom validasi.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Username
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                name="username"
                required
                placeholder="Masukkan username admin"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Masukkan password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Masuk ke Panel Admin</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Pengumuman</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
