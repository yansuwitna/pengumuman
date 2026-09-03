"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const DEFAULT_INITIAL_FIELDS = [
  {
    fieldKey: "nama",
    label: "Nama Lengkap Peserta",
    placeholder: "Contoh: Budi Santoso",
    fieldType: "text",
    category: "DISPLAY",
    showOnResult: true,
    sortOrder: 1,
    isRequired: true,
    isCaseSensitive: false,
  },
  {
    fieldKey: "nisn",
    label: "NISN (Nomor Induk Siswa Nasional)",
    placeholder: "Contoh: 0081234567",
    fieldType: "number",
    category: "VALIDATION",
    showOnResult: true,
    sortOrder: 2,
    isRequired: true,
    isCaseSensitive: false,
  },
  {
    fieldKey: "nis",
    label: "NIS (Nomor Induk Siswa)",
    placeholder: "Contoh: 2026001",
    fieldType: "number",
    category: "VALIDATION",
    showOnResult: true,
    sortOrder: 3,
    isRequired: true,
    isCaseSensitive: false,
  },
  {
    fieldKey: "formasi",
    label: "Formasi / Pilihan Jalur",
    placeholder: "Contoh: Jalur Prestasi Akademik",
    fieldType: "text",
    category: "DISPLAY",
    showOnResult: true,
    sortOrder: 4,
    isRequired: false,
    isCaseSensitive: false,
  },
  {
    fieldKey: "asal_sekolah",
    label: "Asal Sekolah",
    placeholder: "Contoh: SMP Negeri 1 Jakarta",
    fieldType: "text",
    category: "DISPLAY",
    showOnResult: true,
    sortOrder: 5,
    isRequired: false,
    isCaseSensitive: false,
  },
  {
    fieldKey: "jurusan",
    label: "Program Keahlian / Jurusan",
    placeholder: "Contoh: Rekayasa Perangkat Lunak (RPL)",
    fieldType: "text",
    category: "DISPLAY",
    showOnResult: true,
    sortOrder: 6,
    isRequired: false,
    isCaseSensitive: false,
  },
];

export const DEFAULT_INITIAL_SETTING = {
  id: "default",
  appName: "PORTAL PENGUMUMAN",
  activityName: "Hasil Seleksi Penerimaan Calon Pegawai 2026",
  activityDesc: "Masukkan data verifikasi Anda untuk melihat status kelulusan.",
  isAnnouncementOpen: true,
  announcementDate: null,
  announcementMode: "OPEN",
  passedMessage: "Selamat! Anda dinyatakan LULUS seleksi.",
  failedMessage: "Mohon maaf, Anda belum memenuhi kualifikasi pada tahap ini. Tetap semangat!",
  contactInfo: "Hubungi Panitia: helpdesk@instansi.go.id | 0812-3456-7890",
};

/**
 * 1. Menghasilkan payload backup database lengkap (JSON)
 */
export async function getDatabaseBackupPayload() {
  const [appSetting, validationFields, participants] = await Promise.all([
    prisma.appSetting.findUnique({ where: { id: "default" } }),
    prisma.validationField.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.participant.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return {
    appVersion: "1.0.0",
    backupType: "FULL_PORTAL_BACKUP",
    exportedAt: new Date().toISOString(),
    stats: {
      totalParticipants: participants.length,
      totalValidationFields: validationFields.length,
    },
    appSetting: appSetting || DEFAULT_INITIAL_SETTING,
    validationFields: validationFields || [],
    participants: participants || [],
  };
}

/**
 * 2. Restore data dari file backup JSON
 */
export async function restoreDatabaseBackup(backupData: any) {
  try {
    if (!backupData || typeof backupData !== "object") {
      return { success: false, message: "Format file backup tidak valid (Bukan JSON yang sah)." };
    }

    if (!Array.isArray(backupData.validationFields) && !Array.isArray(backupData.participants)) {
      return {
        success: false,
        message: "Struktur file backup tidak sesuai (Data kolom atau peserta tidak ditemukan).",
      };
    }

    const { appSetting, validationFields, participants } = backupData;

    await prisma.$transaction(async (tx) => {
      // 1. Restore App Setting jika ada
      if (appSetting && typeof appSetting === "object") {
        await tx.appSetting.upsert({
          where: { id: "default" },
          update: {
            appName: appSetting.appName || "PORTAL PENGUMUMAN",
            activityName: appSetting.activityName || "Hasil Seleksi Penerimaan 2026",
            activityDesc: appSetting.activityDesc || "",
            isAnnouncementOpen: Boolean(appSetting.isAnnouncementOpen),
            announcementDate: appSetting.announcementDate || null,
            announcementMode: appSetting.announcementMode || "OPEN",
            passedMessage: appSetting.passedMessage || "",
            failedMessage: appSetting.failedMessage || "",
            contactInfo: appSetting.contactInfo || "",
          },
          create: {
            id: "default",
            appName: appSetting.appName || "PORTAL PENGUMUMAN",
            activityName: appSetting.activityName || "Hasil Seleksi Penerimaan 2026",
            activityDesc: appSetting.activityDesc || "",
            isAnnouncementOpen: Boolean(appSetting.isAnnouncementOpen),
            announcementDate: appSetting.announcementDate || null,
            announcementMode: appSetting.announcementMode || "OPEN",
            passedMessage: appSetting.passedMessage || "",
            failedMessage: appSetting.failedMessage || "",
            contactInfo: appSetting.contactInfo || "",
          },
        });
      }

      // 2. Restore Validation Fields jika ada
      if (Array.isArray(validationFields) && validationFields.length > 0) {
        await tx.validationField.deleteMany({});
        for (let i = 0; i < validationFields.length; i++) {
          const f = validationFields[i];
          if (f.fieldKey && f.label) {
            await tx.validationField.create({
              data: {
                fieldKey: String(f.fieldKey).trim().toLowerCase(),
                label: String(f.label).trim(),
                placeholder: f.placeholder ? String(f.placeholder) : null,
                fieldType: f.fieldType || "text",
                category: f.category || "VALIDATION",
                showOnResult: f.showOnResult !== false,
                isRequired: f.isRequired !== false,
                isCaseSensitive: Boolean(f.isCaseSensitive),
                sortOrder: typeof f.sortOrder === "number" ? f.sortOrder : i + 1,
              },
            });
          }
        }
      }

      // 3. Restore Participants jika ada
      if (Array.isArray(participants)) {
        await tx.participant.deleteMany({});
        for (const p of participants) {
          if (p.name && p.status) {
            await tx.participant.create({
              data: {
                name: String(p.name).trim(),
                position: p.position ? String(p.position).trim() : null,
                status: p.status === "LULUS" ? "LULUS" : "TIDAK_LULUS",
                score: typeof p.score === "number" ? p.score : null,
                notes: p.notes ? String(p.notes) : null,
                validationData:
                  typeof p.validationData === "string"
                    ? p.validationData
                    : JSON.stringify(p.validationData || {}),
              },
            });
          }
        }
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/validation-fields");
    revalidatePath("/admin/participants");
    revalidatePath("/admin/backup");

    return {
      success: true,
      message: `Pemulihan data berhasil! ${participants?.length || 0} data peserta dan ${
        validationFields?.length || 0
      } kolom validasi telah dipulihkan.`,
    };
  } catch (error: any) {
    console.error("Gagal melakukan restore database:", error);
    return {
      success: false,
      message: `Gagal memulihkan database: ${error?.message || "Kesalahan internal server"}`,
    };
  }
}

/**
 * 3. Hapus Semua Data Peserta & Kembalikan ke Setelan Awal Default (KECUALI USER ADMIN)
 */
export async function resetDatabaseToDefault() {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus semua data peserta
      await tx.participant.deleteMany({});

      // 2. Hapus seluruh kolom validasi lama dan buat ulang daftar kolom default awal
      await tx.validationField.deleteMany({});
      for (const field of DEFAULT_INITIAL_FIELDS) {
        await tx.validationField.create({
          data: field,
        });
      }

      // 3. Kembalikan AppSetting ke nilai default
      await tx.appSetting.upsert({
        where: { id: "default" },
        update: {
          appName: DEFAULT_INITIAL_SETTING.appName,
          activityName: DEFAULT_INITIAL_SETTING.activityName,
          activityDesc: DEFAULT_INITIAL_SETTING.activityDesc,
          isAnnouncementOpen: DEFAULT_INITIAL_SETTING.isAnnouncementOpen,
          announcementDate: DEFAULT_INITIAL_SETTING.announcementDate,
          announcementMode: DEFAULT_INITIAL_SETTING.announcementMode,
          passedMessage: DEFAULT_INITIAL_SETTING.passedMessage,
          failedMessage: DEFAULT_INITIAL_SETTING.failedMessage,
          contactInfo: DEFAULT_INITIAL_SETTING.contactInfo,
        },
        create: DEFAULT_INITIAL_SETTING,
      });

      // CATATAN PENTING:
      // Tabel tx.userAdmin TIDAK disentuh sama sekali agar akun admin tetap aman dan login tetap valid.
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/validation-fields");
    revalidatePath("/admin/participants");
    revalidatePath("/admin/backup");

    return {
      success: true,
      message:
        "Semua data peserta telah dihapus dan pengaturan telah dikembalikan ke setelan awal default. Akun administrator tetap aman.",
    };
  } catch (error: any) {
    console.error("Gagal melakukan reset database:", error);
    return {
      success: false,
      message: `Gagal mereset database: ${error?.message || "Kesalahan internal"}`,
    };
  }
}
