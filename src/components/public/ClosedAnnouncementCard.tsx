"use client";

import React, { useState, useEffect } from "react";
import { AppSettingType } from "@/types";
import { Clock, Lock, ShieldAlert, Calendar, Mail, Phone, AlertCircle } from "lucide-react";

export default function ClosedAnnouncementCard({
  setting,
  onTimeReached,
}: {
  setting: AppSettingType | null;
  onTimeReached: () => void;
}) {
  const isClosed = setting?.announcementMode === "CLOSED" || !setting?.isAnnouncementOpen;
  const isScheduled = setting?.announcementMode === "SCHEDULED" && setting?.announcementDate;

  // State untuk Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    if (!isScheduled || !setting?.announcementDate) return;

    const targetTime = new Date(setting.announcementDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        onTimeReached();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [setting?.announcementDate, isScheduled, onTimeReached]);

  // Format Tanggal Buka
  let formattedOpenDate = "";
  if (setting?.announcementDate) {
    try {
      formattedOpenDate =
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

  return (
    <div className="relative w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-10 rounded-3xl shadow-2xl shadow-blue-950/10 border border-slate-200/90 text-center space-y-6">
        {/* Icon & Status Banner */}
        <div className="flex flex-col items-center">
          <div
            className={`p-4 rounded-3xl mb-4 shadow-inner ${
              isClosed
                ? "bg-rose-100/80 text-rose-600 border border-rose-200"
                : "bg-blue-100/80 text-blue-600 border border-blue-200 animate-pulse"
            }`}
          >
            {isClosed ? <Lock className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>

          <span
            className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
              isClosed
                ? "bg-rose-100 text-rose-800 border border-rose-300"
                : "bg-blue-100 text-blue-800 border border-blue-300"
            }`}
          >
            {isClosed ? "Pengumuman Ditutup" : "Jadwal Belum Dibuka"}
          </span>

          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {isClosed ? "Pengumuman Saat Ini Ditutup" : "Pengumuman Belum Waktunya Dibuka"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed font-medium">
            {isClosed
              ? "Akses pengecekan pengumuman saat ini sedang ditutup atau dalam proses pemeliharaan oleh panitia."
              : "Formulir input data akan otomatis muncul dan dapat diakses saat waktu pembukaan tiba."}
          </p>
        </div>

        {/* Live Countdown Timer Jika Mode SCHEDULED */}
        {isScheduled && formattedOpenDate && !timeLeft.isPast && (
          <div className="space-y-4">
            {/* Target Date Highlight */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Jadwal Resmi Pembukaan:
              </span>
              <p className="font-black text-slate-900 text-sm sm:text-base">{formattedOpenDate}</p>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto">
              <div className="bg-gradient-to-b from-blue-50 to-indigo-50/60 p-3 sm:p-4 rounded-2xl border border-blue-100 shadow-xs">
                <span className="text-xl sm:text-3xl font-black text-blue-700 block font-mono">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hari
                </span>
              </div>

              <div className="bg-gradient-to-b from-blue-50 to-indigo-50/60 p-3 sm:p-4 rounded-2xl border border-blue-100 shadow-xs">
                <span className="text-xl sm:text-3xl font-black text-blue-700 block font-mono">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Jam
                </span>
              </div>

              <div className="bg-gradient-to-b from-blue-50 to-indigo-50/60 p-3 sm:p-4 rounded-2xl border border-blue-100 shadow-xs">
                <span className="text-xl sm:text-3xl font-black text-blue-700 block font-mono">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Menit
                </span>
              </div>

              <div className="bg-gradient-to-b from-blue-50 to-indigo-50/60 p-3 sm:p-4 rounded-2xl border border-blue-100 shadow-xs">
                <span className="text-xl sm:text-3xl font-black text-blue-700 block font-mono">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Detik
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Helpdesk Box */}
        {setting?.contactInfo && (
          <div className="pt-3 border-t border-slate-100 text-[11px] sm:text-xs text-slate-500 font-medium">
            <p className="text-slate-400 mb-0.5">Informasi Pertanyaan & Bantuan:</p>
            <p className="font-semibold text-slate-700">{setting.contactInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
