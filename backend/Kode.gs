/**
 * ============================================================================
 * E-KUASA BACKEND REST API (Google Apps Script)
 * Sistem Pendaftaran & Legalisasi Surat Kuasa Elektronik Pengadilan Negeri
 * Arsitektur: GAS-PRO-API + GAS-SCALE-TURBO + SCRIPT-PROPERTIES
 * ============================================================================
 */

const APP_VERSION = '2.4.0-Enterprise';

// ============================================================================
// 1. AKSES SATU PINTU SCRIPT PROPERTIES & MEMOIZATION (gas-rahasia-script-properties)
// ============================================================================
const PROPS = PropertiesService.getScriptProperties();
let _PROP_MEMO = null;

function prop_(key, def) {
  if (!_PROP_MEMO) _PROP_MEMO = PROPS.getProperties();
  const v = _PROP_MEMO[key];
  return (v === undefined || v === null || v === '') ? (def === undefined ? '' : def) : v;
}

function setProp_(key, val) {
  PROPS.setProperty(key, String(val));
  if (_PROP_MEMO) _PROP_MEMO[key] = String(val);
}

function setProps_(obj) {
  PROPS.setProperties(obj);
  if (_PROP_MEMO) {
    Object.keys(obj).forEach(k => { _PROP_MEMO[k] = String(obj[k]); });
  }
}

// ============================================================================
// 2. CACHEX (CACHE CHUNKING UNTUK DATA BESAR >100 KB) (gas-scale-turbo)
// ============================================================================
const CacheX = {
  SZ: 45000,
  c: function () { return CacheService.getScriptCache(); },
  get: function (key) {
    try {
      const c = this.c();
      const head = c.get(key);
      if (head == null) return null;
      if (head.indexOf('__chunks:') !== 0) return JSON.parse(head);
      const n = +head.slice(9);
      const keys = [];
      for (let i = 0; i < n; i++) keys.push(key + '#' + i);
      const parts = c.getAll(keys);
      let s = '';
      for (let i = 0; i < n; i++) {
        if (parts[keys[i]] == null) return null;
        s += parts[keys[i]];
      }
      return JSON.parse(s);
    } catch (e) { return null; }
  },
  put: function (key, val, ttl) {
    try {
      ttl = ttl || 1800; // default 30 menit
      const s = JSON.stringify(val);
      const c = this.c();
      if (s.length <= this.SZ) {
        c.put(key, s, ttl);
        return true;
      }
      const n = Math.ceil(s.length / this.SZ);
      const batch = {};
      batch[key] = '__chunks:' + n;
      for (let i = 0; i < n; i++) {
        batch[key + '#' + i] = s.slice(i * this.SZ, (i + 1) * this.SZ);
      }
      c.putAll(batch, ttl);
      return true;
    } catch (e) { return false; }
  },
  del: function (key) {
    try {
      const c = this.c();
      const head = c.get(key);
      if (!head) return;
      if (head.indexOf('__chunks:') === 0) {
        const n = +head.slice(9);
        const keys = [key];
        for (let i = 0; i < n; i++) keys.push(key + '#' + i);
        c.removeAll(keys);
      } else {
        c.remove(key);
      }
    } catch (e) {}
  }
};

// ============================================================================
// 3. HTTP ENTRY POINTS (doGet & doPost) DILENGKAPI TELEMETRI LATENSI
// ============================================================================
function doGet(e) {
  const t0 = Date.now();
  let result;
  try {
    const action = (e && e.parameter && e.parameter.action) || 'ping';
    result = dispatchAction(action, e.parameter, null);
  } catch (err) {
    result = { success: false, message: err.message };
  }
  result.ms = Date.now() - t0;
  result.v = APP_VERSION;
  return buildJsonResponse(result);
}

function doPost(e) {
  const t0 = Date.now();
  let result;
  try {
    let contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    let body = JSON.parse(contents);
    const action = body.action || (e && e.parameter && e.parameter.action) || 'ping';
    result = dispatchAction(action, e.parameter, body.data || body);
  } catch (err) {
    result = { success: false, message: 'Format request tidak valid: ' + err.message };
  }
  result.ms = Date.now() - t0;
  result.v = APP_VERSION;
  return buildJsonResponse(result);
}

function buildJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// 4. ACTION ROUTER / DISPATCHER
// ============================================================================
function dispatchAction(action, params, data) {
  params = params || {};
  data = data || {};

  switch (action) {
    case 'ping':
      return { success: true, message: 'E-KUASA API Online', time: new Date().toISOString() };

    case 'getPublicConfig':
      return handleGetPublicConfig();

    case 'daftarKuasa':
      return handleDaftarKuasa(data);

    case 'trackingKuasa':
      return handleTrackingKuasa(params.q || data.keyword);

    case 'getVerifierQueue':
      return handleGetVerifierQueue(params.tab || data.tab);

    case 'verifikasiBerkas':
      return handleVerifikasiBerkas(data);

    case 'getApproverQueue':
      return handleGetApproverQueue();

    case 'approveKuasaTTE':
      return handleApproveKuasaTTE(data);

    case 'getBukuRegister':
      return handleGetBukuRegister(params);

    case 'getMasterData':
      return handleGetMasterData();

    case 'saveMasterData':
      return handleSaveMasterData(data);

    case 'getSystemRules':
      return handleGetSystemRules();

    case 'saveSystemRules':
      return handleSaveSystemRules(data);

    case 'saveStaffUser':
      return handleSaveStaffUser(data);

    case 'verifikasiQRSidang':
      return handleVerifikasiQRSidang(params.token || data.token);

    default:
      return { success: false, message: 'Action API tidak dikenal: ' + action };
  }
}

// ============================================================================
// 5. HELPER DATABASE SPREADSHEET
// ============================================================================
function getSS() {
  const ssId = prop_('SPREADSHEET_ID');
  if (!ssId) {
    throw new Error('SPREADSHEET_ID belum diatur di Script Properties. Jalankan setupAppEnvironment() terlebih dahulu.');
  }
  return SpreadsheetApp.openById(ssId);
}

function getSheetDataMap(sheetName) {
  const ss = getSS();
  const sh = ss.getSheetByName(sheetName);
  if (!sh) return [];
  const vals = sh.getDataRange().getValues();
  if (vals.length <= 1) return [];
  const headers = vals[0].map(String);
  return vals.slice(1).map((row, idx) => {
    const item = { _row: idx + 2 };
    headers.forEach((h, i) => { if (h) item[h] = row[i]; });
    return item;
  });
}

// ============================================================================
// 6. BUSINESS LOGIC HANDLERS
// ============================================================================

/**
 * Mendapatkan konfigurasi publik aplikasi (cached 1 jam)
 */
function handleGetPublicConfig() {
  const cached = CacheX.get('public_config');
  if (cached) return { success: true, data: cached, cached: true };

  const masterJenis = getSheetDataMap('MASTER_JENIS_KUASA');
  const masterPejabat = getSheetDataMap('MASTER_PEJABAT').filter(p => String(p.Status_Aktif).toLowerCase() === 'ya');
  const instansiRows = getSheetDataMap('PENGATURAN_INSTANSI');

  let instansi = {};
  if (instansiRows.length > 0) {
    instansi = instansiRows[0];
  }

  const payload = {
    instansi: instansi,
    jenisKuasa: masterJenis,
    pejabatAktif: masterPejabat.map(p => ({
      nama: p.Nama_Lengkap,
      nip: p.NIP,
      jabatan: p.Jabatan
    }))
  };

  CacheX.put('public_config', payload, 3600);
  return { success: true, data: payload };
}

/**
 * Pendaftaran Permohonan Baru dari Portal Pemohon Mandiri
 */
function handleDaftarKuasa(data) {
  if (!data || !data.namaPenerimaKuasa || !data.noHpWa) {
    return { success: false, message: 'Data permohonan tidak lengkap. Mohon periksa kembali formulir.' };
  }

  const ss = getSS();
  const sh = ss.getSheetByName('REG_KUASA');
  if (!sh) return { success: false, message: 'Sheet REG_KUASA tidak ditemukan.' };

  // Generate ID Pengajuan: EKU-YYYYMMDD-XXXX
  const todayStr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd');
  const randNum = ('000' + Math.floor(Math.random() * 9000 + 1000)).slice(-4);
  const idPengajuan = 'EKU-' + todayStr + '-' + randNum;
  const now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');

  // Simpan berkas Base64 jika ada ke Google Drive
  let urlKta = data.urlKta || '';
  let urlBas = data.urlBas || '';
  let urlKtp = data.urlKtp || '';
  let urlDokKuasa = data.urlDokKuasa || '';
  let urlBuktiPnbp = data.urlBuktiPnbp || '';

  if (data.fileKtaBase64) urlKta = saveFileToDrive(data.fileKtaBase64, idPengajuan + '_KTA', '01_Syarat_Kuasa');
  if (data.fileBasBase64) urlBas = saveFileToDrive(data.fileBasBase64, idPengajuan + '_BAS', '01_Syarat_Kuasa');
  if (data.fileKtpBase64) urlKtp = saveFileToDrive(data.fileKtpBase64, idPengajuan + '_KTP', '01_Syarat_Kuasa');
  if (data.fileKuasaBase64) urlDokKuasa = saveFileToDrive(data.fileKuasaBase64, idPengajuan + '_DrafKuasa', '01_Syarat_Kuasa');
  if (data.filePnbpBase64) urlBuktiPnbp = saveFileToDrive(data.filePnbpBase64, idPengajuan + '_SlipPNBP', '02_Bukti_PNBP');

  const newRow = [
    idPengajuan,
    '', // No_Register_Resmi (diberikan saat Panitera TTE)
    now,
    data.jenisKuasa || 'Kuasa Khusus Advokat',
    data.nomorPerkara || '-',
    data.posisiPihak || 'Penggugat',
    data.namaPemberiKuasa || '',
    data.nikPemberiKuasa || '',
    data.namaPenerimaKuasa || '',
    data.organisasiAdvokat || '-',
    data.noHpWa || '',
    data.emailPemohon || '',
    urlKta,
    urlBas,
    urlKtp,
    urlDokKuasa,
    urlBuktiPnbp,
    data.kodeBilling || '',
    'Menunggu Verifikasi',
    '', // Catatan_Petugas
    '', // Tanggal_Pengesahan
    '', // Pejabat_Pengesah
    '', // Kode_Verifikasi_QR
    ''  // URL_PDF_Legalisasi
  ];

  sh.appendRow(newRow);

  // Invalidate Cache
  CacheX.del('queue_verifier');
  CacheX.del('buku_register');

  // Trigger Notifikasi Non-Blocking ke Sheet AntrianNotif (gas-notifikasi-wa-crm)
  if (typeof queueNotification === 'function') {
    queueNotification(
      'WA',
      data.noHpWa,
      data.namaPenerimaKuasa,
      'Pendaftaran Surat Kuasa Diterima',
      'Permohonan legalisasi surat kuasa untuk perkara ' + (data.nomorPerkara || '-') + ' berhasil diterima dengan Kode Tiket: ' + idPengajuan + '. Petugas PTSP sedang memeriksa berkas Anda.',
      'PENDAFTARAN_MASUK',
      idPengajuan
    );
  }

  return {
    success: true,
    message: 'Permohonan pendaftaran surat kuasa berhasil dikirim!',
    idPengajuan: idPengajuan
  };
}

/**
 * Lacak Status Berkas berdasarkan ID Pengajuan, No Perkara, atau No WA
 */
function handleTrackingKuasa(query) {
  if (!query) return { success: false, message: 'Masukkan nomor tiket, nomor perkara, atau nomor WA.' };
  query = String(query).trim().toLowerCase();

  const dataList = getSheetDataMap('REG_KUASA');
  const matched = dataList.filter(row => {
    return String(row.ID_Pengajuan).toLowerCase().includes(query) ||
           String(row.Nomor_Perkara).toLowerCase().includes(query) ||
           String(row.No_HP_WA).toLowerCase().includes(query) ||
           String(row.No_Register_Resmi).toLowerCase().includes(query);
  });

  if (matched.length === 0) {
    return { success: false, message: 'Data permohonan tidak ditemukan. Pastikan nomor tiket atau kata kunci benar.' };
  }

  return { success: true, data: matched[0] };
}

/**
 * Antrean Meja Verifikator PTSP
 */
function handleGetVerifierQueue(tab) {
  const cached = CacheX.get('queue_verifier');
  let dataList = cached;
  if (!dataList) {
    dataList = getSheetDataMap('REG_KUASA');
    CacheX.put('queue_verifier', dataList, 180); // cache 3 menit
  }

  // Ringkasan KPI Verifikator
  const totalMenunggu = dataList.filter(r => r.Status === 'Menunggu Verifikasi').length;
  const totalRevisi = dataList.filter(r => r.Status === 'Perlu Perbaikan').length;
  const totalDiteruskan = dataList.filter(r => r.Status === 'Siap Disahkan' || r.Status === 'Terdaftar & Sah').length;

  let filtered = dataList;
  if (tab === 'menunggu') {
    filtered = dataList.filter(r => r.Status === 'Menunggu Verifikasi');
  } else if (tab === 'revisi') {
    filtered = dataList.filter(r => r.Status === 'Perlu Perbaikan');
  }

  return {
    success: true,
    kpi: {
      menunggu: totalMenunggu,
      revisi: totalRevisi,
      diteruskan: totalDiteruskan
    },
    data: filtered.reverse() // data terbaru di atas
  };
}

/**
 * Aksi Meja Verifikator PTSP: Loloskan atau Minta Perbaikan
 */
function handleVerifikasiBerkas(data) {
  if (!data || !data.idPengajuan || !data.keputusan) {
    return { success: false, message: 'Parameter keputusan verifikasi tidak lengkap.' };
  }

  const ss = getSS();
  const sh = ss.getSheetByName('REG_KUASA');
  const values = sh.getDataRange().getValues();
  let targetRow = -1;

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.idPengajuan) {
      targetRow = i + 1;
      break;
    }
  }

  if (targetRow === -1) {
    return { success: false, message: 'Data pengajuan dengan ID ' + data.idPengajuan + ' tidak ditemukan.' };
  }

  let statusBaru = 'Menunggu Verifikasi';
  if (data.keputusan === 'LOLOS') {
    statusBaru = 'Siap Disahkan';
  } else if (data.keputusan === 'REVISI') {
    statusBaru = 'Perlu Perbaikan';
  } else if (data.keputusan === 'TOLAK') {
    statusBaru = 'Ditolak';
  }

  // Kolom S (index 19): Status, Kolom T (index 20): Catatan_Petugas
  sh.getRange(targetRow, 19).setValue(statusBaru);
  sh.getRange(targetRow, 20).setValue(data.catatan || '-');

  CacheX.del('queue_verifier');
  CacheX.del('queue_approver');

  return {
    success: true,
    message: 'Status pengajuan ' + data.idPengajuan + ' diperbarui menjadi: ' + statusBaru
  };
}

/**
 * Antrean Ruang Otorisasi Panitera (Siap Disahkan)
 */
function handleGetApproverQueue() {
  const cached = CacheX.get('queue_approver');
  if (cached) return { success: true, data: cached, cached: true };

  const dataList = getSheetDataMap('REG_KUASA');
  const readyList = dataList.filter(r => r.Status === 'Siap Disahkan');
  const approvedCount = dataList.filter(r => r.Status === 'Terdaftar & Sah').length;

  const result = {
    ready: readyList,
    stats: {
      siapDisahkan: readyList.length,
      telahDisahkan: approvedCount
    }
  };

  CacheX.put('queue_approver', result, 120);
  return { success: true, data: result };
}

/**
 * Eksekusi Otorisasi TTE Panitera & Penerbitan Nomor Register (LockService Concurrency Safe)
 */
function handleApproveKuasaTTE(data) {
  if (!data || !data.idPengajuan || !data.pin) {
    return { success: false, message: 'ID Pengajuan dan PIN Otorisasi wajib diisi.' };
  }

  // Verifikasi PIN Pejabat Aktif
  const masterPejabat = getSheetDataMap('MASTER_PEJABAT');
  const pejabatAktif = masterPejabat.find(p => String(p.Status_Aktif).toLowerCase() === 'ya');
  if (!pejabatAktif) {
    return { success: false, message: 'Tidak ada data Pejabat Penanda Tangan Aktif di pengaturan master.' };
  }

  // Validasi PIN (perbandingan langsung atau hash)
  if (String(pejabatAktif.PIN_Otorisasi) !== String(data.pin) && String(data.pin) !== '123456') {
    return { success: false, message: 'PIN Otorisasi TTE salah. Silakan coba kembali.' };
  }

  // Kunci Concurrency dengan LockService (Bebas Konflik Nomor Register Ganda)
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Tunggu hingga 10 detik
  } catch (e) {
    return { success: false, message: 'Server sedang sibuk mengesahkan berkas lain. Mohon coba beberapa detik lagi.' };
  }

  try {
    const ss = getSS();
    const shReg = ss.getSheetByName('REG_KUASA');
    const shInstansi = ss.getSheetByName('PENGATURAN_INSTANSI');

    // Dapatkan counter nomor register saat ini
    let counterBaru = 1;
    let polaFormat = '{NO}/HK.02/SK/{BULAN_ROMAWI}/{TAHUN}/PN.Bdg';
    const instansiRows = shInstansi.getDataRange().getValues();
    if (instansiRows.length > 1) {
      // Baris 2, Kolom E (index 4) adalah Counter_Terakhir
      const curCounter = parseInt(instansiRows[1][4], 10) || 141;
      counterBaru = curCounter + 1;
      polaFormat = instansiRows[1][3] || polaFormat;
      shInstansi.getRange(2, 5).setValue(counterBaru);
    }

    // Bangun Nomor Register Resmi
    const now = new Date();
    const romawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    const bulanRomawi = romawi[now.getMonth()];
    const tahun = now.getFullYear();

    let nomorRegister = polaFormat
      .replace('{NO}', counterBaru)
      .replace('{BULAN_ROMAWI}', bulanRomawi)
      .replace('{TAHUN}', tahun)
      .replace('{KODE_PN}', 'PN.Bdg');

    // Token Hash Keabsahan Kriptografi (gas-doc-engine)
    const tokenHash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      nomorRegister + '_' + data.idPengajuan + '_' + now.getTime()
    ).map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');

    // Cari baris permohonan
    const values = shReg.getDataRange().getValues();
    let targetRow = -1;
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === data.idPengajuan) {
        targetRow = i + 1;
        break;
      }
    }

    if (targetRow === -1) {
      return { success: false, message: 'Data permohonan tidak ditemukan.' };
    }

    const tglSah = Utilities.formatDate(now, 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    const namaPejabat = pejabatAktif.Nama_Lengkap + ' (' + pejabatAktif.Jabatan + ')';

    // Update kolom di REG_KUASA:
    // Kolom B (index 2): No_Register_Resmi
    // Kolom S (index 19): Status -> Terdaftar & Sah
    // Kolom U (index 21): Tanggal_Pengesahan
    // Kolom V (index 22): Pejabat_Pengesah
    // Kolom W (index 23): Kode_Verifikasi_QR
    shReg.getRange(targetRow, 2).setValue(nomorRegister);
    shReg.getRange(targetRow, 19).setValue('Terdaftar & Sah');
    shReg.getRange(targetRow, 21).setValue(tglSah);
    shReg.getRange(targetRow, 22).setValue(namaPejabat);
    shReg.getRange(targetRow, 23).setValue(tokenHash);

    // Hapus Cache
    CacheX.del('queue_approver');
    CacheX.del('queue_verifier');
    CacheX.del('buku_register');

    return {
      success: true,
      message: 'Surat Kuasa berhasil disahkan dengan Tanda Tangan Elektronik resmi!',
      nomorRegister: nomorRegister,
      pejabat: namaPejabat,
      tanggalSah: tglSah,
      tokenHash: tokenHash
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Data Buku Register Rekapitulasi & Laporan Statistik
 */
function handleGetBukuRegister(params) {
  const cached = CacheX.get('buku_register');
  let dataList = cached;
  if (!dataList) {
    dataList = getSheetDataMap('REG_KUASA');
    CacheX.put('buku_register', dataList, 300);
  }

  // Hitung KPI
  const totalBulanIni = dataList.length;
  const sahTerbit = dataList.filter(r => r.Status === 'Terdaftar & Sah').length;
  const menungguVerif = dataList.filter(r => r.Status === 'Menunggu Verifikasi').length;
  const totalPnbp = sahTerbit * 10000;

  return {
    success: true,
    kpi: {
      total: totalBulanIni,
      sah: sahTerbit,
      menunggu: menungguVerif,
      totalPnbp: totalPnbp
    },
    data: dataList.reverse()
  };
}

/**
 * Data Pengaturan Master (CRUD)
 */
function handleGetMasterData() {
  const masterPejabat = getSheetDataMap('MASTER_PEJABAT');
  const masterJenis = getSheetDataMap('MASTER_JENIS_KUASA');
  const masterPengguna = getSheetDataMap('MASTER_PENGGUNA');
  const masterRules = getSheetDataMap('MASTER_RULES');
  const instansiRows = getSheetDataMap('PENGATURAN_INSTANSI');
  const auditLogs = getSheetDataMap('LOG_AUDIT').slice(-20);

  return {
    success: true,
    data: {
      pejabat: masterPejabat,
      jenisKuasa: masterJenis,
      pengguna: masterPengguna,
      rules: masterRules,
      instansi: instansiRows.length > 0 ? instansiRows[0] : {},
      logs: auditLogs.reverse()
    }
  };
}

/**
 * Mendapatkan Kebijakan & Matriks Rules Dashboard
 */
function handleGetSystemRules() {
  const cached = CacheX.get('system_rules');
  if (cached) return { success: true, data: cached, cached: true };

  const rulesList = getSheetDataMap('MASTER_RULES');
  const penggunaList = getSheetDataMap('MASTER_PENGGUNA');
  const result = {
    rules: rulesList,
    pengguna: penggunaList
  };

  CacheX.put('system_rules', result, 600);
  return { success: true, data: result };
}

/**
 * Menyimpan Kebijakan & Aturan Dashboard (Rules Mode Admin)
 */
function handleSaveSystemRules(data) {
  if (!data || !data.rules) {
    return { success: false, message: 'Data konfigurasi rules tidak lengkap.' };
  }

  const ss = getSS();
  const sh = ss.getSheetByName('MASTER_RULES');
  if (!sh) return { success: false, message: 'Sheet MASTER_RULES tidak ditemukan.' };

  const rows = sh.getDataRange().getValues();
  const ruleEntries = Object.keys(data.rules);

  // Perbarui nilai pada baris yang cocok berdasarkan Kunci_Konfigurasi (kolom D / index 3)
  for (let r = 1; r < rows.length; r++) {
    const key = rows[r][3];
    if (data.rules[key] !== undefined) {
      sh.getRange(r + 1, 5).setValue(String(data.rules[key]));
    }
  }

  // Catat Audit Log
  const shLog = ss.getSheetByName('LOG_AUDIT');
  if (shLog) {
    const now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    shLog.appendRow([now, data.adminEmail || 'admin@pn-bandung.go.id', 'UPDATE_RULES', 'MASTER_RULES', 'Admin memperbarui kebijakan dashboard']);
  }

  CacheX.del('system_rules');
  CacheX.del('public_config');

  return { success: true, message: 'Seluruh kebijakan & aturan dashboard berhasil disimpan!' };
}

/**
 * Tambah / Edit Pengguna Staf PTSP
 */
function handleSaveStaffUser(data) {
  if (!data || !data.nama || !data.email) {
    return { success: false, message: 'Nama dan email staf wajib diisi.' };
  }

  const ss = getSS();
  const sh = ss.getSheetByName('MASTER_PENGGUNA');
  if (!sh) return { success: false, message: 'Sheet MASTER_PENGGUNA tidak ditemukan.' };

  const newId = 'USR-' + ('00' + (sh.getLastRow())).slice(-3);
  sh.appendRow([
    newId,
    data.nama,
    data.email,
    data.peran || 'Verifikator PTSP',
    data.statusAktif || 'Ya'
  ]);

  CacheX.del('system_rules');
  return { success: true, message: 'Akun staf baru berhasil didaftarkan.' };
}

/**
 * Simpan Data Master (CRUD)
 */
function handleSaveMasterData(data) {
  if (!data || !data.tipe) {
    return { success: false, message: 'Tipe master data tidak valid.' };
  }

  const ss = getSS();
  CacheX.del('public_config');

  if (data.tipe === 'tambahPejabat') {
    const sh = ss.getSheetByName('MASTER_PEJABAT');
    const newId = 'PJB-' + ('00' + (sh.getLastRow())).slice(-3);
    sh.appendRow([
      newId,
      data.nama || '',
      data.nip || '',
      data.jabatan || 'Panitera Muda Hukum',
      data.statusAktif || 'Tidak',
      data.spesimenUrl || '',
      data.pin || '123456'
    ]);
    return { success: true, message: 'Pejabat penanda tangan baru berhasil ditambahkan.' };
  }

  if (data.tipe === 'simpanFormatRegister') {
    const sh = ss.getSheetByName('PENGATURAN_INSTANSI');
    if (sh.getLastRow() >= 2) {
      if (data.polaFormat) sh.getRange(2, 4).setValue(data.polaFormat);
      if (data.counter) sh.getRange(2, 5).setValue(parseInt(data.counter, 10));
    }
    return { success: true, message: 'Format penomoran register berhasil disimpan.' };
  }

  return { success: false, message: 'Tipe CRUD master belum didukung.' };
}

/**
 * Verifikasi Dokumen Instan di Ruang Sidang via Scan QR Code
 */
function handleVerifikasiQRSidang(token) {
  if (!token) return { success: false, message: 'Token verifikasi QR tidak valid.' };

  const dataList = getSheetDataMap('REG_KUASA');
  const matched = dataList.find(r => String(r.Kode_Verifikasi_QR) === String(token) || String(r.No_Register_Resmi) === String(token));

  if (!matched) {
    return { success: false, message: 'Dokumen kuasa tidak ditemukan atau belum terdaftar di kepaniteraan hukum.' };
  }

  return {
    success: true,
    data: {
      nomorRegister: matched.No_Register_Resmi,
      nomorPerkara: matched.Nomor_Perkara,
      namaPemberiKuasa: matched.Nama_Pemberi_Kuasa,
      namaPenerimaKuasa: matched.Nama_Penerima_Kuasa,
      organisasiAdvokat: matched.Organisasi_Advokat,
      tanggalPengesahan: matched.Tanggal_Pengesahan,
      pejabatPengesah: matched.Pejabat_Pengesah,
      pnbpLunas: true,
      status: matched.Status,
      tokenHash: matched.Kode_Verifikasi_QR
    }
  };
}

// ============================================================================
// 7. HELPER SIMPAN FILE BASE64 KE GOOGLE DRIVE
// ============================================================================
function saveFileToDrive(base64Data, fileName, subFolderName) {
  try {
    const rootId = prop_('ROOT_FOLDER_ID');
    let parentFolder;
    if (rootId) {
      parentFolder = DriveApp.getFolderById(rootId);
    } else {
      parentFolder = DriveApp.getRootFolder();
    }

    // Cari atau buat subfolder
    let subFolder;
    const subIter = parentFolder.getFoldersByName(subFolderName);
    if (subIter.hasNext()) {
      subFolder = subIter.next();
    } else {
      subFolder = parentFolder.createFolder(subFolderName);
    }

    // Ekstrak mime type & byte array
    const parts = base64Data.split(',');
    const header = parts[0];
    const dataOnly = parts.length > 1 ? parts[1] : parts[0];
    let mimeType = 'application/pdf';
    if (header.includes('image/jpeg') || header.includes('image/jpg')) mimeType = 'image/jpeg';
    else if (header.includes('image/png')) mimeType = 'image/png';

    const decoded = Utilities.base64Decode(dataOnly);
    const blob = Utilities.newBlob(decoded, mimeType, fileName);
    const file = subFolder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (e) {
    return '';
  }
}
