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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 gap-3 px-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600">Memuat Portal Pengumuman...</p>
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
    <div className="min-h-screen flex flex-col justify-between animate-moving-bg text-slate-900 relative selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md shadow-blue-600/20 shrink-0">
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
            href="/admin"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all shadow-xs shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs">Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-8 sm:py-14 my-auto space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-2.5 sm:space-y-3 no-print px-1">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug sm:leading-tight text-slate-900">
            {setting?.activityName || "Hasil Seleksi Penerimaan 2026"}
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {setting?.activityDesc || "Masukkan data verifikasi Anda untuk melihat status kelulusan."}
          </p>
        </div>

        {/* Konten Utama: Form Pencarian atau Kartu Hasil */}
        <div className="w-full">
          {!isAccessible ? (
            /* Jika Ditutup atau Belum Waktunya -> Tampilkan Card Informasi / Countdown */
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
      <footer className="w-full border-t border-slate-200/80 py-6 sm:py-8 bg-white/90 backdrop-blur-md text-center text-[11px] sm:text-xs text-slate-500 no-print px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Sistem Terverifikasi & Dilindungi Enkripsi Resmi</span>
          </div>
          <p className="font-medium">&copy; 2026 {setting?.appName || "PORTAL PENGUMUMAN"}. Semua Hak Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
