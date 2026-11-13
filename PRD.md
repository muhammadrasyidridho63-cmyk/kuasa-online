# PRD (Product Requirements Document)
# E-KUASA: Sistem Informasi Pendaftaran & Legalisasi Surat Kuasa Elektronik

---

## 1. Judul & Ringkasan Eksekutif

- **Nama Sistem**: **E-KUASA** (*Sistem Informasi Pendaftaran & Legalisasi Surat Kuasa Elektronik*)
- **Platform**: Web Application berbasis **Google Apps Script (GAS)**, **Google Sheets**, dan **Google Drive**.
- **Ringkasan Eksekutif**:  
  E-KUASA adalah aplikasi layanan publik digital mandiri (PTSP Online Kepaniteraan Hukum Pengadilan) yang memfasilitasi pengajuan, pemeriksaan kelengkapan berkas syarat kuasa, validasi penyetoran PNBP elektronik (Rp10.000), penomoran register otomatis bebas konflik, hingga penerbitan lembar akta legalisasi kuasa digital ber-QR Code verifikasi resmi. Sistem ini memangkas antrean fisik di gedung pengadilan, menghapus ketergantungan pada buku register manual, mencegah keterlambatan verifikasi *legal standing* menjelang sidang, serta menyediakan portal pengaturan terpusat berbasis **CRUD** penuh bagi pengelola.

---

## 2. Tujuan Produk & Nilai Bisnis

1. **Eliminasi Ketergantungan Fisik & Antrean PTSP**: Advokat, Jaksa Pengacara Negara (JPN), maupun Pemohon Insidentil dapat mendaftarkan surat kuasa dari mana saja tanpa harus hadir secara fisik ke meja PTSP sebelum persidangan.
2. **Digitalisasi Buku Register & Audit Trail**: Menggantikan pencatatan buku register kertas dengan database spreadsheet terstruktur, mencegah berkas tercecer, dan menyediakan rekaman waktu pengesahan yang akuntabel.
3. **Pemeriksaan Cepat di Ruang Sidang (*Zero-Delay Verification*)**: Majelis Hakim dan Panitera Pengganti (PP) dapat memvalidasi keabsahan surat kuasa secara instan cukup dengan memindai (*scan*) QR Code pada lembar kuasa menggunakan kamera ponsel/tablet tanpa perlu login.
4. **Transparansi & Akuntabilitas PNBP**: Memastikan setiap nomor register yang terbit telah diverifikasi bukti setor PNBP elektronik ke kas negara secara sistematis.
5. **Kemudahan Manajemen Mandiri (Full CRUD Master Data)**: Pengelola pengadilan dapat memperbarui pejabat penanda tangan, tarif, kategori kuasa, dan format nomor register secara mandiri lewat dashboard tanpa menyentuh kode program.

---

## 3. Pengguna Target & Matriks Hak Akses (RBAC)

| Peran Pengguna | Deskripsi Pengguna | Hak Akses Utama |
| :--- | :--- | :--- |
| **Pemohon / Kuasa Hukum** | Advokat, Kuasa Insidentil, JPN, Biro Hukum Instansi, Masyarakat | Mengisi form permohonan, mengunggah syarat (KTA/BAS/KTP/Surat Kuasa) & slip PNBP, melacak status pengajuan real-time, dan mengunduh lembar legalisasi sah ber-QR. |
| **Petugas Verifikator PTSP** | Staf Kepaniteraan Hukum Meja PTSP | Memeriksa berkas permohonan, memvalidasi bukti setor PNBP Rp10.000, memberi catatan revisi, dan meneruskan berkas valid ke meja Panitera. |
| **Panitera / Panmud Hukum (Approver)** | Pejabat penanda tangan / pengesah akta kuasa | Meninjau berkas yang lolos verifikasi, otorisasi pengesahan via PIN/Passkey TTE, penerbitan Nomor Register resmi, dan penandatanganan elektronik lembar pengesahan. |
| **Super Admin / Pengelola Sistem** | Penanggung jawab TI / Kasubbag PTIP / Admin PTSP | Akses penuh ke seluruh data, mengelola Dashboard CRUD Pengaturan (Pejabat, Pengguna Staf, Kategori Kuasa, Format Penomoran, Redaksi/Kop), serta melihat log audit. |
| **Publik / Majelis Hakim / PP (Verifier)** | Hakim & Panitera Pengganti di persidangan / Pihak Lawan | Memindai QR Code pada fisik lembar legalisasi surat kuasa untuk membuka halaman validasi resmi (*read-only*) tanpa memerlukan akun login. |

---

## 4. Arsitektur Data & Integrasi Ekosistem Google Workspace

### 4.1. Skema Database Google Sheets

#### A. Tabel Transaksi: `REG_KUASA`
| Kolom | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `ID_Pengajuan` | String (Unique) | Primary Key (Format: `EKU-YYYYMMDD-XXXX`) |
| `No_Register_Resmi` | String | Nomor register sah (diterbitkan saat disahkan oleh Panitera) |
| `Tanggal_Pengajuan` | Datetime | Waktu permohonan dikirim |
| `Jenis_Kuasa` | String | Referensi dari `MASTER_JENIS_KUASA` |
| `Nomor_Perkara` | String | Contoh: `123/Pdt.G/2026/PN.Bdg` (opsional jika belum daftar perkara) |
| `Posisi_Pihak` | String | Penggugat / Tergugat / Pemohon / Termohon / Turut Tergugat |
| `Nama_Pemberi_Kuasa` | String | Nama pihak pemberi kuasa |
| `NIK_Pemberi_Kuasa` | String | Nomor KTP pemberi kuasa |
| `Nama_Penerima_Kuasa`| String | Nama Advokat / Kuasa Insidentil / Jaksa Pengacara Negara |
| `Organisasi_Advokat` | String | Peradi / KAI / Ikadin / dsb. (jika advokat) |
| `No_HP_WA` | String | Kontak WhatsApp aktif untuk konfirmasi |
| `Email_Pemohon` | String | Email untuk pengiriman salinan dokumen |
| `URL_Syarat_KTA` | String (URL) | Link berkas KTA di Google Drive |
| `URL_Syarat_BAS` | String (URL) | Link berkas Berita Acara Sumpah di Google Drive |
| `URL_Syarat_KTP` | String (URL) | Link KTP Pemberi & Penerima Kuasa |
| `URL_Dokumen_Kuasa` | String (URL) | Link file draf/scan surat kuasa bermeterai asli |
| `URL_Bukti_PNBP` | String (URL) | Link bukti setor / bukti billing PNBP |
| `Kode_Billing` | String | Nomor NTPN / Kode Billing Simponi |
| `Status` | String | `Menunggu Verifikasi`, `Perlu Perbaikan`, `Siap Disahkan`, `Terdaftar & Sah`, `Ditolak` |
| `Catatan_Petugas` | Text | Catatan revisi jika berkas tidak lengkap |
| `Tanggal_Pengesahan` | Datetime | Waktu persetujuan oleh Panitera |
| `Pejabat_Pengesah` | String | Nama & NIP Panitera / Panmud Hukum yang menandatangani |
| `Kode_Verifikasi_QR`| String (Hash) | Unique verification hash / token validasi anti-pemalsuan |
| `URL_PDF_Legalisasi`| String (URL) | Dokumen resmi PDF lembar legalisasi akta kuasa ber-QR |

#### B. Tabel Master Data (CRUD Enabled):
1. **`MASTER_PEJABAT`**: `ID_Pejabat`, `Nama_Lengkap`, `NIP`, `Jabatan` (Panitera / Panmud Hukum / Plt / Plh), `Status_Aktif` (*Ya/Tidak*), `Spesimen_Cap_URL`, `PIN_Otorisasi_Hash`.
2. **`MASTER_JENIS_KUASA`**: `ID_Jenis`, `Nama_Jenis` (Advokat, Kuasa Insidentil, Jaksa Pengacara Negara, Kuasa Direksi/Badan Hukum), `Biaya_PNBP` (Default: Rp10.000), `Syarat_Wajib` (Daftar dokumen wajib).
3. **`MASTER_PENGGUNA`**: `ID_User`, `Nama_Petugas`, `Email_Google`, `Peran` (*Admin, Verifikator_PTSP, Approver_Panitera*), `Status_Aktif`.
4. **`PENGATURAN_INSTANSI`**: `ID_Setting`, `Nama_Pengadilan`, `Alamat`, `Logo_URL`, `Pola_Nomor_Register` (misal: `{NO}/HK.02/SK/{BULAN_ROMAWI}/{TAHUN}/PN.Bdg`), `Counter_Terakhir`, `Reset_Tahunan_Otomatis` (*Ya/Tidak*), `Redaksi_Klausul_Legalisasi`.
5. **`LOG_AUDIT`**: `Timestamp`, `Aktor_Email`, `Aktivitas` (Create/Update/Verify/Approve/Delete), `ID_Target`, `Detail_Perubahan`.

### 4.2. Arsitektur Penyimpanan Berkas Google Drive
Struktur folder otomatis dibuat di dalam Google Drive:
```text
[Root Folder: E-KUASA_STORAGE]
  ├── 01_Syarat_Kuasa/      --> Berkas KTA, BAS, KTP, dan Draf Surat Kuasa
  ├── 02_Bukti_PNBP/        --> Slip setoran / tangkapan layar e-Billing PNBP
  └── 03_Legalisasi_Sah/    --> Arsip PDF Akta Legalisasi Kuasa resmi ber-QR Code
```

### 4.3. Layanan Otomatisasi Terintegrasi
- **Gmail Service**: Notifikasi email otomatis kepada pemohon saat berkas perlu perbaikan (beserta rincian kekurangan) dan saat surat kuasa berhasil disahkan (dilampiri PDF legalisasi).
- **Mesin Dokumen & Generator QR Code**: Pembuatan lembar penetapan legalisasi akta kuasa berbasis HTML to PDF dengan sematan QR Code ber-HMAC yang mengarah langsung ke URL verifikasi publik instansi.

---

## 5. Persyaratan Fungsional

### 5.1. Alur Kerja Sistem (Workflow)
```text
[Pemohon Isi Form & Upload Berkas]
           │
           ▼
[Verifikator PTSP Periksa Syarat & PNBP]
     ├── (Tidak Lengkap) ──> [Status: Perlu Perbaikan] ──> (Pemohon Revisi via Link)
     └── (Lengkap & Sah) ──> [Status: Siap Disahkan]
                                     │
                                     ▼
                      [Panitera Input PIN TTE]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    [Nomor Register Terbit]              [Generate PDF Ber-QR Code]
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
           [Status: Terdaftar & Sah] ──> [Kirim Email ke Pemohon]
                                     │
                                     ▼
                [Majelis Hakim Scan QR di Ruang Sidang]
```

### 5.2. Fitur Modul Antarmuka

#### 1. Portal Mandiri Pemohon (Publik)
- Form registrasi pengajuan step-by-step: Identitas Pihak, Data Penerima Kuasa, Nomor Perkara, Upload Berkas Syarat, dan Upload Bukti Bayar PNBP Rp10.000.
- Pencarian status (*Live Tracker*) menggunakan ID Pengajuan atau Nomor WhatsApp.
- Pratinjau & Tombol Unduh Lembar Legalisasi Resmi (format PDF ber-QR Code).

#### 2. Meja Kerja Verifikator PTSP
- Tabel antrean pengajuan real-time dengan status badge (*Menunggu Verifikasi, Perlu Perbaikan, Siap Disahkan*).
- *Inline Document Viewer* untuk memeriksa KTA, BAS, surat kuasa, dan bukti setor PNBP tanpa harus mengunduh file satu per satu.
- Tombol aksi:
  - **Loloskan**: Mengubah status menjadi *Siap Disahkan* dan mengirim notifikasi ke antrean Panitera.
  - **Minta Perbaikan**: Membuka modal input catatan perbaikan (misal: "KTA kedaluwarsa" / "Bukti PNBP belum terbaca"), sistem otomatis mengirim notifikasi revisi ke pemohon.

#### 3. Ruang Kerja Panitera / Panmud Hukum (Approver)
- Antrean khusus berkas yang telah dinyatakan valid oleh Verifikator.
- Fitur *Single-Click Approval* atau *Batch Approval* yang dilindungi dialog input **PIN Otorisasi TTE**.
- Generator Otomatis:
  - Pengambilan nomor urut register berikutnya secara aman (*concurrency-safe*).
  - Pembubuhan stempel dinas dan spesimen paraf digital pejabat aktif.
  - Penciptaan lembar pengesahan resmi ber-QR Code unik.

#### 4. Dashboard Pusat Pengaturan (Full CRUD Master Data)
Menu terintegrasi pada panel internal untuk mengelola seluruh data master:
- **CRUD Pejabat Penanda Tangan**: Tambah, edit, nonaktifkan Panitera/Panmud Hukum, tentukan pejabat aktif harian, dan reset PIN otorisasi.
- **CRUD Jenis Layanan Kuasa**: Kelola kategori kuasa (Advokat, Insidentil, JPN), biaya PNBP, dan daftar dokumen syarat wajib.
- **CRUD Staf & Pengguna**: Manajemen hak akses staf verifikator PTSP dan administrator.
- **Pengaturan Format Penomoran**: Sesuaikan pola penomoran surat kuasa, kode klasifikasi perkara, dan setel ulang counter manual/tahunan.
- **Kustomisasi Kop & Klausul**: Edit langsung nama pengadilan, alamat, logo dinas, dan kalimat redaksi legalisasi akta kuasa tanpa edit kodingan.

#### 5. Dashboard Laporan, Statistik & Arsip
- **Ringkasan KPI Card**:
  - Total Permohonan Bulan Ini
  - Menunggu Verifikasi PTSP
  - Menunggu Pengesahan Panitera
  - Total Surat Kuasa Terdaftar
  - Akumulasi Setoran PNBP Terverifikasi (Rp)
- **Grafik Tren & Distribusi**:
  - Grafik tren pengajuan per minggu/bulan.
  - Diagram lingkaran proporsi jenis kuasa (Advokat vs Insidentil vs JPN).
- **Filter Data Lanjutan**: Filter berdasarkan rentang tanggal, status, jenis kuasa, nama advokat, atau nomor perkara.
- **Fitur Ekspor**:
  - **Export to Excel (.xlsx / .csv)** untuk rekonsiliasi data keuangan PNBP.
  - **Cetak Buku Register Surat Kuasa (PDF)** dengan format standar buku register Kepaniteraan Hukum Pengadilan.

#### 6. Portal Validasi QR Code Publik (Untuk Ruang Sidang)
- Halaman kilat mobile-friendly yang langsung terbuka saat QR Code pada lembar surat kuasa dipindai oleh Majelis Hakim, Panitera Pengganti, atau pihak lawan.
- Menampilkan status keabsahan: **"DOKUMEN RESMI TERDAFTAR DI PENGADILAN"** disertai Nomor Register, Tanggal Disahkan, Nama Pejabat Pengesah, Nama Para Pihak, dan link berkas salinan resmi untuk mencocokkan fisik surat kuasa di persidangan.

---

## 6. Batasan Teknis & Mitigasi Kuota Google Apps Script

1. **Pencegahan Nomor Ganda (Concurrency Safety)**: Menggunakan `LockService.getScriptLock()` saat proses penerbitan Nomor Register Kuasa. Hal ini menjamin tidak ada dua berkas yang mendapatkan nomor register yang sama meskipun disahkan bersamaan.
2. **Pemuatan Berkas Cepat & Limit Payload**: File unggahan (KTA/BAS/Slip PNBP) dikompresi di sisi browser (*client-side*) sebelum dikirim ke Google Drive via GAS untuk menghindari *exceeded payload size limit*.
3. **Bebas Lag & Batas Eksekusi 6 Menit**:
   - Operasi baca data master dan status pelacakan dioptimalkan menggunakan `CacheService` sehingga respon halaman verifikasi di ruang sidang terbuka di bawah 1 detik (*sub-second*).
   - Pengolahan data tabular menggunakan pembacaan *batch* (`getValues()` / `setValues()`), menghindari pemanggilan API spreadsheet di dalam loop.
4. **Keamanan Master CRUD**: Setiap fungsi mutasi data master di sisi server memvalidasi identitas sesi email login pengguna terdaftar dalam `MASTER_PENGGUNA` dengan role Admin.

---

## 7. Spesifikasi Tampilan & Antarmuka (UI/UX)

- **Gaya Desain**: *Modern Institutional / Official Court Portal* (perpaduan nuansa resmi kedinasan dan kepraktisan aplikasi modern).
- **Palet Warna**:
  - **Warna Utama (Primary)**: Emerald Green / Deep Forest Green khas Mahkamah Agung (`#0A5C36` / `#064E3B`) berpadu Navy Deep Blue (`#0F172A`).
  - **Warna Aksen**: Gold / Amber (`#D97706` / `#F59E0B`) untuk highlight nomor register dan status resmi.
  - **Latar Belakang & Netral**: Pure White (`#FFFFFF`), Soft Slate Grey (`#F8FAFC` & `#F1F5F9`) untuk kartu dan panel kerja.
  - **Indikator Status**:
    - Hijau Emerald: *Terdaftar & Sah*
    - Kuning Amber: *Menunggu Verifikasi / TTE*
    - Merah Crimson: *Ditolak / Perlu Perbaikan*
- **Tipografi**: Inter / Plus Jakarta Sans (bersih, tajam, mudah dibaca pada layar ponsel maupun monitor sidang).
- **Layout**:
  - *Mobile-First* untuk form pemohon dan halaman scan QR verifikasi sidang.
  - *Desktop / Tablet Optimized* dengan sidebar intuitif untuk Meja Verifikator PTSP, Meja Panitera, Dashboard CRUD Pengaturan, dan Laporan.

---

## 8. Rencana Deployment & Tahapan Pengujian

1. **Tahap 1: Setup Spreadsheet & Google Drive**
   - Pembuatan file Google Sheets dengan sheet `REG_KUASA`, tabel master, dan struktur subfolder Google Drive.
2. **Tahap 2: Pengujian Backend & Engine Nomor Otomatis**
   - Verifikasi fungsi penomoran counter dengan `LockService` dan pembuatan QR Code HMAC.
3. **Tahap 3: Implementasi UI Frontend (SPA GAS)**
   - Pembuatan modul form pemohon, panel verifikator, panel approver, dan pusat pengaturan CRUD.
4. **Tahap 4: Pengujian Terpadu (*End-to-End Test*)**
   - Simulasi alur lengkap: Pengajuan -> Verifikasi PNBP -> Approval Panitera -> Terbit PDF -> Pemindaian QR di ruang sidang.
5. **Tahap 5: Deployment Produksi**
   - Publish Google Apps Script sebagai Web App (*Execute as: Me*, *Who has access: Anyone*).

---

🎨 **Tahapan Khusus: Penentuan Visual UI/UX**
1. Unggah Referensi: Silakan unggah referensi tangkapan layar, warna, dan gaya antarmuka yang diinginkan.
2. Jika Belum Ada Referensi Visual:
   - Salin seluruh teks dokumen PRD Final di atas.
   - Buka Google Stitch, lalu tempelkan teks PRD ke dalamnya.
   - Unduh hasil pratinjau desain visual yang dihasilkan oleh Google Stitch.
   - Unggah gambar hasil desain tersebut ke percakapan ini untuk diimplementasikan ke dalam kode HTML/CSS.
