"use server";

import { prisma } from "@/lib/prisma";
import { SearchResultType } from "@/types";

export async function verifyParticipantResults(inputPayload: Record<string, string>): Promise<SearchResultType> {
  const setting = await prisma.appSetting.findUnique({ where: { id: "default" } });

  if (!setting) {
    return { success: false, message: "Pengaturan sistem tidak ditemukan." };
  }

  // 1. Pengecekan Status Mode Pengumuman
  if (setting.announcementMode === "CLOSED") {
    return {
      success: false,
      message: "Mohon maaf, pengumuman saat ini sedang ditutup atau belum dirilis oleh panitia.",
    };
  }

  // 2. Pengecekan Jadwal Waktu Buka Jika Mode SCHEDULED
  if (setting.announcementMode === "SCHEDULED" && setting.announcementDate) {
    const scheduledTime = new Date(setting.announcementDate).getTime();
    const now = new Date().getTime();

    if (now < scheduledTime) {
      const formattedDate = new Date(setting.announcementDate).toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      });

      return {
        success: false,
        message: `Pengumuman belum dibuka. Portal ini akan dibuka secara resmi pada ${formattedDate} WIB.`,
      };
    }
  }

  // 3. Ambil kolom yang bertindak sebagai KUNCI VALIDASI di depan
  const verificationFields = await prisma.validationField.findMany({
    where: { category: "VALIDATION" },
    orderBy: { sortOrder: "asc" },
  });

  // Validasi: apakah semua input verifikasi wajib sudah terisi?
  for (const field of verificationFields) {
    if (field.isRequired && !inputPayload[field.fieldKey]?.trim()) {
      return {
        success: false,
        message: `Kolom '${field.label}' wajib diisi.`,
      };
    }
  }

  // 4. Ambil data peserta
  const participants = await prisma.participant.findMany();

  // 5. Pencocokan semua field validasi (Dynamic Matcher)
  const matched = participants.find((p) => {
    try {
      const stored = JSON.parse(p.validationData || "{}");
      return verificationFields.every((field) => {
        const userVal = (inputPayload[field.fieldKey] || "").trim();
        const storedVal = (stored[field.fieldKey] || "").toString().trim();

        if (field.isCaseSensitive) {
          return userVal === storedVal;
        } else {
          return userVal.toLowerCase() === storedVal.toLowerCase();
        }
      });
    } catch {
      return false;
    }
  });

  if (!matched) {
    return {
      success: false,
      message: "Data peserta tidak ditemukan. Pastikan seluruh data input verifikasi sudah sesuai dan benar.",
    };
  }

  // 6. Ambil semua field yang diizinkan tampil pada kartu hasil (baik VALIDATION maupun DISPLAY)
  const allDisplayFields = await prisma.validationField.findMany({
    where: { showOnResult: true },
    orderBy: { sortOrder: "asc" },
  });

  let participantDataObj: Record<string, any> = {};
  try {
    participantDataObj = JSON.parse(matched.validationData || "{}");
  } catch {}

  const displayDetails = allDisplayFields
    .map((f) => ({
      key: f.fieldKey,
      label: f.label,
      value: (participantDataObj[f.fieldKey] ?? "").toString(),
    }))
    .filter((item) => item.value.trim() !== "");

  return {
    success: true,
    data: {
      name: matched.name,
      position: matched.position,
      status: matched.status,
      score: matched.score,
      notes: matched.notes,
      activityName: setting.activityName,
      passedMessage: setting.passedMessage,
      failedMessage: setting.failedMessage,
      contactInfo: setting.contactInfo,
      matchedFields: inputPayload,
      displayDetails,
    },
  };
}
