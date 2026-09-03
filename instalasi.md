# 🚀 Panduan Instalasi & Deployment di VPS Debian dengan PM2

Panduan lengkap ini menjelaskan langkah demi langkah cara men-deploy aplikasi **Portal Pengumuman Hasil Seleksi (Next.js + Prisma SQLite)** pada VPS **Debian 11 / Debian 12** menggunakan **PM2**, **Nginx Reverse Proxy**, dan **SSL Gratis (Let's Encrypt)**.

---

## 📋 Prasyarat Server
- **OS**: Debian 11 (Bullseye) atau Debian 12 (Bookworm)
- **Akses**: User dengan hak `sudo` atau `root`
- **Domain/Subdomain**: Sudah diarahkan (*A Record*) ke IP Public VPS Anda (contoh: `pengumuman.domainanda.com`)

---

## 🛠️ Langkah 1: Update Sistem & Install Paket Dasar

Buka terminal SSH ke VPS Anda dan jalankan:

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

## 🟢 Langkah 2: Install Node.js LTS (Versi 20.x)

Gunakan repositori resmi NodeSource untuk menginstall Node.js versi LTS:

```bash
# Tambahkan repo NodeSource Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verifikasi instalasi
node -v
npm -v
```

---

## 📦 Langkah 3: Install PM2 Secara Global

PM2 bertugas menjaga aplikasi tetap berjalan di latar belakang (*background*) dan otomatis menyala kembali jika server reboot atau terjadi crash:

```bash
sudo npm install -g pm2
```

---

## 📂 Langkah 4: Setup Direktori Proyek

Buat folder proyek di `/var/www/pks` dan atur hak aksesnya:

```bash
sudo mkdir -p /var/www/pks
sudo chown -R $USER:$USER /var/www/pks
cd /var/www/pks
```

### Upload / Clone Kode Proyek:
**Opsi A (Menggunakan Git):**
```bash
git clone <URL_REPOSITORY_ANDA> .
```

**Opsi B (Upload via SCP dari komputer lokal):**
```bash
# Jalankan perintah ini dari terminal komputer lokal Anda:
scp -r * user@IP_VPS_ANDA:/var/www/pks/
```

---

## ⚙️ Langkah 5: Install Dependencies & Setup Database SQLite

Di dalam folder `/var/www/pks`:

```bash
cd /var/www/pks

# 1. Install semua paket dependensi
npm install

# 2. Buat file konfigurasi Environment (.env)
cat << 'EOF' > .env
DATABASE_URL="file:./dev.db"
EOF

# 3. Sinkronkan tabel SQLite dan generate Prisma Client
npx prisma db push
npx prisma generate

# 4. Inisialisasi Akun Admin Default & Data Awal
npm run db:seed
```

> **Default Akun Admin:**
> - **URL Admin:** `http://domainanda.com/admin/login`
> - **Username:** `admin`
> - **Password:** `admin` *(Segera ubah setelah login pada menu Ubah Password Admin)*

---

## 🏗️ Langkah 6: Build Aplikasi Next.js untuk Production

Jalankan perintah build untuk mengoptimasi performa aplikasi:

```bash
npm run build
```

---

## 🚀 Langkah 7: Menjalankan Aplikasi dengan PM2

Jalankan aplikasi menggunakan file konfigurasi `ecosystem.config.js` yang sudah disediakan:

```bash
# Jalankan aplikasi via PM2
pm2 start ecosystem.config.js

# Simpan daftar proses PM2
pm2 save

# Daftarkan PM2 agar otomatis start saat VPS menyala (boot/reboot)
pm2 startup
```
*(Salin dan jalankan perintah yang dicetak oleh output `pm2 startup` jika diminta)*

### Perintah Berguna PM2:
```bash
pm2 status              # Cek status aplikasi
pm2 logs pks-pengumuman # Cek log realtime / debugging error
pm2 restart pks-pengumuman # Restart aplikasi
pm2 stop pks-pengumuman    # Hentikan aplikasi
```

---

## 🌐 Langkah 8: Konfigurasi Nginx sebagai Reverse Proxy

Buat konfigurasi Nginx untuk mengarahkan traffic domain ke port `3000`:

```bash
sudo nano /etc/nginx/sites-available/pks-pengumuman
```

Tempelkan konfigurasi berikut *(ganti `pengumuman.domainanda.com` dengan domain Anda)*:

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

Simpan file (`Ctrl + O`, `Enter`, lalu `Ctrl + X`).

Aktifkan konfigurasi dan restart Nginx:
```bash
# Buat symlink ke sites-enabled
sudo ln -s /etc/nginx/sites-available/pks-pengumuman /etc/nginx/sites-enabled/

# Hapus default config jika ada
sudo rm -f /etc/nginx/sites-enabled/default

# Uji konfigurasi Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Langkah 9: Pasang SSL Gratis (HTTPS dengan Certbot)

Install Certbot untuk mengamankan portal dengan sertifikat SSL resmi:

```bash
sudo apt install -y certbot python3-certbot-nginx

# Request dan otomatis pasang sertifikat SSL
sudo certbot --nginx -d pengumuman.domainanda.com
```

- Masukkan email Anda.
- Ketik `Y` untuk menyetujui *Terms of Service*.
- Certbot akan otomatis mengonfigurasi redirect dari HTTP ke HTTPS.

---

## 🔄 Cara Melakukan Pembaruan Kode (Update Aplikasi) di Masa Depan

Jika ada perubahan fitur atau kode baru, ikuti 4 langkah cepat ini di server VPS:

```bash
cd /var/www/pks

# 1. Ambil update kode terbaru
git pull

# 2. Update dependensi & skema database jika ada perubahan
npm install
npx prisma db push

# 3. Build ulang Next.js
npm run build

# 4. Restart aplikasi di PM2
pm2 restart pks-pengumuman
```

---

## 🛡️ Tips Keamanan & Pemeliharaan Database SQLite

1. **Backup Database Rutin**:
   Database tersimpan pada file `/var/www/pks/prisma/dev.db`. Anda dapat membuat salinan cadangan kapan saja:
   ```bash
   cp /var/www/pks/prisma/dev.db /var/www/pks/prisma/dev_backup_$(date +%Y%m%d).db
   ```
2. **Monitoring Log Error**:
   Jika terjadi kendala pada website, pantau log secara langsung dengan perintah:
   ```bash
   pm2 logs pks-pengumuman --lines 100
   ```

Selamat, aplikasi Portal Pengumuman Anda telah aktif dan siap digunakan secara publik dengan performa tinggi dan keamanan penuh! 🎉
