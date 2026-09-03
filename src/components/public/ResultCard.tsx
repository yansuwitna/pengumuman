"use client";

import React, { useRef, useState } from "react";
import { SearchResultType } from "@/types";
import { toPng } from "html-to-image";
import { showAlert, Toast } from "@/lib/alert";
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
  AlertCircle,
  Download,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

export default function ResultCard({
  result,
  onReset,
}: {
  result: SearchResultType;
  onReset: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!result.data) return null;

  const isPassed = result.data.status === "LULUS";

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    setDownloading(true);
    try {
      // Generate High-Resolution Image (Pixel Ratio 2x for sharp print quality)
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        filter: (node) => {
          // Jangan sertakan elemen yang bertanda no-export jika ada
          if (node instanceof HTMLElement && node.classList.contains("no-export")) {
            return false;
          }
          return true;
        },
      });

      // Buat elemen link download otomatis
      const cleanName = (result.data?.name || "Peserta").replace(/[^a-zA-Z0-9]/g, "_");
      const link = document.createElement("a");
      link.download = `Bukti_Pengumuman_${cleanName}.png`;
      link.href = dataUrl;
      link.click();

      Toast.fire({
        icon: "success",
        title: "Gambar Bukti Berhasil Diunduh!",
      });
    } catch (err) {
      console.error("Gagal men-generate gambar:", err);
      showAlert.error("Gagal Menyimpan Gambar", "Silakan coba kembali atau gunakan tombol Cetak.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative w-full animate-in fade-in zoom-in-95 duration-500">
      {/* Kartu Hasil Kelulusan yang akan diconvert ke Gambar */}
      <div
        ref={cardRef}
        className={`relative bg-white rounded-[2.2rem] shadow-2xl overflow-hidden print-card border ${
          isPassed
            ? "shadow-emerald-900/10 border-emerald-200/90"
            : "shadow-rose-900/10 border-rose-200/90"
        }`}
      >
        {/* Top Header Banner: Hijau jika Lulus, Merah jika Tidak Lulus */}
        <div
          className={`p-6 sm:p-8 md:p-10 text-center text-white relative overflow-hidden ${
            isPassed
              ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700"
              : "bg-gradient-to-br from-rose-600 via-red-600 to-rose-700"
          }`}
        >
          {/* Subtle Background Ornaments */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 sm:w-48 h-36 sm:h-48 bg-white/15 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 sm:w-48 h-36 sm:h-48 bg-black/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Status Icon */}
            <div className="mb-3">
              {isPassed ? (
                <div className="p-3.5 sm:p-4 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/30 shadow-inner">
                  <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              ) : (
                <div className="p-3.5 sm:p-4 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/30 shadow-inner">
                  <XCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
              )}
            </div>

            {/* Activity Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-2 max-w-full truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">{result.data.activityName}</span>
            </div>

            {/* Title Header */}
            <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight leading-tight px-2">
              {isPassed ? "SELAMAT! ANDA DINYATAKAN LULUS" : "MOHON MAAF, ANDA TIDAK LULUS"}
            </h2>

            {/* Message */}
            <p className="text-white/95 text-xs sm:text-sm md:text-base mt-2 max-w-xl mx-auto leading-relaxed font-medium px-2">
              {isPassed ? result.data.passedMessage : result.data.failedMessage}
            </p>
          </div>
        </div>

        {/* Certificate Body & Details */}
        <div className="p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          {/* Certificate Table Container: Nuansa Hijau atau Merah Lembut */}
          <div
            className={`rounded-2xl p-4 sm:p-6 border space-y-3.5 sm:space-y-4 ${
              isPassed
                ? "bg-emerald-50/40 border-emerald-100"
                : "bg-rose-50/40 border-rose-100"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-3 gap-1">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" />
                Nama Lengkap Peserta
              </span>
              <span className="text-sm sm:text-base font-black text-slate-900">{result.data.name}</span>
            </div>

            {result.data.position && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-3 gap-1">
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
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 pb-3 gap-1"
              >
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  {detail.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">{detail.value}</span>
              </div>
            ))}

            {result.data.score !== null && result.data.score !== undefined && (
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-600" />
                  Nilai Akhir
                </span>
                <span
                  className={`text-sm sm:text-base font-black px-3 py-0.5 rounded-lg border ${
                    isPassed
                      ? "text-emerald-800 bg-emerald-100/80 border-emerald-200"
                      : "text-rose-800 bg-rose-100/80 border-rose-200"
                  }`}
                >
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
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${
                  isPassed
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                }`}
              >
                {result.data.status}
              </span>
            </div>
          </div>

          {/* Follow-up Notes Box */}
          {result.data.notes && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-1 shadow-xs ${
                isPassed
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
                  : "bg-rose-50/60 border-rose-200 text-rose-950"
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {isPassed ? (
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>Petunjuk / Catatan Panitia:</span>
              </div>
              <p className="leading-relaxed pl-6 text-slate-700 font-medium">{result.data.notes}</p>
            </div>
          )}

          {/* Verification Watermark / QR Area */}
          <div
            className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border text-xs text-slate-600 gap-3 ${
              isPassed ? "bg-emerald-50/30 border-emerald-200" : "bg-rose-50/30 border-rose-200"
            }`}
          >
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
              <p
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isPassed
                    ? "text-emerald-700 bg-emerald-100 border-emerald-300"
                    : "text-rose-700 bg-rose-100 border-rose-300"
                }`}
              >
                VALID & SAH
              </p>
            </div>
          </div>

          {result.data.contactInfo && (
            <p className="text-[11px] sm:text-xs text-center text-slate-500 font-medium pt-1">
              {result.data.contactInfo}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons (Di luar Card yang di-export agar gambar bersih) */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 no-print">
        {/* Tombol Simpan Gambar PNG */}
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl active:scale-[0.98] text-white font-bold text-sm shadow-md transition cursor-pointer disabled:opacity-75 ${
            isPassed
              ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
              : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
          }`}
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan Gambar...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Simpan Gambar Bukti (PNG)</span>
            </>
          )}
        </button>

        {/* Tombol Cetak / PDF */}
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 active:scale-[0.98] font-bold text-slate-700 text-sm shadow-xs transition cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4 text-blue-600" />
          <span>Cetak (Print)</span>
        </button>

        {/* Tombol Periksa Lain */}
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-slate-900/20 transition cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Cek Lainnya</span>
        </button>
      </div>
    </div>
  );
}
