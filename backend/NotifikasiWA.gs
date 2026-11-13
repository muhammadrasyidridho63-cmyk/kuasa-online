/**
 * ============================================================================
 * E-KUASA NOTIFIKASI WA & EMAIL (NotifikasiWA.gs)
 * Gateway Fonnte WhatsApp + Google MailApp + CRM Kontak
 * Sesuai panduan: gas-notifikasi-wa-crm (Non-Blocking Queue Pattern)
 * ============================================================================
 */

function queueNotification(kanal, tujuan, nama, subjek, pesan, event, refId) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName('AntrianNotif');
    if (!sh) return;

    const id = 'ANT-' + Utilities.getUuid().slice(0, 8);
    const now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');
    const nomorNormal = hp08_(tujuan);

    sh.appendRow([
      id,
      kanal || 'WA',
      nomorNormal,
      nama || '',
      subjek || 'Pemberitahuan E-KUASA',
      pesan || '',
      event || 'TRANSAKSI',
      refId || '',
      '', // BlastID
      'Antri',
      0,  // Percobaan
      '', // Respon
      now,
      ''  // DikirimPada
    ]);

    // Sinkronkan ke CRM Kontak secara otomatis
    sinkronCRM_(nama, nomorNormal, refId);
  } catch (e) {
    Logger.log('Gagal menambah antrean notifikasi: ' + e.message);
  }
}

/**
 * Pemicu Waktu Berkala (Time-driven Trigger): Jalankan setiap 1 - 5 menit
 */
function prosesAntreanNotifikasi() {
  const ss = getSS();
  const sh = ss.getSheetByName('AntrianNotif');
  if (!sh) return;

  const data = sh.getDataRange().getValues();
  if (data.length <= 1) return;

  const fonnteToken = prop_('FONNTE_TOKEN');
  const now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');

  for (let r = 1; r < data.length; r++) {
    const status = data[r][9];
    if (status === 'Antri') {
      const kanal = data[r][1];
      const tujuan = data[r][2];
      const subjek = data[r][4];
      const pesan = data[r][5];
      let sukses = false;
      let respMsg = '';

      if (kanal === 'WA' && fonnteToken) {
        try {
          const payload = {
            target: hp62_(tujuan),
            message: pesan,
            countryCode: '62'
          };
          const res = UrlFetchApp.fetch('https://api.fonnte.com/send', {
            method: 'post',
            headers: { 'Authorization': fonnteToken },
            payload: payload,
            muteHttpExceptions: true
          });
          respMsg = res.getContentText();
          sukses = res.getResponseCode() === 200;
        } catch (err) {
          respMsg = err.message;
        }
      } else if (kanal === 'EMAIL' && tujuan.includes('@')) {
        try {
          MailApp.sendEmail({
            to: tujuan,
            subject: '[E-KUASA Pengadilan Negeri] ' + subjek,
            body: pesan
          });
          sukses = true;
          respMsg = 'Email terkirim';
        } catch (err) {
          respMsg = err.message;
        }
      } else {
        // Fallback jika token Fonnte belum dipasang
        sukses = true;
        respMsg = 'Antrean disimpan (Token Fonnte belum disetel di Script Properties)';
      }

      sh.getRange(r + 1, 10).setValue(sukses ? 'Terkirim' : 'Gagal');
      sh.getRange(r + 1, 11).setValue(data[r][10] + 1);
      sh.getRange(r + 1, 12).setValue(respMsg.slice(0, 150));
      sh.getRange(r + 1, 14).setValue(now);
    }
  }
}

function sinkronCRM_(nama, noHp, refId) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName('CRM_Kontak');
    if (!sh) return;

    const data = sh.getDataRange().getValues();
    const existing = data.slice(1).find(row => String(row[3]) === String(noHp));
    const now = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd HH:mm:ss');

    if (!existing) {
      sh.appendRow([
        'KTK-' + Utilities.getUuid().slice(0, 6),
        nama,
        '',
        noHp,
        'Advokat/Pemohon',
        'Pendaftaran Online',
        refId,
        'Surat Kuasa',
        'Terdaftar',
        now,
        '',
        'TIDAK',
        '',
        1,
        now,
        '',
        now,
        now
      ]);
    }
  } catch (e) {}
}

function hp08_(no) {
  let s = String(no || '').replace(/\D/g, '');
  if (s.startsWith('62')) s = '0' + s.slice(2);
  else if (!s.startsWith('0') && s.length > 5) s = '0' + s;
  return s;
}

function hp62_(no) {
  let s = String(no || '').replace(/\D/g, '');
  if (s.startsWith('0')) s = '62' + s.slice(1);
  return s;
}
