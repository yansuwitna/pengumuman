"use client";

import React, { useEffect, useState } from "react";
import { getValidationFields, saveValidationField, deleteValidationField } from "@/actions/field.actions";
import { showAlert, Toast } from "@/lib/alert";
import {
  Plus,
  Trash2,
  Pencil,
  ListFilter,
  HelpCircle,
  Layers,
  Loader2,
  X,
  Sparkles,
  KeyRound,
  FileText,
  Save,
} from "lucide-react";
import { ValidationFieldType } from "@/types";

export default function ValidationFieldsPage() {
  const [fields, setFields] = useState<ValidationFieldType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<ValidationFieldType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<"ALL" | "VALIDATION" | "DISPLAY">("ALL");

  const fetchFields = async () => {
    try {
      const data = await getValidationFields();
      setFields(data as ValidationFieldType[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const openAddModal = () => {
    setEditingField(null);
    setIsModalOpen(true);
  };

  const openEditModal = (field: ValidationFieldType) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleSaveField = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const label = (formData.get("label") as string) || "";
    const isEdit = !!editingField;

    const confirm = await showAlert.confirm(
      isEdit ? "Konfirmasi Ubah Kolom" : "Konfirmasi Simpan Kolom",
      `Apakah Anda yakin ingin ${isEdit ? "memperbarui" : "menambahkan"} kolom '${label}'?`,
      isEdit ? "Ya, Simpan Perubahan" : "Ya, Tambahkan Kolom"
    );

    if (!confirm.isConfirmed) return;

    setSubmitting(true);
    try {
      const res = await saveValidationField(formData);
      if (res.success) {
        showAlert.success(
          isEdit ? "Berhasil Diperbarui!" : "Berhasil Ditambahkan!",
          `Konfigurasi kolom '${label}' berhasil disimpan.`
        );
        form.reset();
        setIsModalOpen(false);
        setEditingField(null);
        await fetchFields();
      } else {
        showAlert.error("Gagal Menyimpan", res.message || "Periksa kembali data kolom.");
      }
    } catch {
      showAlert.error("Error", "Gagal menghubungi server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteField = async (id: string, label: string) => {
    const confirm = await showAlert.confirm(
      "Hapus Kolom Data?",
      `Kolom '${label}' akan dihapus dari konfigurasi sistem. Apakah Anda yakin?`,
      "Ya, Hapus Kolom"
    );

    if (confirm.isConfirmed) {
      try {
        const res = await deleteValidationField(id);
        if (res.success) {
          Toast.fire({
            icon: "success",
            title: "Kolom Berhasil Dihapus!",
          });
          await fetchFields();
        } else {
          showAlert.error("Gagal Menghapus", res.message || "Terjadi kesalahan saat menghapus.");
        }
      } catch {
        showAlert.error("Error", "Gagal menghapus kolom.");
      }
    }
  };

  const filteredFields = fields.filter((f) => {
    if (filterCategory === "ALL") return true;
    return (f.category || "VALIDATION") === filterCategory;
  });

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Header & Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ListFilter className="w-4 h-4" />
            Dynamic Field Builder
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
            Pengaturan Kolom Data & Validasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola, ubah, atau tambah kolom verifikasi (NISN, NIS, dll.) dan kolom biodata hasil (Asal Sekolah, Jurusan, dll.).
          </p>
        </div>

        {/* Tombol Tambah yang Membuka Modal */}
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Tambah Kolom Baru</span>
        </button>
      </div>

      {/* Tabel Kolom Validasi Aktif - Full Width */}
      <div className="w-full space-y-4">
        <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm w-full space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Daftar Kolom Terdaftar ({fields.length} Kolom)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Klik tombol pensil untuk mengedit nama kolom, label, atau kategori.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterCategory("ALL")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterCategory === "ALL" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Semua ({fields.length})
              </button>
              <button
                onClick={() => setFilterCategory("VALIDATION")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterCategory === "VALIDATION" ? "bg-white text-blue-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Kunci Verifikasi ({fields.filter((f) => (f.category || "VALIDATION") === "VALIDATION").length})
              </button>
              <button
                onClick={() => setFilterCategory("DISPLAY")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filterCategory === "DISPLAY" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Biodata / Info Hasil ({fields.filter((f) => f.category === "DISPLAY").length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              <span>Memuat konfigurasi kolom...</span>
            </div>
          ) : filteredFields.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs sm:text-sm flex flex-col items-center justify-center gap-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
                <ListFilter className="w-8 h-8" />
              </div>
              <p className="font-semibold text-slate-600">Belum ada kolom pada kategori ini.</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Klik tombol <strong>&ldquo;Tambah Kolom Baru&rdquo;</strong> di atas untuk menambahkan kolom.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 w-full">
              {filteredFields.map((f, idx) => {
                const isVerification = (f.category || "VALIDATION") === "VALIDATION";

                return (
                  <div
                    key={f.id}
                    className="py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition px-2 rounded-2xl"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 text-sm sm:text-base">{f.label}</p>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isVerification
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {isVerification ? "Kunci Verifikasi Form Depan" : "Biodata / Info Tambahan"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            key: <strong className="text-slate-800">{f.fieldKey}</strong>
                          </span>
                          <span className="text-[11px] text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200 font-semibold uppercase">
                            tipe: {f.fieldType}
                          </span>
                          {f.placeholder && (
                            <span className="hidden sm:inline text-[11px] text-slate-400">
                              placeholder: &quot;{f.placeholder}&quot;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Tombol Edit Kolom */}
                      <button
                        onClick={() => openEditModal(f)}
                        className="p-2.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                        title="Ubah Kolom Ini"
                      >
                        <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>

                      {/* Tombol Hapus Kolom */}
                      <button
                        onClick={() => handleDeleteField(f.id, f.label)}
                        className="p-2.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="Hapus Kolom Ini"
                      >
                        <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Petunjuk Pengaturan Box */}
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed space-y-1.5 shadow-2xs">
          <p className="font-bold flex items-center gap-2 text-amber-950">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
            Petunjuk Pengaturan:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            <li>
              Gunakan tombol <strong>Pencil (Ubah)</strong> untuk mengedit nama label, placeholder, tipe data, atau mengubah kategori kolom.
            </li>
            <li>
              Kolom berkategori <strong>Kunci Verifikasi</strong> akan diminta pada form awal publik, sedangkan <strong>Biodata</strong> langsung ditampilkan di sertifikat kelulusan.
            </li>
          </ul>
        </div>
      </div>

      {/* MODAL POP-UP TAMBAH / UBAH KOLOM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${editingField ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {editingField ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingField ? `Ubah Kolom: ${editingField.label}` : "Tambah Kolom Baru"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingField ? "Perbarui informasi dan pengaturan kolom ini" : "Konfigurasi kolom verifikasi atau biodata baru"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingField(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/70 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Input Modal */}
            <form onSubmit={handleSaveField} className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              {/* Hidden ID jika sedang edit */}
              {editingField && <input type="hidden" name="id" value={editingField.id} />}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tujuan / Kategori Kolom <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  defaultValue={editingField?.category || "VALIDATION"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-xs sm:text-sm bg-white font-bold text-slate-800"
                >
                  <option value="VALIDATION">Kunci Verifikasi (Diminta di Halaman Depan)</option>
                  <option value="DISPLAY">Biodata / Informasi Tambahan (Tampil di Hasil Kelulusan)</option>
                </select>
                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                  Pilih apakah kolom ini sebagai syarat input peserta atau sekadar info biodata pelengkap.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key ID Kolom (Unik & Tanpa Spasi) <span className="text-rose-500">*</span>
                </label>
                <input
                  name="fieldKey"
                  required={!editingField}
                  defaultValue={editingField?.fieldKey || ""}
                  readOnly={!!editingField}
                  placeholder="Contoh: asal_sekolah / jurusan / nisn / pin"
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm ${
                    editingField
                      ? "bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed font-mono"
                      : "border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                  }`}
                />
                <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                  {editingField ? "Key ID tidak dapat diubah agar data yang sudah tersimpan tetap valid." : "Gunakan huruf kecil & underscore. Contoh: asal_sekolah"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Label Form / Nama Kolom <span className="text-rose-500">*</span>
                </label>
                <input
                  name="label"
                  required
                  defaultValue={editingField?.label || ""}
                  placeholder="Contoh: Asal Sekolah / Pilihan Jurusan / NISN"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Placeholder / Contoh Isi
                </label>
                <input
                  name="placeholder"
                  defaultValue={editingField?.placeholder || ""}
                  placeholder="Contoh: SMP Negeri 1 Jakarta"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipe Data
                  </label>
                  <select
                    name="fieldType"
                    defaultValue={editingField?.fieldType || "text"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-xs sm:text-sm bg-white font-medium"
                  >
                    <option value="text">Teks Bebas</option>
                    <option value="number">Angka Saja (Nomor/NIS)</option>
                    <option value="date">Pemilih Tanggal (Date)</option>
                    <option value="password">Password / PIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={editingField ? editingField.sortOrder : fields.length + 1}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 outline-none text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons Modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingField(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs sm:text-sm transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center gap-2 px-5 py-2.5 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md disabled:opacity-70 cursor-pointer ${
                    editingField
                      ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{editingField ? "Simpan Perubahan" : "Simpan Kolom"}</span>
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
