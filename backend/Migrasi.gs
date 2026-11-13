/**
 * ============================================================================
 * E-KUASA MIGRASI & SINKRONISASI DATABASE (Migrasi.gs)
 * Utilitas Migrasi Data Antar-Spreadsheet Idempoten (Dry-Run & Delta Sync)
 * Sesuai panduan: gas-migrasi-database
 * ============================================================================
 */

function dryRunMigrasi(sourceSsId) {
  return prosesMigrasiCore_(sourceSsId, true);
}

function eksekusiMigrasi(sourceSsId) {
  return prosesMigrasiCore_(sourceSsId, false);
}

function prosesMigrasiCore_(sourceSsId, isDryRun) {
  if (!sourceSsId) throw new Error('ID Spreadsheet Sumber wajib disertakan.');
  
  const sourceSs = SpreadsheetApp.openById(sourceSsId);
  const targetSs = getSS();

  const sourceSheet = sourceSs.getSheetByName('REG_KUASA') || sourceSs.getSheets()[0];
  const targetSheet = targetSs.getSheetByName('REG_KUASA');

  const srcVals = sourceSheet.getDataRange().getValues();
  if (srcVals.length <= 1) {
    return { success: true, message: 'Spreadsheet sumber tidak memiliki baris data.' };
  }

  const srcHeaders = srcVals[0].map(String);
  const targetVals = targetSheet.getDataRange().getValues();
  const targetHeaders = targetVals[0].map(String);

  // Buat indeks ID pengajuan yang sudah ada di sheet target
  const existingMap = new Set();
  for (let r = 1; r < targetVals.length; r++) {
    existingMap.add(String(targetVals[r][0]));
  }

  let countBaru = 0;
  let countLewat = 0;
  const barisUntukDitulis = [];

  for (let r = 1; r < srcVals.length; r++) {
    const srcRowObj = {};
    srcHeaders.forEach((h, i) => { if (h) srcRowObj[h] = srcVals[r][i]; });

    const idPengajuan = srcRowObj['ID_Pengajuan'] || srcRowObj['ID'] || ('EKU-MIG-' + r);
    if (existingMap.has(idPengajuan)) {
      countLewat++;
    } else {
      countBaru++;
      // Petakan ke skema header target
      const newRow = targetHeaders.map(th => srcRowObj[th] !== undefined ? srcRowObj[th] : '');
      newRow[0] = idPengajuan; // Pastikan ID ada
      barisUntukDitulis.push(newRow);
    }
  }

  if (!isDryRun && barisUntukDitulis.length > 0) {
    // Tulis secara batch (gas-scale-turbo)
    const startRow = targetSheet.getLastRow() + 1;
    targetSheet.getRange(startRow, 1, barisUntukDitulis.length, targetHeaders.length).setValues(barisUntukDitulis);
    CacheX.del('queue_verifier');
    CacheX.del('buku_register');
  }

  return {
    success: true,
    mode: isDryRun ? 'DRY-RUN (Simulasi)' : 'EKSEKUSI (Migrasi Nyata)',
    totalSumber: srcVals.length - 1,
    akanDitambahkan: countBaru,
    dilewatiKarenaDuplikat: countLewat,
    keterangan: isDryRun ? 'Pindai selesai. Jalankan eksekusiMigrasi() untuk menulis ke database.' : 'Data berhasil dimigrasikan ke database target!'
  };
}
