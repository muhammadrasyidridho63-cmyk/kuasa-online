# 🏛️ Panduan Deployment Aplikasi E-KUASA
### Sistem Informasi Pendaftaran & Legalisasi Surat Kuasa Elektronik Pengadilan Negeri

Aplikasi **E-KUASA** menggunakan arsitektur modern:
- **Frontend**: Single Page Application (SPA) + Progressive Web App (PWA) statis yang siap dideploy ke **GitHub Pages** (bebas biaya hosting, tanpa iframe, sangat cepat).
- **Backend**: **Google Apps Script (GAS)** sebagai pure REST API JSON yang terhubung langsung ke **Google Sheets** (database) dan **Google Drive** (penyimpanan berkas berkas kuasa, bukti PNBP, dan arsip PDF akta resmi).

---

## 📑 Daftar Isi
1. [Struktur Berkas Proyek](#1-struktur-berkas-proyek)
2. [Langkah 1: Setup Backend Google Apps Script](#2-langkah-1-setup-backend-google-apps-script)
3. [Langkah 2: Menghubungkan Frontend ke Backend](#3-langkah-2-menghubungkan-frontend-ke-backend)
4. [Langkah 3: Konfigurasi Notifikasi WhatsApp (Opsional Fonnte)](#4-langkah-3-konfigurasi-notifikasi-whatsapp-opsional-fonnte)
5. [Langkah 4: Deploy Frontend ke GitHub Pages](#5-langkah-4-deploy-frontend-ke-github-pages)
6. [Langkah 5: Pengujian Terpadu (End-to-End Test)](#6-langkah-5-pengujian-terpadu-end-to-end-test)

---

## 1. Struktur Berkas Proyek

```text
📁 2. Surat Kuasa online/
  ├── 📄 index.html              --> Antarmuka SPA Utama (Portal Publik, PTSP, Panitera TTE, CRUD Settings)
  ├── 📄 manifest.json           --> Identitas PWA (Installable di HP & Desktop)
  ├── 📄 sw.js                   --> Service Worker untuk caching offline & respons cepat
  ├── 📁 css/
  │    └── 📄 custom.css         --> Styling print dokumen pengadilan, animasi, scrollbar
  ├── 📁 js/
  │    ├── 📄 config.js          --> Konfigurasi URL Web App GAS
  │    └── 📄 app.js             --> Mesin logika reaktif frontend (SWR, 0ms tab switching, CRUD)
  ├── 📁 backend/
  │    ├── 📄 Kode.gs            --> Entry point REST API (doGet, doPost, CacheX, LockService)
  │    ├── 📄 Setup.gs           --> Setup idempoten Drive, Spreadsheet, dan seed master data
  │    ├── 📄 DocEngine.gs       --> Generator Lembar Akta Legalisasi PDF ber-QR Code HMAC
  │    ├── 📄 NotifikasiWA.gs    --> Modul antrean WhatsApp Fonnte & Email non-blocking
  │    └── 📄 Migrasi.gs         --> Utilitas migrasi & sinkronisasi antar-spreadsheet
  ├── 📄 PRD.md                  --> Dokumen Product Requirements resmi
  └── 📄 DEPLOYMENT_GUIDE.md     --> Panduan deployment ini
```

---

## 2. Langkah 1: Setup Backend Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/) menggunakan akun Google kedinasan / admin pengadilan.
2. Klik tombol **Proyek Baru** (*New Project*). Beri nama proyek: `Backend E-KUASA PTSP Hukum`.
3. Buat file-file skrip di editor Apps Script dengan menekan ikon **+** di samping tulisan *Files*:
   - Ganti isi `Code.gs` dengan seluruh isi dari file [`backend/Kode.gs`](backend/Kode.gs).
   - Buat file `Setup.gs`, salin seluruh isi dari [`backend/Setup.gs`](backend/Setup.gs).
   - Buat file `DocEngine.gs`, salin seluruh isi dari [`backend/DocEngine.gs`](backend/DocEngine.gs).
   - Buat file `NotifikasiWA.gs`, salin seluruh isi dari [`backend/NotifikasiWA.gs`](backend/NotifikasiWA.gs).
   - Buat file `Migrasi.gs`, salin seluruh isi dari [`backend/Migrasi.gs`](backend/Migrasi.gs).
4. **Jalankan Fungsi Setup Sekali**:
   - Pada dropdown pilihan fungsi di atas editor, pilih `setupAppEnvironment`.
   - Klik **Jalankan** (*Run*).
   - Berikan izin otorisasi Google (*Review permissions* > pilih akun Anda > *Advanced* > *Go to Backend E-KUASA* > *Allow*).
   - Sistem akan otomatis membuat:
     - Folder utama Google Drive: `📁 E-KUASA PTSP Hukum Pengadilan Negeri` beserta 3 subfolder (`01_Syarat_Kuasa`, `02_Bukti_PNBP`, `03_Legalisasi_Sah`).
     - Spreadsheet Database lengkap dengan 8 sheet dan data awal (Siti Rahayu, S.H., format nomor register, tarif PNBP Rp10.000).
5. **Deploy sebagai Web App**:
   - Di pojok kanan atas, klik tombol **Terapkan** (*Deploy*) > **Penerapan Baru** (*New Deployment*).
   - Klik ikon gerigi (⚙️) di sebelah *Select type* > pilih **Aplikasi Web** (*Web App*).
   - Atur parameter berikut:
     - **Deskripsi**: `Versi Produksi 1.0`
     - **Jalankan sebagai** (*Execute as*): **Saya** (*Me / email Anda*)
     - **Siapa yang memiliki akses** (*Who has access*): **Siapa saja** (*Anyone*) *(Wajib agar pemohon publik dan Majelis Hakim dapat memverifikasi QR Code tanpa terhalang login Google)*.
   - Klik **Terapkan** (*Deploy*).
   - Salin **URL Aplikasi Web** yang muncul (berakhiran `/exec`).

---

## 3. Langkah 2: Menghubungkan Frontend ke Backend

1. Buka file [`js/config.js`](js/config.js) di komputer Anda.
2. Tempelkan URL yang Anda salin dari langkah sebelumnya ke variabel `GAS_URL`:
   ```javascript
   const APP_CONFIG = {
     // Contoh:
     GAS_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
     ...
   };
   ```
3. Simpan file `js/config.js`.

> **Catatan Mode Uji Coba (Demo Mode):**  
> Jika `GAS_URL` dibiarkan kosong (`''`), aplikasi akan otomatis berjalan dalam **Interactive Demo Mode** dengan seluruh data dummy realistis Pengadilan Negeri Bandung sehingga Anda dapat mendemokan dan menguji coba seluruh tombol, tab, modal, checklist verifikator, PIN TTE, hingga cetak akta tanpa perlu koneksi internet.

---

## 4. Langkah 3: Konfigurasi Notifikasi WhatsApp (Opsional Fonnte)

Jika pengadilan Anda menggunakan gateway WhatsApp Fonnte:
1. Di editor Google Apps Script, buka menu **Setelan Proyek** (ikon gerigi di bilah kiri).
2. Gulir ke bawah ke bagian **Properti Skrip** (*Script Properties*).
3. Klik **Tambahkan properti skrip**:
   - Properti: `FONNTE_TOKEN`
   - Nilai: *[Token API Fonnte Anda]*
4. Klik **Simpan properti skrip**.
5. Pasang pemicu waktu (*Trigger*) agar antrean notifikasi terkirim otomatis:
   - Klik menu **Pemicu** (ikon jam di bilah kiri) > **Tambahkan Pemicu**.
   - Fungsi yang dijalankan: `prosesAntreanNotifikasi`.
   - Sumber acara: **Berdasarkan waktu** (*Time-driven*).
   - Jenis timer: **Timer menit** (*Minutes timer*) > **Setiap 1 menit**.
   - Klik **Simpan**.

---

## 5. Langkah 4: Deploy Frontend ke GitHub Pages

Frontend adalah file web statis murni yang dapat dihosting secara gratis dan aman di GitHub Pages:

### A. Melalui Terminal Git
1. Buka terminal (PowerShell atau Command Prompt) pada direktori proyek ini:
   ```powershell
   cd "c:\Users\Asus\Downloads\Aplikasi\2. Surat Kuasa online"
   ```
2. Inisialisasi repositori Git dan buat commit awal:
   ```powershell
   git init
   git add .
   git commit -m "feat: inisialisasi aplikasi E-KUASA PTSP Hukum"
   ```
3. Buat repositori baru di akun GitHub Anda (misalnya diberi nama: `e-kuasa-online`).
4. Tautkan repositori lokal ke GitHub:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/[username-anda]/e-kuasa-online.git
   git push -u origin main
   ```

### B. Mengaktifkan GitHub Pages
1. Buka halaman repositori di browser GitHub: `https://github.com/[username-anda]/e-kuasa-online`.
2. Klik menu **Settings** > bilah samping **Pages**.
3. Pada bagian **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: pilih **main** dan folder **/(root)**.
   - Klik **Save**.
4. Tunggu sekitar 1-2 menit, lalu refresh halaman. URL aplikasi Anda akan muncul:  
   👉 `https://[username-anda].github.io/e-kuasa-online/`

---

## 6. Langkah 5: Pengujian Terpadu (End-to-End Test)

Untuk memastikan seluruh modul berfungsi sempurna, lakukan simulasi skenario berikut:

1. **Alur Pendaftaran Pemohon (Portal Publik)**:
   - Buka aplikasi web.
   - Pada halaman **Portal Publik**, isi formulir 4 langkah: Data Perkara -> Data Advokat -> Upload Dokumen -> Masukkan Kode Billing PNBP.
   - Klik **Kirim Permohonan Legalisasi**.
   - Perhatikan notifikasi toast hijau dan catat Nomor Tiket (misal: `EKU-20261113-XXXX`).
2. **Alur Lacak Status**:
   - Masuk ke tab **Lacak & Unduh**, cari dengan nomor tiket yang baru dibuat. Status awal: `Menunggu Verifikasi`.
3. **Alur Pemeriksaan Meja Verifikator PTSP**:
   - Masuk ke tab **Meja Verifikator PTSP**.
   - Berkas baru akan muncul di daftar antrean kiri. Klik berkas tersebut.
   - Periksa dokumen di peninjau sebelah kanan (KTA, BAS, Meterai, Slip PNBP).
   - Centang checklist validasi, lalu klik **Loloskan & Teruskan ke Panitera**.
4. **Alur Pengesahan & TTE Panitera Muda Hukum**:
   - Masuk ke tab **Otorisasi Panitera**.
   - Berkas yang telah lolos verifikasi akan berada di antrean siap disahkan.
   - Masukkan 6-digit PIN Otorisasi: `123456`.
   - Klik **Sahkan & Bubuhkan Tanda Tangan Elektronik**.
   - Sistem akan menerbitkan Nomor Register resmi bebas bentrok (misal: `143/HK.02/SK/XI/2026/PN.Bdg`) dan membubuhkan stempel TTE BSrE.
5. **Alur Pengujian Sidang (Scan QR Code)**:
   - Klik tombol **Scan QR Sidang** di pojok kanan atas navbar.
   - Tampilan akan langsung berganti ke antarmuka kilat mobile ruang sidang, menampilkan status: **"DOKUMEN RESMI TERDAFTAR - KEABSAHAN TERKONFIRMASI 100% DI PERSIDANGAN"**.
6. **Alur Pengujian Mode Rules & Matriks Izin (RBAC)**:
   - Di navbar bagian kanan atas, klik dropdown **Peran**.
   - Coba ganti peran menjadi **"👤 Pemohon Publik / Advokat"**.
   - Perhatikan bahwa menu internal (Meja Verifikator, Otorisasi Panitera, Pengaturan Master) otomatis dibatasi atau menampilkan halaman pemberitahuan **"Akses Terbatas: Menu Dibatasi oleh Rules Sistem"**.
   - Beralih kembali ke **"👑 Super Admin"**.
   - Buka tab **Pengaturan Master** > sub-tab **"Aturan & Kebijakan Dashboard"**.
   - Anda dapat menyalakan/mematikan aturan seperti: Wajib Setoran PNBP, Alur Verifikasi Dua Lapis, Proteksi PIN TTE, batas waktu perbaikan berkas, dan Mode Pemeliharaan.
   - Buka sub-tab **"Matriks Izin Role (RBAC)"** untuk menyesuaikan hak akses per menu bagi setiap peran.
   - Buka sub-tab **"Manajemen Pengguna Staf"** untuk menambah atau menonaktifkan akun staf internal.

7. **Alur Pusat Pengaturan (Master CRUD & Format Register)**:
   - Masuk ke tab **Pengaturan Master** > sub-tab **Pejabat Penanda Tangan**.
   - Tambah pejabat penanda tangan baru lewat tombol **+ Tambah Pejabat Baru**.
   - Masuk ke sub-tab **Format Nomor Register** untuk menyesuaikan pola penomoran register dan amati live preview penomoran akta.

8. **Alur Ekspor Buku Register**:
   - Masuk ke tab **Buku Register & Statistik**.
   - Klik **Ekspor CSV/Excel** untuk mengunduh rekapitulasi data pendaftaran ke file spreadsheet.
