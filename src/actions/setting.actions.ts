"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAppSettings() {
  let setting = await prisma.appSetting.findUnique({
    where: { id: "default" },
  });

  if (!setting) {
    setting = await prisma.appSetting.create({
      data: {
        id: "default",
        appName: "PORTAL PENGUMUMAN",
        activityName: "Hasil Seleksi Penerimaan Calon Pegawai 2026",
        isAnnouncementOpen: true,
        announcementMode: "OPEN",
      },
    });
  }

  return setting;
}

export async function updateAppSettings(formData: FormData) {
  const appName = formData.get("appName") as string;
  const activityName = formData.get("activityName") as string;
  const activityDesc = formData.get("activityDesc") as string;
  const announcementMode = (formData.get("announcementMode") as string) || "OPEN";
  const announcementDate = (formData.get("announcementDate") as string) || null;
  const passedMessage = formData.get("passedMessage") as string;
  const failedMessage = formData.get("failedMessage") as string;
  const contactInfo = formData.get("contactInfo") as string;

  const isAnnouncementOpen = announcementMode === "OPEN" || announcementMode === "SCHEDULED";

  await prisma.appSetting.upsert({
    where: { id: "default" },
    update: {
      appName,
      activityName,
      activityDesc,
      announcementMode,
      announcementDate,
      isAnnouncementOpen,
      passedMessage,
      failedMessage,
      contactInfo,
    },
    create: {
      id: "default",
      appName,
      activityName,
      activityDesc,
      announcementMode,
      announcementDate,
      isAnnouncementOpen,
      passedMessage,
      failedMessage,
      contactInfo,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true };
}
