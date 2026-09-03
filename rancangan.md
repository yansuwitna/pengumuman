# 📄 DOKUMEN RANCANGAN SISTEM
# APLIKASI PENGUMUMAN HASIL KELULUSAN WAWANCARA (DYNAMIC VALIDATION ENGINE)

---

## 1. RINGKASAN EKSEKUTIF

Aplikasi ini dirancang sebagai platform informasi pengumuman hasil seleksi/wawancara yang fleksibel, modern, aman, dan mudah disesuaikan. Sistem memungkinkan administrator untuk:
1. Mengubah nama kegiatan wawancara, identitas aplikasi, logo, dan status pengumuman (aktif/nonaktif/countdown).
2. Menyesuaikan kolom validasi input secara dinamis (fleksibel: bisa 2, 3, 4, atau N input seperti Nomor Peserta, Tanggal Lahir, NIK, PIN, dll.) beserta tipe datanya (Teks, Angka, Tanggal, PIN).
3. Mengelola data peserta dan status kelulusan (`LULUS` / `TIDAK LULUS`) baik melalui input manual maupun impor massal via file Excel/CSV.
4. Menampilkan formulir pengecekan dinamis di halaman publik yang secara otomatis mengikuti pengaturan validasi dari admin.

Aplikasi dibangun menggunakan **Next.js (App Router)** sebagai full-stack framework dan **SQLite** sebagai basis data relasional berbasis file yang mandiri, ringan, dan andal.

---

## 2. ARSITEKTUR TEKNOLOGI (TECH STACK)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14/15 (App Router)** | Full-stack React (Server Components & Server Actions) |
| **Bahasa Pemrograman** | **TypeScript** | Type-safety untuk form dinamis dan skema data |
| **Database** | **SQLite** | Database relasional lokal berbasis file (`prisma/dev.db`) |
| **ORM / Data Access** | **Prisma ORM** | Type-safe query builder dan skema database |
| **Styling & UI** | **Tailwind CSS** | Antarmuka modern, responsif, dan elegan |
| **Ikon** | **Lucide React** | Koleksi ikon antarmuka modern |
| **Excel/CSV Handler** | **XLSX (SheetJS)** | Parser impor dan ekspor data peserta otomatis |
| **Autentikasi Admin** | **Sesi Cookie / JWT** | Sesi aman berbasis token terenkripsi |

---

## 3. FITUR UTAMA SISTEM

### 3.1. Halaman Publik (Menu Umum / Peserta)
1. **Header & Informasi Kegiatan Dinamis**:
   - Menampilkan nama aplikasi, judul kegiatan wawancara, dan deskripsi kegiatan.
   - Status pengumuman (Dibuka / Ditutup).
2. **Formulir Validasi Dinamis**:
   - Menampilkan kolom input secara otomatis sesuai konfigurasi admin (2, 3, 4 input, dst.).
   - Tipe input otomatis menyesuaikan (Teks, Angka, Tanggal, PIN).
3. **Tampilan Hasil Kelulusan Interaktif**:
   - **Status LULUS**: Kartu bertema sukses warna hijau emerald, ucapan selamat, rincian data (Nama, Nomor Peserta, Posisi, Nilai), catatan jadwal lanjutan, dan tombol cetak bukti kelulusan.
   - **Status TIDAK LULUS**: Kartu dengan pesan apresiasi dan motivasi.
   - **Status DATA TIDAK DITEMUKAN**: Notifikasi jika data verifikasi tidak cocok.

### 3.2. Panel Admin (Administrator Dashboard)
1. **Pengaturan Umum & Kegiatan**: Ubah nama aplikasi, nama kegiatan wawancara, buka/tutup pengumuman, dan pesan kelulusan.
2. **Pengaturan Kolom Validasi Dinamis**: Menentukan jumlah dan jenis kolom validasi input publik (Teks, Angka, Tanggal, PIN).
3. **Manajemen Data Peserta**: Tambah, ubah, hapus peserta, impor massal via file Excel/CSV, serta penentuan status `LULUS` / `TIDAK_LULUS`.
