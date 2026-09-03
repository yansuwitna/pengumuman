"use client";

import React, { useState, useRef, useEffect } from "react";
import { ValidationFieldType, SearchResultType, AppSettingType } from "@/types";
import { verifyParticipantResults } from "@/actions/search.actions";
import { showAlert } from "@/lib/alert";
import {
  Search,
  Loader2,
  Lock,
  Calendar,
  Hash,
  FileText,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";

export default function DynamicSearchForm({
  fields,
  setting,
  onResult,
}: {
  fields: ValidationFieldType[];
  setting: AppSettingType | null;
  onResult: (result: SearchResultType) => void;
}) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emptyFieldKeys, setEmptyFieldKeys] = useState<string[]>([]);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errorMsg) setErrorMsg(null);
    if (emptyFieldKeys.includes(key)) {
      setEmptyFieldKeys((prev) => prev.filter((k) => k !== key));
    }
  };

  // Format tanggal & jam buka pengumuman
  let formattedOpenTime = "";
  if (setting?.announcementDate) {
    try {
      formattedOpenTime = new Date(setting.announcementDate).toLocaleString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";
    } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validasi: Cek seluruh kolom wajib yang masih kosong
    const unfulfilledFields: ValidationFieldType[] = [];
    for (const field of fields) {
      const val = formData[field.fieldKey];
      if (field.isRequired && (!val || val.trim() === "")) {
        unfulfilledFields.push(field);
      }
    }

    // 2. Jika ada input yang belum diisi, berikan informasi lengkap
    if (unfulfilledFields.length > 0) {
      const missingKeys = unfulfilledFields.map((f) => f.fieldKey);
      setEmptyFieldKeys(missingKeys);

      const fieldNames = unfulfilledFields.map((f) => f.label).join(" dan ");
      const message = `Silakan isi ${fieldNames} terlebih dahulu untuk dapat melihat hasil pengumuman.`;
      
      setErrorMsg(message);

      // Tampilkan notifikasi dialog SweetAlert2 informatif
      showAlert.error(
        "Kolom Belum Diisi!",
        `Anda belum mengisi data pada kolom: ${fieldNames}. Mohon lengkapi data tersebut.`
      );

      // Fokuskan kursor otomatis ke input pertama yang kosong
      const firstMissing = unfulfilledFields[0];
      if (inputRefs.current[firstMissing.fieldKey]) {
        inputRefs.current[firstMissing.fieldKey]?.focus();
      }
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setEmptyFieldKeys([]);

    try {
      const res = await verifyParticipantResults(formData);
      onResult(res);
      if (!res.success && res.message) {
        setErrorMsg(res.message);
        showAlert.error("Pemberitahuan", res.message);
      }
    } catch {
      const err = "Terjadi kendala saat memvalidasi data. Silakan coba kembali.";
      setErrorMsg(err);
      showAlert.error("Error Sistem", err);
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (field: ValidationFieldType) => {
    if (field.fieldType === "date" || field.fieldKey.includes("tgl") || field.fieldKey.includes("birth")) {
      return <Calendar className="w-4 h-4 text-indigo-600" />;
    }
    if (field.fieldType === "password" || field.fieldKey.includes("pin") || field.fieldKey.includes("pass")) {
      return <KeyRound className="w-4 h-4 text-amber-600" />;
    }
    if (field.fieldType === "number" || field.fieldKey.includes("nik") || field.fieldKey.includes("nis") || field.fieldKey.includes("no")) {
      return <Hash className="w-4 h-4 text-blue-600" />;
    }
    return <FileText className="w-4 h-4 text-emerald-600" />;
  };

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white/90 backdrop-blur-2xl p-6 sm:p-9 md:p-11 rounded-[2.2rem] shadow-2xl shadow-blue-950/5 border border-white/90 space-y-5 sm:space-y-6"
      >
        {/* Header Form Bersih & Jelas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 sm:pb-5 gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              Masukkan NISN dan NIS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
              Silakan lengkapi data di bawah ini untuk melihat hasil pengumuman Anda.
            </p>
          </div>
          <div className="flex p-2.5 sm:p-3 bg-blue-50 rounded-2xl border border-blue-100/80 text-blue-600 shrink-0 self-start sm:self-center">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Informasi Waktu & Tanggal Buka Pengumuman */}
        {formattedOpenTime && (
          <div className="flex items-center gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-950 text-xs sm:text-sm font-medium">
            <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="leading-snug min-w-0">
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-700 block">
                Jadwal Buka Pengumuman:
              </span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                {formattedOpenTime}
              </span>
            </div>
          </div>
        )}

        {/* Kotak Informasi Peringatan Jika Ada Kolom Belum Terisi */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-900 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-300 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-rose-950">Informasi Pengisian:</p>
              <p className="leading-relaxed font-medium text-rose-800">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Dynamic Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {fields.map((field) => {
            const isMissing = emptyFieldKeys.includes(field.fieldKey);

            return (
              <div key={field.id} className={fields.length === 1 ? "md:col-span-2" : ""}>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {field.label} {field.isRequired && <span className="text-rose-500">*</span>}
                  </label>
                  {isMissing && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md animate-pulse">
                      Wajib Diisi!
                    </span>
                  )}
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 sm:left-4 pointer-events-none">
                    {getFieldIcon(field)}
                  </div>
                  <input
                    ref={(el) => {
                      inputRefs.current[field.fieldKey] = el;
                    }}
                    type={
                      field.fieldType === "password"
                        ? "password"
                        : field.fieldType === "date"
                        ? "date"
                        : field.fieldType === "number"
                        ? "number"
                        : "text"
                    }
                    placeholder={field.placeholder || `Masukkan ${field.label}`}
                    value={formData[field.fieldKey] || ""}
                    onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                    className={`w-full pl-10 sm:pl-11 pr-3.5 sm:pr-4 py-3 sm:py-3.5 rounded-2xl border text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:outline-none transition duration-200 ${
                      isMissing
                        ? "border-rose-400 bg-rose-50/50 ring-2 ring-rose-500/30"
                        : "border-slate-200 bg-slate-50/50 focus:ring-3 focus:ring-blue-600/20 focus:border-blue-600"
                    }`}
                  />
                </div>

                {isMissing ? (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1 pl-1 flex items-center gap-1">
                    <Info className="w-3 h-3 text-rose-500" />
                    Kolom {field.label} belum diisi.
                  </p>
                ) : (
                  field.placeholder && (
                    <p className="text-[10px] text-slate-400 mt-1 pl-1">
                      {field.placeholder}
                    </p>
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50/90 px-3.5 py-2.5 rounded-xl border border-slate-100 font-medium">
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="leading-tight">Data verifikasi Anda diproses secara aman langsung ke sistem.</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 active:scale-[0.98] text-white font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 transition-all duration-200 disabled:opacity-70 text-sm sm:text-base cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>Memvalidasi Data...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Periksa Hasil Pengumuman</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
