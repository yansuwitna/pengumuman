"use client";

import React, { useEffect, useState } from "react";
import { getAppSettings, updateAppSettings } from "@/actions/setting.actions";
import { showAlert, Toast } from "@/lib/alert";
import { Sliders, Save, Loader2, Calendar, Clock, Sparkles } from "lucide-react";
import { AppSettingType } from "@/types";

export default function SettingsPage() {
  const [setting, setSetting] = useState<AppSettingType | null>(null);
  const [loadingSetting, setLoadingSetting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mode, setMode] = useState<string>("OPEN");

  useEffect(() => {
    async function load() {
      try {
        const s = await getAppSettings();
        if (s) {
          setSetting(s as AppSettingType);
          setMode(s.announcementMode || "OPEN");
        }
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const confirm = await showAlert.confirm(
      "Konfirmasi Simpan Pengaturan",
      "Apakah Anda yakin ingin menyimpan perubahan jadwal waktu buka dan konfigurasi aplikasi ini?",
      "Ya, Simpan Perubahan"
    );

    if (!confirm.isConfirmed) return;

    setLoadingSetting(true);
    try {
      const res = await updateAppSettings(formData);
      if (res.success) {
        showAlert.success(
          "Berhasil Disimpan!",
          "Jadwal pembukaan pengumuman dan identitas aplikasi berhasil diperbarui."
        );
      } else {
        showAlert.error("Gagal Menyimpan", "Terjadi kesalahan saat menyimpan pengaturan.");
      }
    } catch {
      showAlert.error("Error", "Gagal menghubungi server.");
    } finally {
      setLoadingSetting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="py-20 text-center text-slate-500 font-medium">
        Memuat Pengaturan...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          Konfigurasi Identitas & Jadwal
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
          Nama Kegiatan & Jadwal Pembukaan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Atur nama kegiatan, status buka/tutup, serta tanggal dan jam berapa pengumuman akan dibuka secara resmi.
        </p>
      </div>

      <div className="w-full">
        {/* Form Pengaturan Utama - Full Width */}
        <form
          onSubmit={handleSaveSettings}
          className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                Nama Aplikasi <span className="text-rose-500">*</span>
              </label>
              <input
                name="appName"
                defaultValue={setting?.appName || "PORTAL PENGUMUMAN"}
                required
                placeholder="Contoh: PORTAL PENGUMUMAN"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                Nama Kegiatan Seleksi <span className="text-rose-500">*</span>
              </label>
              <input
                name="activityName"
                defaultValue={setting?.activityName || "Hasil Seleksi Penerimaan Calon Pegawai 2026"}
                required
                placeholder="Contoh: Hasil Seleksi Penerimaan Calon Pegawai 2026"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                Deskripsi / Petunjuk untuk Peserta
              </label>
              <textarea
                name="activityDesc"
                rows={2}
                defaultValue={setting?.activityDesc || ""}
                placeholder="Contoh: Masukkan data verifikasi Anda untuk melihat hasil kelulusan..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {/* PENGATURAN STATUS & JADWAL WAKTU BUKA */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Pengaturan Status & Waktu Buka Pengumuman</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status / Mode Akses Publik <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="announcementMode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none transition bg-white font-bold text-slate-800"
                  >
                    <option value="OPEN">🟢 Buka Langsung (Publik Bisa Akses Kapan Saja)</option>
                    <option value="SCHEDULED">⏰ Jadwalkan Sesuai Tanggal & Jam (Otomatis)</option>
                    <option value="CLOSED">🔴 Tutup Pengumuman (Sedang Ditutup / Maintenance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tanggal & Jam Pengumuman Dibuka
                  </label>
                  <input
                    type="datetime-local"
                    name="announcementDate"
                    defaultValue={setting?.announcementDate || ""}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none transition bg-white font-medium text-slate-800"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Informasi tanggal & jam ini akan dimunculkan pada halaman depan pengunjung.
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                Pesan Untuk Peserta LULUS
              </label>
              <textarea
                name="passedMessage"
                rows={3}
                defaultValue={setting?.passedMessage || "Selamat! Anda dinyatakan LULUS seleksi."}
                className="w-full px-4 py-3 rounded-xl border border-emerald-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 outline-none transition bg-emerald-50/30 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                Pesan Untuk Peserta TIDAK LULUS
              </label>
              <textarea
                name="failedMessage"
                rows={3}
                defaultValue={setting?.failedMessage || "Mohon maaf, Anda belum memenuhi kualifikasi pada tahap ini. Tetap semangat!"}
                className="w-full px-4 py-3 rounded-xl border border-rose-300 text-xs sm:text-sm focus:ring-2 focus:ring-rose-600 outline-none transition bg-rose-50/30 font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 sm:mb-2">
                Informasi Kontak / Helpdesk Panitia
              </label>
              <input
                name="contactInfo"
                defaultValue={setting?.contactInfo || ""}
                placeholder="Contoh: Email: helpdesk@instansi.go.id | WA: 0812-3456-7890"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 outline-none transition"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loadingSetting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md shadow-blue-600/20 disabled:opacity-70 cursor-pointer"
            >
              {loadingSetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Pengaturan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Pengaturan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
