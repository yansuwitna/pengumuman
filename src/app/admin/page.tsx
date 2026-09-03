import React from "react";
import { getAdminSession } from "@/actions/auth.actions";
import { getAppSettings } from "@/actions/setting.actions";
import { getParticipants } from "@/actions/participant.actions";
import { getValidationFields } from "@/actions/field.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  ListFilter,
  Sliders,
  KeyRound,
  ExternalLink,
  Clock,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Database,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const [setting, participants, validationFields] = await Promise.all([
    getAppSettings(),
    getParticipants(),
    getValidationFields(),
  ]);

  const totalParticipants = participants.length;
  const passedParticipants = participants.filter((p) => p.status === "LULUS").length;
  const failedParticipants = totalParticipants - passedParticipants;
  const passRate = totalParticipants > 0 ? ((passedParticipants / totalParticipants) * 100).toFixed(1) : "0";

  const verificationFieldsCount = validationFields.filter(
    (f) => (f.category || "VALIDATION") === "VALIDATION"
  ).length;
  const displayFieldsCount = validationFields.filter((f) => f.category === "DISPLAY").length;

  const isClosed = setting?.announcementMode === "CLOSED" || !setting?.isAnnouncementOpen;
  const isScheduled = setting?.announcementMode === "SCHEDULED";

  let formattedDate = "-";
  if (setting?.announcementDate) {
    try {
      formattedDate =
        new Date(setting.announcementDate).toLocaleString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB";
    } catch {}
  }

  const recentParticipants = participants.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Dashboard Administrator</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black tracking-tight">
            Selamat Datang, {session.name || session.username}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Kelola portal pengumuman, jadwal rilis kelulusan, konfigurasi kolom dinamis, dan data peserta secara terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 active:scale-95 font-bold text-xs sm:text-sm transition shadow-md shadow-black/10"
          >
            <span>Buka Halaman Publik</span>
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      </div>

      {/* 4 Kartu Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Peserta */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Peserta
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalParticipants}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Orang terdaftar di database</p>
          </div>
        </div>

        {/* 2. Peserta Lulus */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Peserta Lulus
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">{passedParticipants}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {passRate}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Memenuhi syarat kelulusan</p>
          </div>
        </div>

        {/* 3. Peserta Tidak Lulus */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              Tidak Lulus
            </span>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{failedParticipants}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Belum memenuhi kriteria</p>
          </div>
        </div>

        {/* 4. Kolom Terdaftar */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Kolom Aktif
            </span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <ListFilter className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">{validationFields.length}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {verificationFieldsCount} Kunci + {displayFieldsCount} Biodata
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Status Portal & Pintasan Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Portal Saat Ini (2 Kolom di Desktop) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Status & Mode Akses Portal
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isClosed
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : isScheduled
                    ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}
              >
                {isClosed ? "🔴 Sedang Ditutup" : isScheduled ? "⏰ Terjadwal Otomatis" : "🟢 Buka Langsung"}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {setting?.activityName || "Hasil Seleksi Penerimaan 2026"}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {setting?.activityDesc || "Portal pengecekan pengumuman kelulusan resmi."}
              </p>
            </div>

            {/* Jadwal Buka */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Jadwal Resmi Pembukaan
                  </p>
                  <p className="text-xs sm:text-sm font-black text-slate-800">{formattedDate}</p>
                </div>
              </div>
              <Link
                href="/admin/settings"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Ubah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aplikasi: <strong>{setting?.appName}</strong></span>
            <span>Instansi: <strong>{setting?.institutionName}</strong></span>
          </div>
        </div>

        {/* Menu Pintasan Cepat (1 Kolom) */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pintasan Cepat
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/admin/participants"
              className="flex items-center justify-between p-3 rounded-2xl border border-amber-200/80 bg-amber-50/50 hover:bg-amber-100/70 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-600 text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Kelola Peserta</p>
                  <p className="text-[10px] text-slate-500">Tambah & edit kelulusan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/validation-fields"
              className="flex items-center justify-between p-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-100/70 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white">
                  <ListFilter className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Setting Kolom</p>
                  <p className="text-[10px] text-slate-500">Kunci & biodata hasil</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-3 rounded-2xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-100/70 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Nama Kegiatan & Waktu</p>
                  <p className="text-[10px] text-slate-500">Pengaturan jadwal buka</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/backup"
              className="flex items-center justify-between p-3 rounded-2xl border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/70 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-600 text-white">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Backup & Reset Data</p>
                  <p className="text-[10px] text-slate-500">Ekspor, restore & factory reset</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/admin/change-password"
              className="flex items-center justify-between p-3 rounded-2xl border border-indigo-200/80 bg-indigo-50/50 hover:bg-indigo-100/70 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600 text-white">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Ubah Password</p>
                  <p className="text-[10px] text-slate-500">Keamanan akun admin</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Tabel 5 Data Peserta Terbaru */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              5 Data Peserta Terbaru
            </h2>
            <p className="text-[11px] text-slate-400">
              Peserta yang baru saja ditambahkan atau diperbarui
            </p>
          </div>
          <Link
            href="/admin/participants"
            className="text-xs font-bold text-amber-600 hover:text-amber-800 hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Peserta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentParticipants.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Belum ada data peserta yang terdaftar.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-4">Nama Peserta</th>
                  <th className="py-3 px-4">Formasi / Info</th>
                  <th className="py-3 px-4">Nilai</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentParticipants.map((p, idx) => {
                  const isPassed = p.status === "LULUS";
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{p.position || "-"}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{p.score !== null ? p.score : "-"}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-600" />
                          )}
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
