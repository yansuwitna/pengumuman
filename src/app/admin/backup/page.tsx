"use client";

import React, { useState, useEffect } from "react";
import {
  getDatabaseBackupPayload,
  restoreDatabaseBackup,
  resetDatabaseToDefault,
} from "@/actions/maintenance.actions";
import { showAlert, Toast } from "@/lib/alert";
import {
  Database,
  Download,
  UploadCloud,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  FileJson,
  Loader2,
  CheckCircle2,
  Users,
  ListFilter,
  Sliders,
  Info,
  Lock,
  Unlock,
} from "lucide-react";

export default function BackupMaintenancePage() {
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState<{ totalParticipants: number; totalValidationFields: number } | null>(null);
  
  // Backup state
  const [downloading, setDownloading] = useState(false);

  // Restore state
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoring, setRestoring] = useState(false);

  // Reset state
  const [resetting, setResetting] = useState(false);
  const [hasBackedUp, setHasBackedUp] = useState(false);
  const [backupTime, setBackupTime] = useState<string | null>(null);

  const loadCurrentStats = async () => {
    try {
      setLoadingStats(true);
      const payload = await getDatabaseBackupPayload();
      if (payload?.stats) {
        setStats(payload.stats);
      }
    } catch (err) {
      console.error("Gagal memuat status database:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadCurrentStats();
  }, []);

  // 1. Download Backup JSON
  const handleDownloadBackup = async () => {
    setDownloading(true);
    try {
      const payload = await getDatabaseBackupPayload();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(payload, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `backup_portal_pengumuman_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      // Tandai bahwa backup telah berhasil dilakukan
      setHasBackedUp(true);
      const timeNow = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setBackupTime(timeNow);

      Toast.fire({
        icon: "success",
        title: "File backup berhasil diunduh! Fitur reset kini terbuka.",
      });
    } catch (err: any) {
      showAlert.error("Gagal Backup", "Terjadi kesalahan saat mengekspor data.");
    } finally {
      setDownloading(false);
    }
  };

  // 2. Handle File Selection for Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".json")) {
        showAlert.error("Format File Salah", "Harap pilih file dengan format .json yang valid.");
        e.target.value = "";
        setRestoreFile(null);
        return;
      }
      setRestoreFile(file);
    }
  };

  // 3. Process Restore
  const handleProcessRestore = async () => {
    if (!restoreFile) {
      showAlert.error("Pilih File", "Silakan pilih file backup (.json) terlebih dahulu.");
      return;
    }

    const confirm = await showAlert.confirm(
      "Konfirmasi Pemulihan (Restore)",
      "Proses restore akan memperbarui pengaturan, kolom validasi, dan data peserta sesuai isi file backup. Lanjutkan?",
      "Ya, Pulihkan Data"
    );

    if (!confirm.isConfirmed) return;

    setRestoring(true);
    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const parsedData = JSON.parse(content);

          const res = await restoreDatabaseBackup(parsedData);
          if (res.success) {
            await showAlert.success("Restore Berhasil!", res.message);
            setRestoreFile(null);
            // Reset input element
            const inputEl = document.getElementById("restore-file-input") as HTMLInputElement;
            if (inputEl) inputEl.value = "";
            loadCurrentStats();
          } else {
            showAlert.error("Gagal Restore", res.message || "File backup tidak valid.");
          }
        } catch (parseErr: any) {
          showAlert.error(
            "File Corrupt / Rusak",
            "File yang diunggah bukan format JSON yang valid: " + parseErr.message
          );
        } finally {
          setRestoring(false);
        }
      };
      fileReader.readAsText(restoreFile);
    } catch (err: any) {
      showAlert.error("Gagal", "Terjadi kendala saat membaca file.");
      setRestoring(false);
    }
  };

  // 4. Process Factory Reset (Hanya Berhasil Jika Sudah Klik Backup!)
  const handleResetToDefault = async () => {
    // SYARAT MUTLAK: Wajib sudah klik backup terlebih dahulu
    if (!hasBackedUp) {
      const askBackup = await showAlert.confirm(
        "🔒 Wajib Backup Terlebih Dahulu!",
        "Demi keamanan data, Anda WAJIB mengunduh file cadangan (backup) terlebih dahulu sebelum dapat menghapus data atau mereset aplikasi. Ingin unduh backup sekarang?",
        "Ya, Unduh Backup Sekarang"
      );

      if (askBackup.isConfirmed) {
        await handleDownloadBackup();
      }
      return;
    }

    const promptRes = await showAlert.promptConfirm(
      "⚠️ PERINGATAN TERAKHIR: RESET DATA",
      `<div class="text-xs text-left text-slate-600 space-y-2">
        <p class="font-bold text-rose-600 text-sm">Backup telah diverifikasi. Tindakan ini akan mengosongkan seluruh data!</p>
        <ul class="list-disc pl-4 space-y-1">
          <li><strong>Semua data peserta (${stats?.totalParticipants || 0} orang)</strong> akan dihapus permanen.</li>
          <li>Kolom validasi akan dikembalikan ke setelan kolom default.</li>
          <li>Pengaturan nama aplikasi & kegiatan akan kembali ke setelan awal.</li>
          <li><span class="text-emerald-700 font-bold">🛡️ Akun Administrator TETAP AMAN</span> (Username & Password Anda tidak akan dihapus).</li>
        </ul>
        <p class="pt-2 text-slate-800 font-semibold">Ketik kata <strong>RESET</strong> di bawah ini untuk mengonfirmasi:</p>
      </div>`,
      "RESET"
    );

    if (!promptRes.isConfirmed) return;

    setResetting(true);
    try {
      const res = await resetDatabaseToDefault();
      if (res.success) {
        await showAlert.success("Reset Berhasil!", res.message);
        setHasBackedUp(false);
        setBackupTime(null);
        loadCurrentStats();
      } else {
        showAlert.error("Gagal Reset", res.message);
      }
    } catch (err: any) {
      showAlert.error("Error", "Gagal melakukan reset database.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      {/* Header Halaman */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          Pemeliharaan & Keamanan Database
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
          Backup, Restore & Reset Data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola pencadangan data, pemulihan dari file cadangan JSON, serta pembersihan data peserta kembali ke setelan awal.
        </p>
      </div>

      {/* Ringkasan Status Database Saat Ini */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Data Saat Ini</h3>
            <p className="text-xs text-slate-500">Tersimpan dalam database SQLite lokal</p>
          </div>
        </div>

        <div className="flex items-center gap-6 divide-x divide-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">
                {loadingStats ? "..." : stats?.totalParticipants ?? 0}
              </span>
              <span className="text-slate-400 ml-1">Peserta</span>
            </div>
          </div>

          <div className="pl-6 flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-emerald-500" />
            <div className="text-xs">
              <span className="font-bold text-slate-800">
                {loadingStats ? "..." : stats?.totalValidationFields ?? 0}
              </span>
              <span className="text-slate-400 ml-1">Kolom Dinamis</span>
            </div>
          </div>

          <div className="pl-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <div className="text-xs">
              <span className="font-bold text-emerald-600">Admin Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Kolom Grid: Backup & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. KARTU BACKUP DATA */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">1. Backup Data (Unduh Cadangan)</h2>
                <p className="text-xs text-slate-500">Ekspor seluruh data ke file JSON mandiri</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              File cadangan berisi snapshot lengkap dari:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-none pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Seluruh data kelulusan & nilai peserta</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Struktur & pengaturan kolom validasi dinamis</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Identitas kegiatan, jadwal buka, dan pesan kelulusan</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Disarankan melakukan backup sebelum mengimpor file Excel baru atau mereset data.
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-blue-600/20 disabled:opacity-60 cursor-pointer"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyiapkan File Backup...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh File Backup JSON</span>
              </>
            )}
          </button>
        </div>

        {/* 2. KARTU RESTORE DATA */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">2. Restore Data (Pulihkan)</h2>
                <p className="text-xs text-slate-500">Kembalikan data dari file cadangan .json</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih file hasil backup yang telah diunduh sebelumnya untuk mengembalikan seluruh pengaturan dan peserta:
            </p>

            {/* Input File Box */}
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-4 transition bg-slate-50/50 text-center relative cursor-pointer">
              <input
                id="restore-file-input"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <FileJson className="w-8 h-8 text-slate-400" />
                {restoreFile ? (
                  <div>
                    <p className="text-xs font-bold text-emerald-600 truncate max-w-xs">{restoreFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(restoreFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Klik atau seret file JSON ke sini</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Format file: backup_portal_pengumuman_*.json</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleProcessRestore}
            disabled={!restoreFile || restoring}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {restoring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memulihkan Database...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Pulihkan Data Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. KARTU FACTORY RESET / HAPUS SEMUA DATA (DANGER ZONE) */}
      <div className="bg-rose-50/70 border-2 border-rose-200 p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 mt-0.5 shadow-md shadow-rose-600/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-rose-950">
                  3. Hapus Semua Data & Kembalikan ke Setelan Awal
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-extrabold uppercase">
                  Zona Bahaya
                </span>
              </div>
              <p className="text-xs text-rose-900 leading-relaxed max-w-3xl">
                Fitur ini akan mengosongkan seluruh data peserta seleksi dan mengembalikan struktur kolom serta pengaturan nama kegiatan ke kondisi awal default pabrik (*fresh install*).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-rose-700">Yang Akan Dihapus & Direset:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                    <li>Semua peserta ({stats?.totalParticipants || 0} orang) dihapus permanen</li>
                    <li>Kolom validasi kembali ke default (NISN, NIS, Nama, dll)</li>
                    <li>Nama kegiatan & jadwal buka direset ke setelan awal</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-300 text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Yang Tetap Aman & Tidak Dihapus:</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-emerald-900">
                    <li><strong>Akun Admin & Password Anda</strong> tidak diubah</li>
                    <li>Sesi login Anda tetap aktif</li>
                    <li>File server aplikasi tetap utuh</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Syarat Keamanan Status Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
            hasBackedUp
              ? "bg-emerald-100/90 border-emerald-300 text-emerald-900"
              : "bg-amber-100/90 border-amber-300 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {hasBackedUp ? (
              <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              {hasBackedUp ? (
                <p className="font-bold">
                  ✅ Syarat Terpenuhi: Backup telah diunduh pukul {backupTime} WIB. Fitur reset kini aktif.
                </p>
              ) : (
                <p className="font-bold">
                  🔒 Fitur Terkunci: Anda WAJIB mengklik tombol &quot;Unduh File Backup JSON&quot; di atas sebelum dapat melakukan reset!
                </p>
              )}
            </div>
          </div>

          {!hasBackedUp && (
            <button
              onClick={handleDownloadBackup}
              disabled={downloading}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup Sekarang</span>
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-rose-800">
            *Setelah backup diunduh, Anda akan diminta mengetik kata konfirmasi <strong className="font-mono bg-rose-200/80 px-1.5 py-0.5 rounded">RESET</strong> sebelum data dihapus.
          </p>

          <button
            onClick={handleResetToDefault}
            disabled={!hasBackedUp || resetting}
            title={!hasBackedUp ? "Silakan klik tombol 'Unduh File Backup JSON' di atas terlebih dahulu untuk mengaktifkan tombol ini" : "Klik untuk mereset data"}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition shrink-0 ${
              hasBackedUp
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30 active:scale-[0.98] cursor-pointer"
                : "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75 shadow-none"
            }`}
          >
            {resetting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sedang Mereset Data...</span>
              </>
            ) : hasBackedUp ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Hapus & Reset ke Setelan Awal</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Tombol Terkunci (Unduh Backup Dahulu)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
