"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getValidationFields() {
  try {
    return await prisma.validationField.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Error fetching validation fields:", error);
    return [];
  }
}

// Hanya mengambil field yang dijadikan kunci verifikasi di halaman depan
export async function getPublicVerificationFields() {
  try {
    return await prisma.validationField.findMany({
      where: { category: "VALIDATION" },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Error fetching public verification fields:", error);
    return [];
  }
}

export async function saveValidationField(formData: FormData) {
  try {
    const id = (formData.get("id") as string) || null;
    const rawKey = formData.get("fieldKey") as string;
    const fieldKey = rawKey ? rawKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_") : "";
    const label = (formData.get("label") as string)?.trim();
    const placeholder = (formData.get("placeholder") as string)?.trim() || "";
    const fieldType = (formData.get("fieldType") as string) || "text";
    const category = (formData.get("category") as string) || "VALIDATION";
    const showOnResult = formData.get("showOnResult") !== "false";
    const isRequired = formData.get("isRequired") !== "false";
    const isCaseSensitive = formData.get("isCaseSensitive") === "true";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!label) {
      return { success: false, message: "Label Nama Kolom tidak boleh kosong." };
    }

    if (id && id.trim() !== "") {
      // Edit Kolom yang Sudah Ada
      await prisma.validationField.update({
        where: { id },
        data: {
          label,
          placeholder,
          fieldType,
          category,
          showOnResult,
          isRequired,
          isCaseSensitive,
          sortOrder,
        },
      });
    } else {
      // Tambah Kolom Baru
      if (!fieldKey) {
        return { success: false, message: "Key ID Kolom tidak boleh kosong." };
      }

      // Cek apakah Key ID sudah digunakan
      const existing = await prisma.validationField.findUnique({
        where: { fieldKey },
      });

      if (existing) {
        return {
          success: false,
          message: `Key ID '${fieldKey}' sudah terdaftar pada kolom '${existing.label}'. Gunakan Key ID lain yang unik.`,
        };
      }

      await prisma.validationField.create({
        data: {
          fieldKey,
          label,
          placeholder,
          fieldType,
          category,
          showOnResult,
          isRequired,
          isCaseSensitive,
          sortOrder,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/validation-fields");
    revalidatePath("/admin/participants");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving validation field:", error);
    return {
      success: false,
      message: error?.message || "Terjadi kendala saat menyimpan data ke database SQLite.",
    };
  }
}

export async function deleteValidationField(id: string) {
  try {
    await prisma.validationField.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/validation-fields");
    revalidatePath("/admin/participants");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting validation field:", error);
    return { success: false, message: error?.message || "Gagal menghapus kolom." };
  }
}
