"use client";

import React, { useState } from "react";
import { changeAdminPassword } from "@/actions/auth.actions";
import { showAlert } from "@/lib/alert";
import { KeyRound, ShieldCheck, Eye, EyeOff, Loader2, Save } from "lucide-react";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const confirm = await showAlert.confirm(
      "Konfirmasi Ubah Password",
      "Apakah Anda yakin ingin memperbarui password akun administrator ini?",
      "Ya, Ubah Password"
    );

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const res = await changeAdminPassword(formData);
      if (res.success) {
        showAlert.success(
          "Password Berhasil Diperbarui!",
          res.message || "Gunakan password baru ini untuk sesi login berikutnya."
        );
        form.reset();
      } else {
        showAlert.error(
          "Gagal Mengubah Password",
          res.message || "Pastikan password lama benar dan konfirmasi password cocok."
        );
      }
    } catch {
      showAlert.error("Error", "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
          <KeyRound className="w-4 h-4" />
          Keamanan Akun
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
          Ubah Password Administrator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perbarui kata sandi akun administrator untuk menjaga keamanan portal pengumuman.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-950">
          <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Tips Keamanan Password:</p>
            <p className="text-indigo-800/90 text-xs">Gunakan minimal 4 karakter unik dengan kombinasi huruf dan angka.</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password Saat Ini <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showOld ? "text" : "password"}
                name="oldPassword"
                required
                placeholder="Masukkan password saat ini"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-xs sm:text-sm pr-11 transition"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password Baru <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                placeholder="Minimal 4 karakter"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-xs sm:text-sm pr-11 transition"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ulangi Password Baru <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Ketik ulang password baru Anda"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 outline-none text-xs sm:text-sm pr-11 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md shadow-indigo-600/20 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memperbarui Password...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Perbarui Password Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
