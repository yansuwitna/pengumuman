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
- 💾 **Backup & Restore Data Lengkap**: Ekspor dan impor seluruh data peserta, kolom validasi, serta konfigurasi aplikasi dalam satu file JSON mandiri.
- 🔄 **Hapus Semua Data & Reset Factory**: Kosongkan semua data peserta dan kembalikan setelan aplikasi ke kondisi awal secara aman tanpa menghapus akun administrator.
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
- 🔐 **Halaman Login Admin:** [http://localhost:3000/login](http://localhost:3000/login)

---

## 🔑 Kredensial Default Administrator

Saat pertama kali database diinisialisasi, sistem secara otomatis membuat akun admin default:

| Keterangan | Nilai Default |
| :--- | :--- |
| **URL Login** | `http://localhost:3000/login` |
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
│   ├── actions/            # Server Actions (auth, field, participant, setting, search, maintenance)
│   ├── app/
│   │   ├── (public)/       # Halaman utama publik & pencarian kelulusan
│   │   ├── admin/          # Halaman Panel Admin (dashboard, settings, validation-fields, participants, backup, password)
│   │   ├── api/            # API Routes (template-excel, backup)
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

## ☁️ Panduan Instalasi & Deployment di VPS (Debian / Ubuntu)

Panduan ini menjelaskan langkah demi langkah cara men-deploy aplikasi pada server VPS menggunakan **NVM (Node Version Manager)**, **PM2**, **Nginx Reverse Proxy**, dan **SSL Gratis (Let's Encrypt)**.

---

### 1. Update Sistem & Install Paket Dasar
Masuk ke server VPS via SSH, lalu perbarui repositori dan pasang paket yang dibutuhkan:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx build-essential
```

Aktifkan firewall UFW:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

---

### 2. Install Node.js menggunakan NVM (Node Version Manager)
Menggunakan **NVM** memudahkan instalasi dan pengelolaan versi Node.js tanpa konflik hak akses `root`:

```bash
# 1. Download dan pasang NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Muat konfigurasi NVM ke sesi shell aktif
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
source ~/.bashrc

# 3. Install Node.js LTS (disarankan versi 20.x)
nvm install 20
nvm use 20
nvm alias default 20

# 4. Verifikasi instalasi Node.js & NPM
node -v
npm -v
```

---

### 3. Install PM2 (Process Manager)
PM2 bertugas menjaga aplikasi tetap hidup di latar belakang (*background*) dan otomatis *restart* jika terjadi *crash* atau server *reboot*:

```bash
npm install -g pm2
```

---

### 4. Setup Direktori & Clone Proyek
Buat folder aplikasi pada direktori web server (contoh: `/var/www/pks`) dan berikan hak akses:

```bash
sudo mkdir -p /var/www/pks
sudo chown -R $USER:$USER /var/www/pks
cd /var/www/pks

# Clone repository ke folder saat ini
git clone <URL_REPOSITORY_ANDA> .
```

---

### 5. Install Dependensi & Konfigurasi Database
Di dalam folder `/var/www/pks`, lakukan instalasi dependensi dan inisialisasi database SQLite:

```bash
# 1. Install seluruh dependensi
npm install

# 2. Buat file .env untuk database SQLite
cat << 'EOF' > .env
DATABASE_URL="file:./dev.db"
EOF

# 3. Sinkronkan tabel SQLite & generate Prisma Client
npx prisma db push
npx prisma generate

# 4. Jalankan Seeder data awal & akun admin default
npm run db:seed
```

> 🔑 **Akun Admin Default:**
> - URL Admin: `http://domainanda.com/login`
> - Username: `admin` | Password: `admin` *(Segera ubah setelah login!)*

---

### 6. Build Aplikasi Next.js untuk Production
Kompilasi aplikasi untuk performa optimal di lingkungan produksi:

```bash
npm run build
```

---

### 7. Jalankan Aplikasi Menggunakan PM2
Jalankan aplikasi menggunakan file konfigurasi `ecosystem.config.js`:

```bash
# Start aplikasi dengan PM2
pm2 start ecosystem.config.js

# Simpan daftar proses yang aktif
pm2 save

# Daftarkan PM2 ke system startup agar otomatis aktif saat VPS reboot
pm2 startup
```
*(Jika terminal mencetak baris perintah `sudo env PATH=...`, salin dan jalankan baris tersebut di terminal).*

#### 📌 Perintah Manajemen PM2 yang Sering Digunakan:
- `pm2 status` — Melihat status aplikasi.
- `pm2 logs pks-pengumuman` — Melihat log realtime / error log.
- `pm2 restart pks-pengumuman` — Me-restart aplikasi.
- `pm2 stop pks-pengumuman` — Menghentikan aplikasi.

---

### 8. Konfigurasi Nginx (Reverse Proxy)
Buat file konfigurasi Nginx untuk mengarahkan domain/subdomain ke port `3000`:

```bash
sudo nano /etc/nginx/sites-available/pks-pengumuman
```

Salin konfigurasi berikut *(sesuaikan `pengumuman.domainanda.com` dengan nama domain Anda)*:

```nginx
server {
    listen 80;
    server_name pengumuman.domainanda.com;

    # Batas ukuran upload file Excel yang diizinkan
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
# Aktifkan konfigurasi Nginx
sudo ln -s /etc/nginx/sites-available/pks-pengumuman /etc/nginx/sites-enabled/

# Hapus konfigurasi default jika ada
sudo rm -f /etc/nginx/sites-enabled/default

# Uji konfigurasi Nginx
sudo nginx -t

# Restart layanan Nginx
sudo systemctl restart nginx
```

---

### 9. Pasang SSL Gratis (HTTPS) dengan Certbot
Amankan domain Anda dengan sertifikat SSL resmi dari Let's Encrypt:

```bash
# Install Certbot & plugin Nginx
sudo apt install -y certbot python3-certbot-nginx

# Request dan terapkan sertifikat SSL
sudo certbot --nginx -d pengumuman.domainanda.com
```
Ikuti petunjuk di layar (masukkan email & setujui persetujuan). Certbot akan otomatis mengatur pengalihan (redirect) dari HTTP ke HTTPS.

---

### 10. Prosedur Update Aplikasi di Masa Depan
Jika terdapat pembaruan kode baru, jalankan perintah berikut di VPS:

```bash
cd /var/www/pks
git pull
npm install
npx prisma db push
npm run build
pm2 restart pks-pengumuman
```

---

## 📜 Lisensi

Proyek ini dirancang dan dikembangkan untuk keperluan pengumuman resmi instansi, sekolah, dan organisasi. Bebas dimodifikasi dan dikembangkan sesuai kebutuhan.
