"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  getParticipants,
  createParticipant,
  deleteParticipant,
  importParticipants,
} from "@/actions/participant.actions";
import { getValidationFields } from "@/actions/field.actions";
import { showAlert, Toast } from "@/lib/alert";
import {
  Users,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Search,
  KeyRound,
  FileText,
  Sliders,
} from "lucide-react";
import Link from "next/link";
import { ValidationFieldType } from "@/types";
import * as XLSX from "xlsx";

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [validationFields, setValidationFields] = useState<ValidationFieldType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [p, f] = await Promise.all([getParticipants(), getValidationFields()]);
      setParticipants(p);
      setValidationFields(f as ValidationFieldType[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const status = formData.get("status") as string;

    const valDataObj: Record<string, string> = {};
    for (const field of validationFields) {
      const val = (formData.get(`val_${field.fieldKey}`) as string) || "";
      valDataObj[field.fieldKey] = val;
    }
    formData.set("validationData", JSON.stringify(valDataObj));

    // Ambil nama peserta dari field yang ada
    const previewName =
      valDataObj.nama ||
      valDataObj.name ||
      valDataObj.nama_lengkap ||
      Object.values(valDataObj)[0] ||
      "Peserta";

    const confirm = await showAlert.confirm(
      "Konfirmasi Simpan Peserta",
      `Apakah Anda yakin ingin menyimpan data peserta '${previewName}' dengan status '${status}'?`,
      "Ya, Simpan Peserta"
    );

    if (!confirm.isConfirmed) return;

    setSubmitting(true);
    try {
      const res = await createParticipant(formData);
      if (res.success) {
        showAlert.success("Berhasil Disimpan!", `Data peserta '${previewName}' berhasil disimpan ke database.`);
        form.reset();
        setIsModalOpen(false);
        await fetchData();
      } else {
        showAlert.error("Gagal Menyimpan", "Periksa kembali data peserta.");
      }
    } catch {
      showAlert.error("Error", "Gagal menghubungi server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteParticipant = async (id: string, name: string) => {
    const confirm = await showAlert.confirm(
      "Hapus Data Peserta?",
      `Data hasil seleksi atas nama '${name}' akan dihapus permanen. Apakah Anda yakin?`,
      "Ya, Hapus Data"
    );

    if (confirm.isConfirmed) {
      try {
        const res = await deleteParticipant(id);
        if (res.success) {
          Toast.fire({
            icon: "success",
            title: "Data Peserta Berhasil Dihapus!",
          });
          await fetchData();
        }
      } catch {
        showAlert.error("Error", "Gagal menghapus data peserta.");
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          showAlert.error("File Kosong", "File Excel tidak memiliki data peserta.");
          setImporting(false);
          return;
        }

        const confirm = await showAlert.confirm(
          "Konfirmasi Impor Data",
          `Ditemukan ${data.length} baris data peserta. Apakah Anda yakin ingin mengimpor seluruh data ini ke SQLite?`,
          "Ya, Impor Sekarang"
        );

        if (confirm.isConfirmed) {
          const res = await importParticipants(data);
          if (res.success) {
            showAlert.success("Impor Berhasil!", `Berhasil menambahkan ${res.count} data peserta ke sistem.`);
            await fetchData();
          }
        }
      } catch {
        showAlert.error("Gagal Membaca Excel", "Pastikan format file Excel sesuai dengan template.");
      } finally {
        setImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsBinaryString(file);
  };

  const filteredParticipants = participants.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchName = p.name?.toLowerCase().includes(query);
    const matchPos = p.position?.toLowerCase().includes(query);
    const matchVal = p.validationData?.toLowerCase().includes(query);
    return matchName || matchPos || matchVal;
  });

  const verificationFields = validationFields.filter((f) => (f.category || "VALIDATION") === "VALIDATION");
  const displayFields = validationFields.filter((f) => f.category === "DISPLAY");

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Header & Quick Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            Manajemen Data
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
            Data Peserta & Kelulusan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seluruh kolom data peserta di bawah ini murni mengikuti konfigurasi yang terdaftar di Pengaturan Kolom.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-amber-600/20 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Peserta</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 disabled:opacity-70 cursor-pointer shrink-0"
          >
            {importing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>Impor Excel</span>
          </button>

          <Link
            href="/api/template-excel"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 text-xs sm:text-sm font-bold transition shadow-xs shrink-0"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Unduh Template Excel</span>
          </Link>
        </div>
      </div>

      {/* Tabel Data Peserta yang 100% Mengikuti Setting Kolom */}
      <div className="w-full bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Daftar Peserta Terdaftar ({participants.length} Orang)
            </h2>
            <p className="text-[11px] text-slate-400">
              Menampilkan {validationFields.length} kolom sesuai daftar pada menu Setting Kolom.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari data peserta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            <span>Memuat data peserta...</span>
          </div>
        ) : filteredParticipants.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs sm:text-sm flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <p className="font-semibold text-slate-600">
              {searchQuery ? "Data peserta yang dicari tidak ditemukan." : "Belum ada data peserta yang terdaftar."}
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Gunakan tombol <strong>&ldquo;Tambah Peserta&rdquo;</strong> atau <strong>&ldquo;Impor Excel&rdquo;</strong> di atas untuk memasukkan data.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600 min-w-[700px]">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] sm:text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-3 whitespace-nowrap font-bold text-center w-12">No</th>
                  
                  {/* HEADER TABEL DINAMIS MURNI MENGIKUTI DAFTAR SETTING KOLOM */}
                  {validationFields.map((field) => (
                    <th key={field.id} className="py-3.5 px-4 whitespace-nowrap font-bold">
                      <div className="flex items-center gap-1.5">
                        <span>{field.label}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${field.category === "VALIDATION" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}>
                          {field.category === "VALIDATION" ? "Kunci" : "Info"}
                        </span>
                      </div>
                    </th>
                  ))}

                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Nilai</th>
                  <th className="py-3.5 px-4 whitespace-nowrap font-bold">Status Hasil</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParticipants.map((p, idx) => {
                  const isPassed = p.status === "LULUS";
                  let valJson: Record<string, any> = {};
                  try {
                    valJson = JSON.parse(p.validationData || "{}");
                  } catch {}

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-3 text-center text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>

                      {/* DATA TABEL DINAMIS MURNI DARI SETTING KOLOM */}
                      {validationFields.map((field) => {
                        const cellValue =
                          valJson[field.fieldKey] !== undefined
                            ? valJson[field.fieldKey]
                            : field.fieldKey === "nama" || field.fieldKey === "name"
                            ? p.name
                            : field.fieldKey === "formasi" || field.fieldKey === "position"
                            ? p.position
                            : null;

                        return (
                          <td key={field.id} className="py-4 px-4 text-xs sm:text-sm text-slate-800 whitespace-nowrap">
                            {cellValue !== null && cellValue !== "" && cellValue !== undefined ? (
                              <span className="font-semibold">{String(cellValue)}</span>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-4 px-4 font-bold text-blue-600 text-sm whitespace-nowrap">
                        {p.score !== null ? p.score : "-"}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          )}
                          {p.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteParticipant(p.id, p.name)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          title="Hapus Data Peserta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL POP-UP TAMBAH PESERTA MANUAL (MURNI MENGIKUTI SETTING KOLOM) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Tambah Peserta Baru</h2>
                  <p className="text-xs text-slate-500">Lengkapi kolom data sesuai konfigurasi aktif</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/70 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Input Modal - Murni Dinamis dari validationFields */}
            <form onSubmit={handleAddParticipant} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm overflow-y-auto">
              {validationFields.length === 0 ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                  Belum ada kolom yang didaftarkan pada menu Pengaturan Kolom. Silakan tambahkan kolom terlebih dahulu.
                </div>
              ) : (
                <>
                  {/* Kelompok Kolom Kunci Verifikasi */}
                  {verificationFields.length > 0 && (
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                      <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                        Kunci Verifikasi (Input Cek Depan)
                      </span>
                      {verificationFields.map((f) => (
                        <div key={f.id}>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {f.label} ({f.fieldKey}) {f.isRequired && <span className="text-rose-500">*</span>}
                          </label>
                          <input
                            name={`val_${f.fieldKey}`}
                            required={f.isRequired}
                            type={f.fieldType === "date" ? "date" : f.fieldType === "number" ? "number" : "text"}
                            placeholder={f.placeholder || `Isi ${f.label}`}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kelompok Kolom Biodata / Informasi Tambahan */}
                  {displayFields.length > 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        Biodata / Informasi Tambahan (Tampil di Hasil)
                      </span>
                      {displayFields.map((f) => (
                        <div key={f.id}>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {f.label} ({f.fieldKey}) {f.isRequired && <span className="text-rose-500">*</span>}
                          </label>
                          <input
                            name={`val_${f.fieldKey}`}
                            required={f.isRequired}
                            type={f.fieldType === "date" ? "date" : f.fieldType === "number" ? "number" : "text"}
                            placeholder={f.placeholder || `Isi ${f.label}`}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Status Kelulusan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="status"
                    defaultValue="LULUS"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-xs sm:text-sm bg-white font-bold"
                  >
                    <option value="LULUS" className="text-emerald-700 font-bold">LULUS</option>
                    <option value="TIDAK_LULUS" className="text-rose-700 font-bold">TIDAK LULUS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Nilai Wawancara / Ujian
                  </label>
                  <input
                    name="score"
                    type="number"
                    step="0.1"
                    placeholder="85.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catatan Khusus / Jadwal Lanjutan
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Contoh: Wajib hadir verifikasi berkas fisik pada 15 September 2026 di Aula Utama..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Action Buttons Modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs sm:text-sm transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || validationFields.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md shadow-amber-600/20 disabled:opacity-70 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Peserta</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
