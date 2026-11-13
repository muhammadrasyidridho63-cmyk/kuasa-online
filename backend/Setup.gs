/**
 * ============================================================================
 * E-KUASA SETUP ENVIRONMENT (setup.gs)
 * Inisialisasi Idempoten: Drive Folder + Google Spreadsheet + Seed Master Data
 * Sesuai panduan: gas-pro-api, gas-rahasia-script-properties, & gas-scale-turbo
 * ============================================================================
 */

function setupAppEnvironment() {
  const APP_NAME = 'E-KUASA PTSP Hukum Pengadilan Negeri';
  Logger.log('🚀 Memulai inisialisasi lingkungan: ' + APP_NAME);

  // 1. Siapkan Folder Google Drive
  let rootFolder;
  const existingRootId = prop_('ROOT_FOLDER_ID');
  if (existingRootId) {
    try {
      rootFolder = DriveApp.getFolderById(existingRootId);
      Logger.log('✅ Folder root Drive sudah ada: ' + rootFolder.getName());
    } catch (e) {}
  }

  if (!rootFolder) {
    rootFolder = DriveApp.createFolder('📁 ' + APP_NAME);
    rootFolder.createFolder('01_Syarat_Kuasa');
    rootFolder.createFolder('02_Bukti_PNBP');
    rootFolder.createFolder('03_Legalisasi_Sah');
    setProp_('ROOT_FOLDER_ID', rootFolder.getId());
    Logger.log('📁 Folder root Drive berhasil dibuat: ' + rootFolder.getId());
  }

  // 2. Siapkan Spreadsheet Database
  let ss;
  const existingSsId = prop_('SPREADSHEET_ID');
  if (existingSsId) {
    try {
      ss = SpreadsheetApp.openById(existingSsId);
      Logger.log('✅ Spreadsheet database sudah ada: ' + ss.getName());
    } catch (e) {}
  }

  if (!ss) {
    ss = SpreadsheetApp.create('🗃️ Database — ' + APP_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(rootFolder);
    setProp_('SPREADSHEET_ID', ss.getId());
    Logger.log('🗃️ Spreadsheet database berhasil dibuat: ' + ss.getId());
  }

  // 3. Bangkitkan Kunci Rahasia Sesi (HMAC Secret) jika belum ada
  if (!prop_('SESSION_SECRET')) {
    const rawSecret = Utilities.getUuid() + '-' + Utilities.getUuid();
    setProp_('SESSION_SECRET', rawSecret);
    Logger.log('🔒 SESSION_SECRET berhasil dibangkitkan.');
  }

  // 4. Inisialisasi Sheet & Header
  initSheetWithHeaders_(ss, 'REG_KUASA', [
    'ID_Pengajuan', 'No_Register_Resmi', 'Tanggal_Pengajuan', 'Jenis_Kuasa',
    'Nomor_Perkara', 'Posisi_Pihak', 'Nama_Pemberi_Kuasa', 'NIK_Pemberi_Kuasa',
    'Nama_Penerima_Kuasa', 'Organisasi_Advokat', 'No_HP_WA', 'Email_Pemohon',
    'URL_Syarat_KTA', 'URL_Syarat_BAS', 'URL_Syarat_KTP', 'URL_Dokumen_Kuasa',
    'URL_Bukti_PNBP', 'Kode_Billing', 'Status', 'Catatan_Petugas',
    'Tanggal_Pengesahan', 'Pejabat_Pengesah', 'Kode_Verifikasi_QR', 'URL_PDF_Legalisasi'
  ]);

  initSheetWithHeaders_(ss, 'MASTER_PEJABAT', [
    'ID_Pejabat', 'Nama_Lengkap', 'NIP', 'Jabatan', 'Status_Aktif', 'Spesimen_Paraf_URL', 'PIN_Otorisasi'
  ]);

  initSheetWithHeaders_(ss, 'MASTER_JENIS_KUASA', [
    'ID_Jenis', 'Nama_Jenis', 'Biaya_PNBP', 'Syarat_Wajib', 'Keterangan'
  ]);

  initSheetWithHeaders_(ss, 'MASTER_PENGGUNA', [
    'ID_User', 'Nama_Petugas', 'Email_Google', 'Peran', 'Status_Aktif'
  ]);

  initSheetWithHeaders_(ss, 'PENGATURAN_INSTANSI', [
    'ID_Setting', 'Nama_Pengadilan', 'Alamat', 'Pola_Nomor_Register', 'Counter_Terakhir', 'Reset_Tahunan_Otomatis', 'Redaksi_Klausul'
  ]);

  initSheetWithHeaders_(ss, 'LOG_AUDIT', [
    'Timestamp', 'Aktor_Email', 'Aktivitas', 'ID_Target', 'Detail_Perubahan'
  ]);

  initSheetWithHeaders_(ss, 'AntrianNotif', [
    'AntrianID', 'Kanal', 'Tujuan', 'NamaPenerima', 'Subjek', 'Pesan', 'Event', 'RefID', 'BlastID', 'Status', 'Percobaan', 'Respon', 'DibuatPada', 'DikirimPada'
  ]);

  initSheetWithHeaders_(ss, 'CRM_Kontak', [
    'KontakID', 'Nama', 'Email', 'NoWA', 'Segmen', 'Sumber', 'RefID', 'Tag', 'StatusWA', 'CekWAAt', 'EmailValid', 'OptOut', 'Catatan', 'JumlahPesan', 'TerakhirDihubungi', 'Info', 'DibuatPada', 'DiperbaruiPada'
  ]);

  // 5. Inisialisasi Data Awal (Seed Data) jika masih kosong
  seedInitialData_(ss);

  Logger.log('🎉 Setup selesai sempurna! Seluruh sheet, folder, dan konfigurasi telah siap digunakan.');
}

function initSheetWithHeaders_(ss, sheetName, headers) {
  let sh = ss.getSheetByName(sheetName);
  if (!sh) {
    sh = ss.insertSheet(sheetName);
  }
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#064e3b').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
}

function seedInitialData_(ss) {
  // A. Seed Pejabat Penanda Tangan
  const shPejabat = ss.getSheetByName('MASTER_PEJABAT');
  if (shPejabat.getLastRow() <= 1) {
    shPejabat.appendRow([
      'PJB-001', 'Siti Rahayu, S.H.', '19780512 200212 2 001', 'Panitera Muda Hukum', 'Ya', '', '123456'
    ]);
    shPejabat.appendRow([
      'PJB-002', 'Drs. H. Mulyadi, S.H., M.H.', '19690315 199403 1 002', 'Panitera Pengadilan Negeri', 'Cadangan', '', '123456'
    ]);
    shPejabat.appendRow([
      'PJB-003', 'Ahmad Fauzi, S.H.', '19850928 200801 1 005', 'Panitera Pengganti (Plt Panmud)', 'Tidak', '', '123456'
    ]);
  }

  // B. Seed Jenis Layanan Kuasa
  const shJenis = ss.getSheetByName('MASTER_JENIS_KUASA');
  if (shJenis.getLastRow() <= 1) {
    shJenis.appendRow(['JNS-01', 'Kuasa Khusus Advokat', 10000, 'KTA, BAS, KTP, Surat Kuasa Asli', 'Mengacu pada SEMA No. 6 Tahun 1994']);
    shJenis.appendRow(['JNS-02', 'Kuasa Insidentil (Keluarga)', 10000, 'KTP Para Pihak, Surat Izin Ketua PN, Surat Kuasa', 'Wajib izin Ketua Pengadilan']);
    shJenis.appendRow(['JNS-03', 'Jaksa Pengacara Negara (JPN)', 10000, 'Surat Kuasa Khusus / SKK, Surat Tugas Kejaksaan', 'Mewakili Instansi Pemerintah']);
  }

  // C. Seed Pengaturan Instansi & Format Register
  const shInstansi = ss.getSheetByName('PENGATURAN_INSTANSI');
  if (shInstansi.getLastRow() <= 1) {
    shInstansi.appendRow([
      'SET-001',
      'PENGADILAN NEGERI KELAS I A KHUSUS BANDUNG',
      'Jl. L.L.R.E. Martadinata No. 74-80, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
      '{NO}/HK.02/SK/{BULAN_ROMAWI}/{TAHUN}/PN.Bdg',
      141, // Counter terakhir
      'Ya',
      'Surat Kuasa ini telah diteliti keaslian serta kelengkapan administratifnya dan dinyatakan memenuhi syarat formil beracara sesuai SEMA No. 6 Tahun 1994 jo. PERMA No. 7 Tahun 2022.'
    ]);
  }

  // D. Seed Data Sampel Transaksi di REG_KUASA
  const shReg = ss.getSheetByName('REG_KUASA');
  if (shReg.getLastRow() <= 1) {
    shReg.appendRow([
      'EKU-20261113-0042',
      '142/HK.02/SK/XI/2026/PN.Bdg',
      '2026-11-13 08:30:00',
      'Kuasa Khusus Advokat',
      '45/Pdt.G/2026/PN.Bdg',
      'Penggugat',
      'PT Graha Abadi Sentosa / Ir. H. Bambang Soeprapto',
      '3273012998750003',
      'Faisal Hendrawan, S.H., M.H.',
      'PERADI',
      '081298421100',
      'faisal.law@lawyer.id',
      '', '', '', '', '',
      '982736182901',
      'Terdaftar & Sah',
      'KTA dan BAS diverifikasi aktif. Setoran PNBP lunas.',
      '2026-11-13 08:45:12',
      'Siti Rahayu, S.H. (Panitera Muda Hukum)',
      '7f89ce06a4103b7d80f002ac16e40208dcb921',
      ''
    ]);
    shReg.appendRow([
      'EKU-20261113-0043',
      '',
      '2026-11-13 08:40:00',
      'Kuasa Insidentil (Keluarga)',
      '112/Pdt.P/2026/PN.Bdg',
      'Pemohon',
      'Bambang Sutejo',
      '3273012998750014',
      'Drs. Eko Prasetyo, M.M.',
      '-',
      '081399887766',
      'eko.prasetyo@email.com',
      '', '', '', '', '',
      '982736182902',
      'Siap Disahkan',
      'Surat Izin Ketua PN terlampir lengkap.',
      '', '', '', ''
    ]);
    shReg.appendRow([
      'EKU-20261113-0044',
      '',
      '2026-11-13 08:50:00',
      'Kuasa Khusus Advokat',
      '32/Pdt.G/2026/PN.Bdg',
      'Penggugat',
      'Dinas Bina Marga & Tata Ruang',
      '3273012998750025',
      'Gunawan Santoso, S.H.',
      'KAI',
      '081233445566',
      'gunawan.legal@email.com',
      '', '', '', '', '',
      '982736182903',
      'Perlu Perbaikan',
      'Catatan: Masa berlaku KTA Advokat habis (Desember 2025). Harap perbarui KTA atau lampirkan tanda perpanjangan resmi.',
      '', '', '', ''
    ]);
  }
}
