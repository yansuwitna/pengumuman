"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getParticipants() {
  return await prisma.participant.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createParticipant(formData: FormData) {
  const id = formData.get("id") as string | null;
  const status = (formData.get("status") as string) || "LULUS";
  const scoreStr = formData.get("score") as string;
  const score = scoreStr && scoreStr.trim() !== "" ? parseFloat(scoreStr) : null;
  const notes = (formData.get("notes") as string) || null;
  const validationDataStr = (formData.get("validationData") as string) || "{}";

  let valObj: Record<string, any> = {};
  try {
    valObj = JSON.parse(validationDataStr);
  } catch {}

  // Ambil nama dari dynamic field 'nama' / 'name' atau fallback
  const name =
    valObj.nama ||
    valObj.name ||
    valObj.nama_lengkap ||
    valObj.nama_peserta ||
    Object.values(valObj)[0] ||
    "Peserta";

  const position =
    valObj.formasi ||
    valObj.position ||
    valObj.jurusan ||
    null;

  if (id && id.trim() !== "") {
    // Mode Update / Edit Peserta
    await prisma.participant.update({
      where: { id },
      data: {
        name: String(name),
        position: position ? String(position) : null,
        status,
        score: score !== null && !isNaN(score) ? score : null,
        notes,
        validationData: validationDataStr,
      },
    });
  } else {
    // Mode Tambah Peserta Baru
    await prisma.participant.create({
      data: {
        name: String(name),
        position: position ? String(position) : null,
        status,
        score: score !== null && !isNaN(score) ? score : null,
        notes,
        validationData: validationDataStr,
      },
    });
  }

  revalidatePath("/admin/participants");
  revalidatePath("/");
  return { success: true };
}

export async function deleteParticipant(id: string) {
  await prisma.participant.delete({ where: { id } });
  revalidatePath("/admin/participants");
  revalidatePath("/");
  return { success: true };
}

export async function importParticipants(rows: Record<string, any>[]) {
  const validationFields = await prisma.validationField.findMany();

  const dataToInsert = rows.map((row) => {
    const valDataObj: Record<string, any> = {};

    // Pindai semua custom field yang ada di baris excel
    for (const f of validationFields) {
      if (row[f.fieldKey] !== undefined) {
        valDataObj[f.fieldKey] = row[f.fieldKey];
      } else if (row[f.label] !== undefined) {
        valDataObj[f.fieldKey] = row[f.label];
      }
    }

    // Juga tangkap properti lain yang mungkin ditulis di excel
    Object.keys(row).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (!["name", "nama", "position", "formasi", "status", "score", "nilai", "notes", "catatan"].includes(lowerKey)) {
        if (!valDataObj[key]) {
          valDataObj[key] = row[key];
        }
      }
    });

    const name =
      row.nama ||
      row.name ||
      row.Nama ||
      row["Nama Lengkap"] ||
      valDataObj.nama ||
      valDataObj.name ||
      "Peserta";

    const position =
      row.formasi ||
      row.position ||
      row.Formasi ||
      row.Jurusan ||
      valDataObj.formasi ||
      valDataObj.position ||
      null;

    const rawStatus = (row.status || row.Status || "LULUS").toString().toUpperCase().trim();
    const status = rawStatus.includes("TIDAK") || rawStatus === "GAGAL" ? "TIDAK_LULUS" : "LULUS";

    const rawScore = row.score || row.nilai || row.Nilai;
    const score = rawScore !== undefined && rawScore !== null && rawScore !== "" ? parseFloat(rawScore) : null;

    const notes = row.notes || row.catatan || row.Catatan || null;

    return {
      name: String(name),
      position: position ? String(position) : null,
      status,
      score: isNaN(score as number) ? null : score,
      notes: notes ? String(notes) : null,
      validationData: JSON.stringify(valDataObj),
    };
  });

  for (const item of dataToInsert) {
    await prisma.participant.create({ data: item });
  }

  revalidatePath("/admin/participants");
  revalidatePath("/");
  return { success: true, count: dataToInsert.length };
}
