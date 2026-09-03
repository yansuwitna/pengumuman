import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const fields = await prisma.validationField.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const sampleRow: Record<string, any> = {};

    // Tambahkan seluruh kolom yang sedang aktif di Setting Kolom
    for (const f of fields) {
      if (f.fieldType === "date") {
        sampleRow[f.fieldKey] = "2008-05-14";
      } else if (f.fieldKey.includes("nisn")) {
        sampleRow[f.fieldKey] = "0081234567";
      } else if (f.fieldKey.includes("nis")) {
        sampleRow[f.fieldKey] = "2026001";
      } else if (f.fieldKey.includes("nama") || f.fieldKey.includes("name")) {
        sampleRow[f.fieldKey] = "Budi Santoso";
      } else if (f.fieldKey.includes("formasi") || f.fieldKey.includes("posisi")) {
        sampleRow[f.fieldKey] = "Jalur Prestasi Akademik";
      } else if (f.fieldKey.includes("sekolah")) {
        sampleRow[f.fieldKey] = "SMP Negeri 1 Jakarta";
      } else if (f.fieldKey.includes("jurusan")) {
        sampleRow[f.fieldKey] = "Teknik Komputer & Jaringan";
      } else {
        sampleRow[f.fieldKey] = `Contoh_${f.fieldKey}`;
      }
    }

    sampleRow["score"] = 88.5;
    sampleRow["status"] = "LULUS";
    sampleRow["notes"] = "Wajib hadir verifikasi berkas fisik pada 15 September 2026 di Aula Utama.";

    const worksheet = XLSX.utils.json_to_sheet([sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template_Peserta");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="template_data_peserta_pengumuman.xlsx"',
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat template Excel" }, { status: 500 });
  }
}
