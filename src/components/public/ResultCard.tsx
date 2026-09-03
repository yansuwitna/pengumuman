"use client";

import React from "react";
import { SearchResultType } from "@/types";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  Award,
  Calendar,
  Building2,
  QrCode,
  ShieldCheck,
  Sparkles,
  User,
  Info,
} from "lucide-react";

export default function ResultCard({
  result,
  onReset,
}: {
  result: SearchResultType;
  onReset: () => void;
}) {
  if (!result.data) return null;

  const isPassed = result.data.status === "LULUS";

  return (
    <div className="relative w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-200/90 overflow-hidden print-card">
        {/* Top Header Banner */}
        <div
          className={`p-6 sm:p-8 md:p-10 text-center text-white relative overflow-hidden ${
            isPassed
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700"
              : "bg-gradient-to-br from-slate-700 via-slate-800 to-indigo-900"
          }`}
        >
          {/* Subtle Background Ornaments */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 sm:w-44 h-36 sm:h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 sm:w-44 h-36 sm:h-44 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Status Icon */}
            <div className="mb-3">
              {isPassed ? (
                <div className="p-3.5 sm:p-4 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/30 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20">
                  <XCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              )}
            </div>

            {/* Activity Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-2 max-w-full truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span className="truncate">{result.data.activityName}</span>
            </div>

            {/* Title Header */}
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight leading-tight px-2">
              {isPassed ? "SELAMAT! ANDA DINYATAKAN LULUS" : "KEPUTUSAN: TIDAK LULUS"}
            </h2>

            {/* Message */}
            <p className="text-white/95 text-xs sm:text-sm md:text-base mt-2 max-w-xl mx-auto leading-relaxed font-medium px-2">
              {isPassed ? result.data.passedMessage : result.data.failedMessage}
            </p>
          </div>
        </div>

        {/* Certificate Body & Details */}
        <div className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          {/* Certificate Table Container */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-3.5 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" />
                Nama Lengkap Peserta
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900">{result.data.name}</span>
            </div>

            {result.data.position && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-1">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  Formasi / Posisi
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{result.data.position}</span>
              </div>
            )}

            {/* RENDER SEMUA KOLOM INFORMASI TAMBAHAN / BIODATA SECARA DINAMIS */}
            {result.data.displayDetails?.map((detail) => (
              <div
                key={detail.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-1"
              >
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  {detail.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{detail.value}</span>
              </div>
            ))}

            {result.data.score !== null && result.data.score !== undefined && (
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-600" />
                  Nilai Akhir
                </span>
                <span className="text-sm sm:text-base font-black text-blue-700 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-200">
                  {result.data.score}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                Status Keputusan
              </span>
              <span
                className={`px-3 sm:px-4 py-1 rounded-full text-xs font-black tracking-widest ${
                  isPassed
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"
                }`}
              >
                {result.data.status}
              </span>
            </div>
          </div>

          {/* Follow-up Notes Box */}
          {result.data.notes && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 text-xs sm:text-sm space-y-1 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Petunjuk / Jadwal Tahap Selanjutnya:</span>
              </div>
              <p className="leading-relaxed pl-6 text-slate-700 font-medium">{result.data.notes}</p>
            </div>
          )}

          {/* Verification Watermark / QR Area */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-slate-800" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">Verifikasi Dokumen Resmi</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">Diterbitkan sah oleh Panitia Seleksi.</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                VALID & SAH
              </p>
            </div>
          </div>

          {result.data.contactInfo && (
            <p className="text-[11px] sm:text-xs text-center text-slate-500 font-medium pt-1">
              {result.data.contactInfo}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 no-print">
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.98] font-bold text-slate-700 text-sm shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              Cetak / Simpan Bukti (PDF)
            </button>
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-slate-900/20 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Periksa Peserta Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
