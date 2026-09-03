# 🎓 Portal Pengumuman Hasil Seleksi & Kelulusan

Aplikasi web modern, elegan, dan responsif untuk menampilkan informasi hasil seleksi penerimaan (kelulusan wawancara, ujian, atau seleksi masuk) berbasis **Next.js 14**, **SQLite**, **Prisma ORM**, **Tailwind CSS**, dan **SweetAlert2**.

---

## ✨ Fitur Utama

- 🎨 **Tampilan Elegan & Modern**: Desain antarmuka bersih (*luxury clean style*) dengan tipografi **Google Font Poppins** 100% responsif di desktop maupun smartphone.
- ⚙️ **Pengaturan Kolom Dinamis (*Dynamic Field Builder*)**:
  - **Kunci Verifikasi**: Parameter yang harus diisi peserta di halaman depan (contoh: `NISN`, `NIS`, `No. Ujian`, `PIN`).
  - **Biodata / Informasi Tambahan**: Kolom pelengkap yang langsung dimunculkan di kartu hasil kelulusan (contoh: `Nama Lengkap`, `Asal Sekolah`, `Program Keahlian/Jurusan`, `Tempat Lahir`, dll.).
- ⏰ **Jadwal Tanggal & Jam Buka Pengumuman**: Admin dapat menjadwalkan kapan pengumuman dibuka secara otomatis dengan banner informasi waktu di halaman depan.
- 🛡️ **Panel Admin Responsif**: Dilengkapi *slide-over drawer menu* untuk smartphone dan dialog konfirmasi **SweetAlert2** sebelum data disimpan atau dihapus.
- 📄 **Cetak Surat / Sertifikat Kelulusan Digital**: Peserta dapat langsung mencetak bukti kelulusan berstempel resmi ke format **PDF / Printer**.
- 📊 **Impor Massal Excel & Unduh Template**: Tambah ratusan data peserta secara instan melalui file Excel yang kolomnya otomatis mengikuti konfigurasi kolom dinamis.
- 🔐 **Keamanan Terpadu**: Autentikasi sesi admin dengan hashing aman (PBKDF2) dan proteksi rute admin.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend & Backend**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) (File database lokal ringan dan mudah di-backup)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Dialog & Notifikasi**: [SweetAlert2](https://sweetalert2.github.io/)
- **Pemrosesan Excel**: [XLSX (SheetJS)](https://sheetjs.com/)

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan komputer Anda telah terpasang:
- **Node.js**: Versi `18.x`, `20.x`, atau `22.x LTS` ([Unduh Node.js](https://nodejs.org/))
- **NPM**: Versi 9 ke atas (bawaan Node.js)
- **Git**: ([Unduh Git](https://git-scm.com/))

---

## 🚀 Langkah-langkah Instalasi (Localhost)

Ikuti langkah demi langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda:

### 1. Clone Repository
Buka terminal dan clone repository ini ke komputer Anda:
```bash
git clone https://github.com/username-anda/portal-pengumuman.git
cd portal-pengumuman
```

### 2. Install Dependensi Proyek
Jalankan perintah berikut untuk mengunduh semua paket yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi File Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
# Windows (PowerShell / Command Prompt):
copy .env.example .env

# Linux / macOS:
cp .env.example .env
```

Pastikan isi file `.env` adalah:
```env
DATABASE_URL="file:./dev.db"
```

### 4. Inisialisasi Database SQLite & Prisma Client
Sinkronkan struktur tabel database dan generate Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Inisialisasi Data Awal & Akun Admin (*Seeding*)
Jalankan seeder untuk membuat akun Administrator awal, pengaturan aplikasi, dan sampel kolom verifikasi:
```bash
npm run db:seed
```

### 6. Jalankan Server Development
Mulai server development lokal:
```bash
npm run dev
```

Buka browser dan akses URL berikut:
- 🌐 **Halaman Publik (Pengumuman):** [http://localhost:3000](http://localhost:3000)
- 🔐 **Halaman Login Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔑 Kredensial Default Administrator

Saat pertama kali database diinisialisasi, sistem secara otomatis membuat akun admin default:

| Keterangan | Nilai Default |
| :--- | :--- |
| **URL Login** | `http://localhost:3000/admin/login` |
| **Username** | `admin` |
| **Password** | `admin` |

> ⚠️ **PENTING**: Segera ubah password default ini setelah Anda berhasil login melalui menu **Ubah Password Admin** di panel samping.

---

## 📁 Struktur Direktori Proyek

```plaintext
pks/
├── prisma/
│   ├── schema.prisma       # Skema database SQLite (AppSetting, ValidationField, Participant, UserAdmin)
│   └── seed.ts             # Script inisialisasi akun admin & data default
├── src/
│   ├── actions/            # Server Actions (auth, field, participant, setting, search)
│   ├── app/
│   │   ├── (public)/       # Halaman utama publik & pencarian kelulusan
│   │   ├── admin/          # Halaman Panel Admin (login, settings, validation-fields, participants, password)
│   │   ├── api/            # API Route generator template Excel dinamis
│   │   ├── globals.css     # CSS global, font Poppins, styling cetak PDF
│   │   └── layout.tsx      # Root Layout aplikasi
│   ├── components/
│   │   ├── admin/          # Komponen Sidebar & Mobile Drawer
│   │   └── public/         # Komponen Formulir Dinamis & Kartu Sertifikat Hasil
│   ├── lib/
│   │   ├── alert.ts        # Helper notifikasi & dialog konfirmasi SweetAlert2
│   │   ├── auth.ts         # Enkripsi & verifikasi password PBKDF2
│   │   └── prisma.ts       # Singleton instance Prisma Client
│   └── types/              # Deklarasi antarmuka TypeScript
├── ecosystem.config.js     # Konfigurasi PM2 Process Manager untuk VPS
├── instalasi.md            # Panduan lengkap deployment di VPS Debian dengan Nginx & SSL
├── package.json            # Daftar dependensi & npm scripts
└── README.md               # Dokumentasi panduan proyek ini
```

---

## ☁️ Panduan Deployment di VPS (Debian / Ubuntu)

Untuk panduan lengkap men-deploy aplikasi ini di server VPS menggunakan **PM2**, **Nginx Reverse Proxy**, dan **SSL Gratis (Certbot)**, silakan baca dokumentasi khusus:
👉 **[Lihat Panduan Deployment VPS (instalasi.md)](instalasi.md)**

---

## 📜 Lisensi

Proyek ini dirancang dan dikembangkan untuk keperluan pengumuman resmi instansi, sekolah, dan organisasi. Bebas dimodifikasi dan dikembangkan sesuai kebutuhan.
