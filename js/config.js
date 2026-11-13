// ==========================================================================
// E-KUASA CONFIGURATION
// ==========================================================================
// Tempelkan URL Web App Google Apps Script hasil deploy (format: https://script.google.com/macros/s/.../exec)
// Jika dibiarkan kosong (''), aplikasi otomatis berjalan dalam INTERACTIVE DEMO MODE
// dengan data realistis Pengadilan Negeri untuk pengujian fitur tanpa konfigurasi awal.
// ==========================================================================

const APP_CONFIG = {
  // Ganti dengan URL deployment Web App GAS Anda:
  GAS_URL: 'https://script.google.com/macros/s/AKfycbwljbItiTZZS2nfeuA6kmLhoa9PDXCR2vJgRxcB3NDQmE1DOW4jjCtw9mnumdcXwdg/exec',

  // Identitas Satker Pengadilan
  INSTANSI: {
    NAMA: 'PENGADILAN NEGERI KELAS I A KHUSUS',
    ALAMAT: 'Jl. L.L.R.E. Martadinata No. 74-80, Citarum, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40115',
    PTSP_TITLE: 'PTSP HUKUM • SISTEM E-KUASA',
    KODE_PN: 'PN.Bdg',
    TELEPON: '(022) 7208911',
    EMAIL: 'kepaniteraan.hukum@pn-bandung.go.id'
  },

  // Pengaturan Kuota & Pola Nomor
  POLA_NOMOR_DEFAULT: '{NO}/HK.02/SK/{BULAN_ROMAWI}/{TAHUN}/{KODE_PN}',
  TARIF_PNBP_DEFAULT: 10000,

  // Versi Aplikasi
  VERSION: '2.4.0-Enterprise',
  TTE_PROVIDER: 'Balai Sertifikasi Elektronik (BSrE) - BSSN'
};

// Ekspor ke window global
window.APP_CONFIG = APP_CONFIG;
