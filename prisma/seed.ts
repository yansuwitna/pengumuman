import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai inisialisasi & seeding database SQLite...");

  // 1. Inisialisasi Akun Admin Default (username: admin, password: admin)
  const defaultAdmin = await prisma.userAdmin.findUnique({
    where: { username: "admin" },
  });

  if (!defaultAdmin) {
    await prisma.userAdmin.create({
      data: {
        username: "admin",
        password: hashPassword("admin"),
        name: "Super Administrator",
        role: "ADMIN",
      },
    });
    console.log("✅ Berhasil membuat akun default: Username 'admin' | Password 'admin'");
  }

  // 2. Inisialisasi Pengaturan Aplikasi Default
  await prisma.appSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      appName: "PORTAL PENGUMUMAN",
      activityName: "Hasil Seleksi Penerimaan Tahun 2026",
      activityDesc: "Silakan masukkan data verifikasi Anda di bawah ini untuk melihat hasil kelulusan.",
      isAnnouncementOpen: true,
      passedMessage: "Selamat! Anda dinyatakan LULUS seleksi penerimaan.",
      failedMessage: "Mohon maaf, Anda belum memenuhi kualifikasi pada periode ini. Tetap semangat!",
      contactInfo: "Panitia Seleksi: helpdesk@instansi.com | WA: 0812-3456-7890",
    },
  });

  // 3. Inisialisasi Seluruh Kolom yang Dikelola Dinamis
  const defaultFields = [
    {
      fieldKey: "nama",
      label: "Nama Lengkap Peserta",
      placeholder: "Contoh: Budi Santoso",
      fieldType: "text",
      category: "DISPLAY",
      showOnResult: true,
      sortOrder: 1,
      isRequired: true,
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
    },
  ];

  for (const field of defaultFields) {
    await prisma.validationField.upsert({
      where: { fieldKey: field.fieldKey },
      update: {},
      create: field,
    });
  }

  // 4. Sample Data Peserta Awal
  const count = await prisma.participant.count();
  if (count === 0) {
    const sampleData = [
      {
        name: "Budi Santoso",
        position: "Jalur Prestasi Akademik",
        status: "LULUS",
        score: 88.5,
        notes: "Wajib hadir verifikasi berkas fisik pada 15 September 2026 di Aula Utama.",
        validationData: JSON.stringify({
          nama: "Budi Santoso",
          nisn: "0081234567",
          nis: "2026001",
          formasi: "Jalur Prestasi Akademik",
          asal_sekolah: "SMP Negeri 1 Jakarta",
          jurusan: "Teknik Komputer & Jaringan (TKJ)",
        }),
      },
      {
        name: "Siti Rahmawati",
        position: "Jalur Reguler",
        status: "TIDAK_LULUS",
        score: 64.0,
        notes: "Terima kasih atas partisipasi dan antusiasme Anda.",
        validationData: JSON.stringify({
          nama: "Siti Rahmawati",
          nisn: "0081234568",
          nis: "2026002",
          formasi: "Jalur Reguler",
          asal_sekolah: "SMP Negeri 5 Bandung",
          jurusan: "Akuntansi & Keuangan Lembaga (AKL)",
        }),
      },
      {
        name: "Rian Hidayat",
        position: "Jalur Prestasi Non-Akademik",
        status: "LULUS",
        score: 92.0,
        notes: "Jadwal penyerahan piagam asli: 18 September 2026.",
        validationData: JSON.stringify({
          nama: "Rian Hidayat",
          nisn: "0081234569",
          nis: "2026003",
          formasi: "Jalur Prestasi Non-Akademik",
          asal_sekolah: "SMP Negeri 2 Surabaya",
          jurusan: "Rekayasa Perangkat Lunak (RPL)",
        }),
      },
    ];

    for (const p of sampleData) {
      await prisma.participant.create({ data: p });
    }
  }

  console.log("Inisialisasi database SQLite selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
