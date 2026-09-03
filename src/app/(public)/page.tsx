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
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-sky-50/60 via-white to-blue-50/50 text-slate-900 relative selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* =========================================================================
          BRIGHT LUXURY LIQUID PASTEL GRADIENT BACKGROUND (CERAH, HIDUP & ELEGAN)
          ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Ambient White/Pastel Base */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-slate-50/60 to-sky-50/50"></div>

        {/* Liquid Orb 1: Sky Blue & Soft Cyan (Top Center-Left) */}
        <div className="absolute -top-24 left-1/4 w-[420px] sm:w-[620px] h-[420px] sm:h-[620px] bg-gradient-to-tr from-sky-400/35 via-blue-300/30 to-cyan-300/25 blur-[90px] sm:blur-[120px] animate-liquid-1"></div>

        {/* Liquid Orb 2: Lavender & Peach Rose (Top Right) */}
        <div className="absolute top-1/4 -right-20 w-[400px] sm:w-[580px] h-[400px] sm:h-[580px] bg-gradient-to-bl from-purple-300/30 via-pink-300/25 to-rose-200/30 blur-[100px] sm:blur-[130px] animate-liquid-2"></div>

        {/* Liquid Orb 3: Mint Emerald & Soft Turquoise (Bottom Left) */}
        <div className="absolute -bottom-28 -left-16 w-[400px] sm:w-[580px] h-[400px] sm:h-[580px] bg-gradient-to-tr from-emerald-300/25 via-teal-200/30 to-sky-300/25 blur-[90px] sm:blur-[120px] animate-liquid-3"></div>

        {/* Liquid Orb 4: Warm Sunlight Pastel Glow (Bottom Right) */}
        <div className="absolute -bottom-20 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tl from-indigo-200/25 via-blue-200/20 to-pink-200/20 blur-[100px] animate-liquid-1"></div>

        {/* Ultra-Subtle Texture Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Sticky Top Header - Frosted Glass Luxury */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl shadow-md shadow-blue-600/20 shrink-0">
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
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-slate-200/90 text-slate-700 bg-white/90 hover:bg-slate-50 active:scale-95 transition-all shadow-xs shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs">Admin</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-1 max-w-4xl mx-auto w-full px-3.5 sm:px-6 py-8 sm:py-14 my-auto space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-2.5 sm:space-y-3 no-print px-1">
          {/* Deep Slate Headline */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-snug sm:leading-tight text-slate-900">
            {setting?.activityName || "Hasil Seleksi Penerimaan 2026"}
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            {setting?.activityDesc || "Masukkan data verifikasi Anda untuk melihat status kelulusan."}
          </p>
        </div>

        {/* Luxury Frosted Glass Card Container with Gentle Aura */}
        <div className="w-full relative">
          {/* Moving Ambient Glow Behind Card */}
          <div className="absolute -inset-1.5 rounded-[2.8rem] bg-gradient-to-r from-blue-400/20 via-purple-300/20 to-pink-300/20 blur-xl opacity-75 pointer-events-none animate-shimmer-flow"></div>

          <div className="relative">
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
        </div>
      </main>

      {/* Modern Bright Luxury Footer */}
      <footer className="relative z-1 w-full border-t border-slate-200/80 py-6 sm:py-8 bg-white/80 backdrop-blur-xl text-center text-[11px] sm:text-xs text-slate-500 no-print px-4">
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
