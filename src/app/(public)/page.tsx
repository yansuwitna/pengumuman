"use client";

import React, { useEffect, useState, useCallback } from "react";
import DynamicSearchForm from "@/components/public/DynamicSearchForm";
import ResultCard from "@/components/public/ResultCard";
import ClosedAnnouncementCard from "@/components/public/ClosedAnnouncementCard";
import { getAppSettings } from "@/actions/setting.actions";
import { getPublicVerificationFields } from "@/actions/field.actions";
import { AppSettingType, ValidationFieldType, SearchResultType } from "@/types";
import {
  Award,
  ShieldCheck,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function PublicPage() {
  const [setting, setSetting] = useState<AppSettingType | null>(null);
  const [fields, setFields] = useState<ValidationFieldType[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResultType | null>(null);
  const [loading, setLoading] = useState(true);
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  const loadData = useCallback(async () => {
    try {
      const [s, f] = await Promise.all([getAppSettings(), getPublicVerificationFields()]);
      if (s) setSetting(s as AppSettingType);
      setFields(f as ValidationFieldType[]);
      setNowTimestamp(Date.now());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3 px-4">
        <div className="w-9 h-9 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600">Memuat Sistem Pengumuman...</p>
      </div>
    );
  }

  // Evaluasi Apakah Pengumuman Boleh Diakses Saat Ini
  const isClosedExplicitly = setting?.announcementMode === "CLOSED" || !setting?.isAnnouncementOpen;
  let isScheduledNotYet = false;

  if (setting?.announcementMode === "SCHEDULED" && setting?.announcementDate) {
    const targetTime = new Date(setting.announcementDate).getTime();
    if (nowTimestamp < targetTime) {
      isScheduledNotYet = true;
    }
  }

  const isAccessible = !isClosedExplicitly && !isScheduledNotYet;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-blue-50/70 via-slate-50 to-indigo-50/40 text-slate-900 relative selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Gradient Blobs & Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-blue-300/20 blur-[80px] sm:blur-[100px]"></div>
        <div className="absolute top-1/3 -right-20 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-indigo-300/20 blur-[90px] sm:blur-[110px]"></div>
        <div className="absolute -bottom-20 -left-16 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-sky-300/20 blur-[80px] sm:blur-[100px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] sm:bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
      </div>

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl shadow-md shadow-blue-600/20 shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-base font-black text-slate-900 tracking-tight leading-tight truncate">
                {setting?.appName || "PORTAL PENGUMUMAN"}
              </h1>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAccessible ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  } shrink-0`}
                ></span>
                <span className="truncate">
                  {isAccessible ? "Pengumuman Resmi & Terverifikasi" : "Portal Terjadwal / Ditutup"}
                </span>
              </span>
            </div>
          </div>

          <Link
            href="/admin/settings"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all shadow-xs shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs">Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-1 max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-6 sm:py-12 my-auto space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-2.5 sm:space-y-3.5 no-print px-1">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
            {setting?.activityName || "Hasil Seleksi Penerimaan 2026"}
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {setting?.activityDesc || "Masukkan data verifikasi Anda untuk melihat status kelulusan."}
          </p>
        </div>

        {/* LOGIKA KONDISIONAL FORM: TAMPILKAN ATAU SEMBUNYIKAN FORM */}
        <div className="w-full">
          {!isAccessible ? (
            /* Jika Ditutup atau Belum Waktunya -> Sembunyikan Form & Tampilkan Card Informasi */
            <ClosedAnnouncementCard
              setting={setting}
              onTimeReached={() => {
                setNowTimestamp(Date.now());
                loadData();
              }}
            />
          ) : searchResult?.success ? (
            /* Jika Berhasil Cek Hasil -> Tampilkan Kartu Sertifikat Kelulusan */
            <ResultCard result={searchResult} onReset={() => setSearchResult(null)} />
          ) : (
            /* Jika Pengumuman Dibuka -> Tampilkan Formulir Pencarian */
            <DynamicSearchForm
              fields={fields}
              setting={setting}
              onResult={(res) => setSearchResult(res)}
            />
          )}
        </div>
      </main>

      {/* Modern Bright Footer */}
      <footer className="relative z-1 w-full border-t border-slate-200/80 py-6 sm:py-8 bg-white/80 backdrop-blur-lg text-center text-[11px] sm:text-xs text-slate-500 no-print px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sistem Terverifikasi & Dilindungi Enkripsi</span>
          </div>
          <p className="font-medium">&copy; 2026 {setting?.appName || "PORTAL PENGUMUMAN"}. Semua Hak Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
