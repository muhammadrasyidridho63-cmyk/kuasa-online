/**
 * ============================================================================
 * E-KUASA DOC ENGINE (DocEngine.gs)
 * Mesin Penerbitan Akta Legalisasi Surat Kuasa Resmi Ber-QR Code HMAC
 * Sesuai panduan: gas-doc-engine & format buku register Kepaniteraan Hukum
 * ============================================================================
 */

function generateAktaLegalisasiPDF(dataReg, pejabatAktif, instansi) {
  try {
    const rootId = prop_('ROOT_FOLDER_ID');
    let parentFolder = rootId ? DriveApp.getFolderById(rootId) : DriveApp.getRootFolder();
    
    // Cari atau buat subfolder 03_Legalisasi_Sah
    let pdfFolder;
    const it = parentFolder.getFoldersByName('03_Legalisasi_Sah');
    if (it.hasNext()) {
      pdfFolder = it.next();
    } else {
      pdfFolder = parentFolder.createFolder('03_Legalisasi_Sah');
    }

    // Bangun URL QR Code untuk verifikasi sidang
    const verifyUrl = 'https://' + prop_('FRONTEND_DOMAIN', 'pn-bandung.go.id') + '/?token=' + encodeURIComponent(dataReg.Kode_Verifikasi_QR || dataReg.No_Register_Resmi);
    const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(verifyUrl);

    // Template Dokumen Resmi Mahkamah Agung / Pengadilan Negeri
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Akta Pendaftaran & Legalisasi Surat Kuasa</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            padding: 30px;
          }
          .kop {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 12px;
            margin-bottom: 24px;
          }
          .kop h2 { margin: 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; }
          .kop h3 { margin: 4px 0; font-size: 13pt; font-weight: bold; }
          .kop p { margin: 2px 0; font-size: 10pt; font-style: italic; }
          .title {
            text-align: center;
            margin-bottom: 20px;
          }
          .title h4 {
            margin: 0;
            font-size: 13pt;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
          }
          .title p {
            margin: 4px 0;
            font-size: 11pt;
            font-weight: bold;
          }
          .content {
            text-align: justify;
            margin-bottom: 20px;
          }
          .table-data {
            width: 100%;
            margin: 15px 0;
            border-collapse: collapse;
          }
          .table-data td {
            padding: 4px 6px;
            vertical-align: top;
          }
          .footer-section {
            width: 100%;
            margin-top: 30px;
          }
          .footer-section td {
            vertical-align: top;
          }
          .box-qr {
            text-align: center;
            border: 1px dashed #666;
            padding: 10px;
            width: 190px;
          }
          .box-qr img {
            width: 130px;
            height: 130px;
          }
          .box-qr p {
            font-size: 8pt;
            margin: 4px 0 0 0;
            color: #333;
          }
          .box-ttd {
            text-align: center;
            width: 320px;
          }
          .box-ttd p { margin: 2px 0; }
          .badge-bsre {
            display: inline-block;
            background: #064e3b;
            color: #fff;
            padding: 3px 8px;
            font-size: 8pt;
            font-weight: bold;
            border-radius: 4px;
            margin: 6px 0;
          }
        </style>
      </head>
      <body>
        <div class="kop">
          <h2>PENGADILAN NEGERI KELAS I A KHUSUS BANDUNG</h2>
          <h3>KEPANITERAAN HUKUM</h3>
          <p>${instansi.Alamat || 'Jl. L.L.R.E. Martadinata No. 74-80, Bandung'}</p>
        </div>

        <div class="title">
          <h4>AKTA PENDAFTARAN & LEGALISASI SURAT KUASA</h4>
          <p>Nomor: ${dataReg.No_Register_Resmi}</p>
        </div>

        <div class="content">
          Pada hari ini, bertempat di Kantor Kepaniteraan Pengadilan Negeri Kelas I A Khusus, telah didaftarkan dan dilegalisasi dalam Buku Register Elektronik Khusus Surat Kuasa untuk perkara perdata gugatan/permohonan dengan register perkara:
        </div>

        <table class="table-data">
          <tr>
            <td width="30%"><strong>Nomor Perkara</strong></td>
            <td width="3%">:</td>
            <td width="67%"><strong>${dataReg.Nomor_Perkara || '-'}</strong></td>
          </tr>
          <tr>
            <td><strong>Pemberi Kuasa (Prinsipal)</strong></td>
            <td>:</td>
            <td>${dataReg.Nama_Pemberi_Kuasa}</td>
          </tr>
          <tr>
            <td><strong>Penerima Kuasa (Advokat)</strong></td>
            <td>:</td>
            <td>${dataReg.Nama_Penerima_Kuasa} (${dataReg.Organisasi_Advokat || 'Advokat'})</td>
          </tr>
          <tr>
            <td><strong>Penyetoran PNBP Kas Negara</strong></td>
            <td>:</td>
            <td>Lunas Rp10.000 (NTPN: ${dataReg.Kode_Billing || '-'})</td>
          </tr>
        </table>

        <div class="content">
          Surat Kuasa ini telah diteliti keaslian serta kelengkapan administratifnya (keabsahan KTA Advokat, Berita Acara Sumpah pada Pengadilan Tinggi, serta pemenuhan Bea Meterai) dan dinyatakan memenuhi syarat formil beracara sesuai SEMA No. 6 Tahun 1994 jo. PERMA No. 7 Tahun 2022.
        </div>

        <table class="footer-section">
          <tr>
            <td width="40%">
              <div class="box-qr">
                <img src="${qrApiUrl}" alt="QR Code Verifikasi">
                <p><strong>SCAN UNTUK VALIDASI</strong></p>
                <p>Keabsahan Sidang Pengadilan</p>
                <p style="font-size: 7pt; font-family: monospace;">HASH: ${(dataReg.Kode_Verifikasi_QR || '').slice(0, 16)}...</p>
              </div>
            </td>
            <td width="60%">
              <div class="box-ttd">
                <p>Bandung, ${dataReg.Tanggal_Pengesahan || Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd MMMM yyyy')}</p>
                <p><strong>An. KETUA PENGADILAN NEGERI BANDUNG</strong></p>
                <p>PANITERA MUDA HUKUM</p>
                <div class="badge-bsre">DITANDATANGANI SECARA ELEKTRONIK</div>
                <br><br>
                <p><strong><u>${pejabatAktif.Nama_Lengkap}</u></strong></p>
                <p>NIP. ${pejabatAktif.NIP}</p>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = Utilities.newBlob(htmlTemplate, 'text/html', 'Akta_Kuasa_' + dataReg.ID_Pengajuan + '.html')
      .getAs('application/pdf')
      .setName('Akta_Legalisasi_' + (dataReg.No_Register_Resmi || dataReg.ID_Pengajuan).replace(/\//g, '_') + '.pdf');

    const pdfFile = pdfFolder.createFile(blob);
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return pdfFile.getUrl();
  } catch (err) {
    Logger.log('Gagal membuat PDF: ' + err.message);
    return '';
  }
}
