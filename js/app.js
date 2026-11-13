/**
 * ============================================================================
 * E-KUASA FRONTEND APPLICATION ENGINE (app.js)
 * Single Page Application (SPA) Reaktif & Zero-Delay Navigation
 * Sesuai panduan: gas-pro-api, gas-scale-turbo, gas-pwa-github
 * DILENGKAPI: ADMIN SYSTEM RULES & ROLE-BASED ACCESS CONTROL (RBAC) ENGINE
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. STATE MANAGEMENT & REALISTIC SEED DATA (OFFICIAL COURT SAMPLE)
  // ==========================================================================
  const defaultRegistrations = [
    {
      idPengajuan: 'EKU-20261113-0042',
      noRegister: '142/HK.02/SK/XI/2026/PN.Bdg',
      tanggal: '2026-11-13 08:30:00',
      jenisKuasa: 'Kuasa Khusus Advokat',
      nomorPerkara: '45/Pdt.G/2026/PN.Bdg',
      posisiPihak: 'Penggugat',
      namaPemberiKuasa: 'PT Graha Abadi Sentosa / Ir. H. Bambang Soeprapto',
      nikPemberiKuasa: '3273012998750003',
      namaPenerimaKuasa: 'Faisal Hendrawan, S.H., M.H.',
      organisasiAdvokat: 'PERADI',
      noKta: '18.64821/PERADI',
      noHpWa: '081298421100',
      emailPemohon: 'faisal.law@lawyer.id',
      kodeBilling: '982736182901',
      nominalPnbp: 10000,
      status: 'Terdaftar & Sah',
      catatan: 'KTA PERADI aktif s.d Des 2027. Berita Acara Sumpah PT Jabar terlampir legalisir. PNBP Lunas.',
      tanggalSah: '13 November 2026 • 08:45:12 WIB',
      pejabatSah: 'Siti Rahayu, S.H. (Panitera Muda Hukum)',
      tokenHash: '7f89ce06a4103b7d80f002ac16e40208dcb921',
      kualifikasi: 'Kuasa Khusus Mewakili di Seluruh Proses Persidangan (Litigasi Penuh Tingkat Pertama, Replik, Duplik, Pembuktian, Kesimpulan, dan Mediasi)'
    },
    {
      idPengajuan: 'EKU-20261113-0043',
      noRegister: '',
      tanggal: '2026-11-13 08:40:00',
      jenisKuasa: 'Kuasa Insidentil (Keluarga)',
      nomorPerkara: '112/Pdt.P/2026/PN.Bdg',
      posisiPihak: 'Pemohon',
      namaPemberiKuasa: 'Bambang Sutejo',
      nikPemberiKuasa: '3273012998750014',
      namaPenerimaKuasa: 'Drs. Eko Prasetyo, M.M.',
      organisasiAdvokat: 'Keluarga Kandung',
      noKta: '-',
      noHpWa: '081399887766',
      emailPemohon: 'eko.prasetyo@email.com',
      kodeBilling: '982736182902',
      nominalPnbp: 10000,
      status: 'Siap Disahkan',
      catatan: 'Surat Izin Ketua Pengadilan Negeri terlampir lengkap.',
      tanggalSah: '',
      pejabatSah: '',
      tokenHash: '',
      kualifikasi: 'Kuasa Insidentil untuk perkara permohonan penetapan ahli waris.'
    },
    {
      idPengajuan: 'EKU-20261113-0044',
      noRegister: '',
      tanggal: '2026-11-13 08:50:00',
      jenisKuasa: 'Kuasa Khusus Advokat',
      nomorPerkara: '32/Pdt.G/2026/PN.Bdg',
      posisiPihak: 'Penggugat',
      namaPemberiKuasa: 'Dinas Bina Marga & Tata Ruang',
      nikPemberiKuasa: '3273012998750025',
      namaPenerimaKuasa: 'Gunawan Santoso, S.H.',
      organisasiAdvokat: 'KAI',
      noKta: '11.89012/KAI',
      noHpWa: '081233445566',
      emailPemohon: 'gunawan.legal@email.com',
      kodeBilling: '982736182903',
      nominalPnbp: 10000,
      status: 'Perlu Perbaikan',
      catatan: 'Catatan: Masa berlaku KTA Advokat habis (Desember 2025). Harap perbarui KTA atau lampirkan tanda perpanjangan resmi.',
      tanggalSah: '',
      pejabatSah: '',
      tokenHash: '',
      kualifikasi: 'Kuasa Khusus Gugatan Perbuatan Melawan Hukum.'
    },
    {
      idPengajuan: 'EKU-20261113-0045',
      noRegister: '',
      tanggal: '2026-11-13 09:10:00',
      jenisKuasa: 'Jaksa Pengacara Negara (JPN)',
      nomorPerkara: '89/Pdt.G/2026/PN.Bdg',
      posisiPihak: 'Tergugat',
      namaPemberiKuasa: 'Pemerintah Kota Bandung',
      nikPemberiKuasa: '3273000000000001',
      namaPenerimaKuasa: 'Anisa Wardani, S.H. (Kasi Datun Kejari)',
      organisasiAdvokat: 'Kejaksaan Negeri Kota Bandung',
      noKta: 'NIP. 19860412 201012 2 003',
      noHpWa: '081122334455',
      emailPemohon: 'datun.kejari@kejaksaan.go.id',
      kodeBilling: '982736182904',
      nominalPnbp: 10000,
      status: 'Menunggu Verifikasi',
      catatan: 'SKK Walikota dan Surat Perintah Tugas Kepala Kejaksaan Negeri lengkap.',
      tanggalSah: '',
      pejabatSah: '',
      tokenHash: '',
      kualifikasi: 'Mewakili Pemerintah Kota Bandung dalam perkara sengketa tanah aset.'
    }
  ];

  const defaultMasterPejabat = [
    {
      id: 'PJB-001',
      nama: 'Siti Rahayu, S.H.',
      nip: '19780512 200212 2 001',
      jabatan: 'Panitera Muda Hukum',
      status: 'Aktif (Utama)',
      sk: 'SK KMA No: 498/KMA/SK/VIII/2023'
    },
    {
      id: 'PJB-002',
      nama: 'Drs. H. Mulyadi, S.H., M.H.',
      nip: '19690315 199403 1 002',
      jabatan: 'Panitera Pengadilan Negeri',
      status: 'Cadangan / Plh',
      sk: 'SK Dirjen Badilum No: 122/DJU/2021'
    },
    {
      id: 'PJB-003',
      nama: 'Ahmad Fauzi, S.H.',
      nip: '19850928 200801 1 005',
      jabatan: 'Panitera Pengganti (Plt Panmud)',
      status: 'Nonaktif',
      sk: 'Masa tugas berakhir'
    }
  ];

  const defaultMasterStaf = [
    {
      id: 'USR-001',
      nama: 'Administrator TI / PTIP',
      email: 'admin.ptip@pn-bandung.go.id',
      peran: 'Super Admin',
      status: 'Aktif'
    },
    {
      id: 'USR-002',
      nama: 'Siti Rahayu, S.H.',
      email: 'siti.rahayu@pn-bandung.go.id',
      peran: 'Panitera Muda Hukum',
      status: 'Aktif'
    },
    {
      id: 'USR-003',
      nama: 'Budi Santoso, A.Md.',
      email: 'budi.ptsp@pn-bandung.go.id',
      peran: 'Verifikator PTSP',
      status: 'Aktif'
    },
    {
      id: 'USR-004',
      nama: 'Drs. H. Mulyadi, S.H., M.H.',
      email: 'mulyadi@pn-bandung.go.id',
      peran: 'Panitera Pengadilan',
      status: 'Aktif'
    }
  ];

  const defaultRbacMatrix = {
    admin: ['portal-publik', 'lacak-dan-unduh', 'meja-verifikator-ptsp', 'otorisasi-panitera', 'pengaturan-master', 'buku-register-dan-statistik', 'scan-qr-sidang'],
    panitera: ['portal-publik', 'lacak-dan-unduh', 'meja-verifikator-ptsp', 'otorisasi-panitera', 'buku-register-dan-statistik', 'scan-qr-sidang'],
    verifikator: ['portal-publik', 'lacak-dan-unduh', 'meja-verifikator-ptsp', 'buku-register-dan-statistik', 'scan-qr-sidang'],
    pemohon: ['portal-publik', 'lacak-dan-unduh', 'scan-qr-sidang'],
    hakim: ['buku-register-dan-statistik', 'scan-qr-sidang', 'lacak-dan-unduh', 'portal-publik']
  };

  const defaultSystemRules = {
    wajibPnbp: true,
    dualLevelVerif: true,
    pinTteProtection: true,
    notifWa: true,
    notifEmail: true,
    maintenance: false,
    batasRevisiHari: 3,
    maxFileMb: 5
  };

  let appState = {
    registrations: JSON.parse(localStorage.getItem('ekuasa_reg')) || defaultRegistrations,
    masterPejabat: JSON.parse(localStorage.getItem('ekuasa_pejabat')) || defaultMasterPejabat,
    masterStaf: JSON.parse(localStorage.getItem('ekuasa_staf')) || defaultMasterStaf,
    formatNomor: localStorage.getItem('ekuasa_format_nomor') || '{NO}/HK.02/SK/{BULAN_ROMAWI}/{TAHUN}/PN.Bdg',
    counterTerakhir: parseInt(localStorage.getItem('ekuasa_counter') || '141', 10),
    currentRole: localStorage.getItem('ekuasa_role') || 'admin',
    rbacMatrix: JSON.parse(localStorage.getItem('ekuasa_rbac')) || defaultRbacMatrix,
    systemRules: JSON.parse(localStorage.getItem('ekuasa_rules')) || defaultSystemRules,
    masterActiveTab: 'rules', // 'rules' | 'rbac' | 'pejabat' | 'format' | 'pengguna'
    activeTab: 'portal-publik',
    activeVerifierId: 'EKU-20261113-0042',
    activeApproverId: 'EKU-20261113-0043',
    currentDocTab: 'kuasa' // 'kuasa' | 'kta' | 'bas' | 'pnbp'
  };

  function saveState() {
    localStorage.setItem('ekuasa_reg', JSON.stringify(appState.registrations));
    localStorage.setItem('ekuasa_pejabat', JSON.stringify(appState.masterPejabat));
    localStorage.setItem('ekuasa_staf', JSON.stringify(appState.masterStaf));
    localStorage.setItem('ekuasa_format_nomor', appState.formatNomor);
    localStorage.setItem('ekuasa_counter', String(appState.counterTerakhir));
    localStorage.setItem('ekuasa_role', appState.currentRole);
    localStorage.setItem('ekuasa_rbac', JSON.stringify(appState.rbacMatrix));
    localStorage.setItem('ekuasa_rules', JSON.stringify(appState.systemRules));
  }

  // ==========================================================================
  // 2. TOAST NOTIFICATION ENGINE
  // ==========================================================================
  function showToast(message, type = 'success') {
    const toast = document.getElementById('global-toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    if (!toast || !toastMsg) return;

    toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 text-white font-medium text-sm';
    
    if (type === 'success') {
      toast.classList.add('bg-primary');
      if (toastIcon) toastIcon.textContent = 'check_circle';
    } else if (type === 'error') {
      toast.classList.add('bg-error');
      if (toastIcon) toastIcon.textContent = 'error';
    } else if (type === 'warning') {
      toast.classList.add('bg-seal-gold');
      if (toastIcon) toastIcon.textContent = 'warning';
    } else {
      toast.classList.add('bg-secondary');
      if (toastIcon) toastIcon.textContent = 'info';
    }

    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  // ==========================================================================
  // 3. RBAC ENFORCEMENT & ZERO-DELAY NAVIGATION
  // ==========================================================================
  function canAccessTab(role, tabId) {
    if (role === 'admin') return true;
    const allowed = appState.rbacMatrix[role] || [];
    return allowed.includes(tabId);
  }

  function switchTab(targetTabId) {
    // Periksa apakah peran memiliki izin untuk tab target
    if (targetTabId !== 'akses-dibatasi' && !canAccessTab(appState.currentRole, targetTabId)) {
      showRestrictedView(targetTabId);
      return;
    }

    appState.activeTab = targetTabId;

    // Sembunyikan semua tab content
    document.querySelectorAll('.tab-view').forEach(view => {
      view.classList.add('hidden');
    });

    // Tampilkan tab terpilih
    const activeView = document.getElementById('view-' + targetTabId);
    if (activeView) {
      activeView.classList.remove('hidden');
    }

    // Perbarui style tombol navigasi
    document.querySelectorAll('[data-nav-tab]').forEach(btn => {
      const tabName = btn.getAttribute('data-nav-tab');
      if (tabName === targetTabId) {
        btn.classList.add('bg-primary-container', 'text-on-primary');
        btn.classList.remove('text-on-surface-variant', 'text-on-surface');
      } else {
        btn.classList.remove('bg-primary-container', 'text-on-primary');
        btn.classList.add('text-on-surface-variant');
      }
    });

    // Render ulang konten tab terkait
    if (targetTabId === 'meja-verifikator-ptsp') {
      renderVerifierQueue();
      renderVerifierDetail(appState.activeVerifierId);
    } else if (targetTabId === 'otorisasi-panitera') {
      renderApproverQueue();
      renderApproverDetail(appState.activeApproverId);
    } else if (targetTabId === 'buku-register-dan-statistik') {
      renderBukuRegister();
    } else if (targetTabId === 'pengaturan-master') {
      renderMasterTab(appState.masterActiveTab);
    }

    // Scroll ke atas dengan halus
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showRestrictedView(targetTabId) {
    document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
    const restrictedView = document.getElementById('view-akses-dibatasi');
    const roleLabel = document.getElementById('restricted-role-name');
    if (roleLabel) {
      const roleMap = {
        admin: 'Super Admin',
        panitera: 'Panitera Muda Hukum',
        verifikator: 'Verifikator PTSP',
        pemohon: 'Pemohon Publik / Advokat',
        hakim: 'Hakim Sidang'
      };
      roleLabel.textContent = roleMap[appState.currentRole] || appState.currentRole;
    }
    if (restrictedView) restrictedView.classList.remove('hidden');
    showToast('Akses menu ditolak oleh Aturan Sistem (Rules RBAC)!', 'error');
  }

  function setRole(newRole) {
    appState.currentRole = newRole;
    saveState();

    // Perbarui dropdown role selector jika ada
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) roleSelector.value = newRole;

    // Perbarui profil tampilan di navbar
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayRole = document.getElementById('user-display-role');
    const userAvatar = document.getElementById('user-avatar');

    if (newRole === 'admin') {
      if (userDisplayName) userDisplayName.textContent = 'Administrator TI / PTIP';
      if (userDisplayRole) {
        userDisplayRole.textContent = 'Super Admin (Rules Mode)';
        userDisplayRole.className = 'text-[10px] text-amber-700 font-semibold';
      }
      if (userAvatar) userAvatar.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcFU7NBGqo33XHkct5tG7CTU_mLCr_Cqhh4UCn-uoe8as8hd4CM9IGrFs0mBLS7-ThAikKBPg7Ovh659wisn0anDcuAoLhUYkXu6tPM-WlAce_moHlHheh6-lRYn6SCAIgCqJ5jqb1t_PUJhWQdbpZRNoRszIhtRpAMme1hGGFrSsAItBMHvGCr366ZGWt5Em6h42a5J4e3QVDiICvcCgSNJVpDzE82O8U3P2Rkww';
    } else if (newRole === 'panitera') {
      if (userDisplayName) userDisplayName.textContent = 'Siti Rahayu, S.H.';
      if (userDisplayRole) {
        userDisplayRole.textContent = 'Panitera Muda Hukum';
        userDisplayRole.className = 'text-[10px] text-emerald-700 font-semibold';
      }
    } else if (newRole === 'verifikator') {
      if (userDisplayName) userDisplayName.textContent = 'Budi Santoso, A.Md.';
      if (userDisplayRole) {
        userDisplayRole.textContent = 'Verifikator Meja PTSP';
        userDisplayRole.className = 'text-[10px] text-blue-700 font-semibold';
      }
    } else if (newRole === 'pemohon') {
      if (userDisplayName) userDisplayName.textContent = 'Faisal Hendrawan, S.H.';
      if (userDisplayRole) {
        userDisplayRole.textContent = 'Advokat / Pemohon Mandiri';
        userDisplayRole.className = 'text-[10px] text-slate-500 font-semibold';
      }
    } else if (newRole === 'hakim') {
      if (userDisplayName) userDisplayName.textContent = 'Dr. Hendra, S.H., M.H.';
      if (userDisplayRole) {
        userDisplayRole.textContent = 'Hakim Sidang Utama';
        userDisplayRole.className = 'text-[10px] text-purple-700 font-semibold';
      }
    }

    // Perbarui indikator izin pada navbar
    updateNavPermissionsVisual();

    // Jika tab aktif saat ini tidak diizinkan untuk peran baru, arahkan ke tab pertama yang diizinkan
    if (!canAccessTab(newRole, appState.activeTab)) {
      const allowed = appState.rbacMatrix[newRole] || ['portal-publik'];
      switchTab(allowed[0]);
    }

    showToast('Mode peran aktif diubah menjadi: ' + newRole.toUpperCase(), 'info');
  }

  function updateNavPermissionsVisual() {
    document.querySelectorAll('[data-nav-tab]').forEach(btn => {
      const tabName = btn.getAttribute('data-nav-tab');
      const isAllowed = canAccessTab(appState.currentRole, tabName);
      if (isAllowed) {
        btn.classList.remove('opacity-40', 'cursor-not-allowed');
      } else {
        btn.classList.add('opacity-40', 'cursor-not-allowed');
      }
    });
  }

  // ==========================================================================
  // 4. PORTAL PUBLIK - STEPPER REGISTRATION FORM
  // ==========================================================================
  let currentStep = 1;

  function initPublicForm() {
    document.querySelectorAll('[data-step-target]').forEach(stepBtn => {
      stepBtn.addEventListener('click', () => {
        const target = parseInt(stepBtn.getAttribute('data-step-target'), 10);
        goToStep(target);
      });
    });

    const btnNext = document.getElementById('btn-step-next');
    const btnPrev = document.getElementById('btn-step-prev');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentStep < 4) goToStep(currentStep + 1);
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (currentStep > 1) goToStep(currentStep - 1);
      });
    }

    const formDaftar = document.getElementById('form-pendaftaran-kuasa');
    if (formDaftar) {
      formDaftar.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmitPermohonan();
      });
    }
  }

  function goToStep(stepNum) {
    currentStep = stepNum;
    for (let i = 1; i <= 4; i++) {
      const stepContent = document.getElementById('step-content-' + i);
      const stepHeader = document.getElementById('step-indicator-' + i);
      if (stepContent) {
        if (i === currentStep) stepContent.classList.remove('hidden');
        else stepContent.classList.add('hidden');
      }
      if (stepHeader) {
        if (i === currentStep) {
          stepHeader.classList.add('border-primary', 'bg-primary-container', 'text-white');
          stepHeader.classList.remove('bg-surface-container', 'text-secondary');
        } else if (i < currentStep) {
          stepHeader.classList.add('border-status-sah-border', 'bg-status-sah-bg', 'text-status-sah-text');
          stepHeader.classList.remove('bg-primary-container', 'text-white');
        } else {
          stepHeader.classList.remove('border-primary', 'bg-primary-container', 'text-white', 'bg-status-sah-bg', 'text-status-sah-text');
          stepHeader.classList.add('bg-surface-container', 'text-secondary');
        }
      }
    }
  }

  function handleSubmitPermohonan() {
    // Periksa apakah sistem dalam Mode Pemeliharaan (Rules Enforcement)
    if (appState.systemRules.maintenance) {
      showToast('Pendaftaran ditutup sementara: Mode Pemeliharaan Server sedang aktif!', 'warning');
      return;
    }

    const jenisKuasa = document.getElementById('input-jenis-kuasa')?.value || 'Kuasa Khusus Advokat';
    const nomorPerkara = document.getElementById('input-nomor-perkara')?.value || '45/Pdt.G/2026/PN.Bdg';
    const namaPemberi = document.getElementById('input-nama-pemberi')?.value || 'PT Maju Terus / Budi Santoso';
    const nikPemberi = document.getElementById('input-nik-pemberi')?.value || '3273012998750005';
    const namaAdvokat = document.getElementById('input-nama-advokat')?.value || 'Faisal Hendrawan, S.H., M.H.';
    const noHpWa = document.getElementById('input-no-wa')?.value || '081298421100';
    const emailPemohon = document.getElementById('input-email')?.value || 'faisal.law@lawyer.id';
    const kodeBilling = document.getElementById('input-kode-billing')?.value || '982736182905';

    // Buat data pendaftaran baru
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randNum = ('000' + Math.floor(Math.random() * 9000 + 1000)).slice(-4);
    const newId = 'EKU-' + dateStr + '-' + randNum;

    // Evaluasi Aturan Dual-Level Verif (Rules Enforcement)
    const initialStatus = appState.systemRules.dualLevelVerif ? 'Menunggu Verifikasi' : 'Siap Disahkan';

    const newEntry = {
      idPengajuan: newId,
      noRegister: '',
      tanggal: today.toLocaleString('id-ID'),
      jenisKuasa: jenisKuasa,
      nomorPerkara: nomorPerkara,
      posisiPihak: 'Penggugat',
      namaPemberiKuasa: namaPemberi,
      nikPemberiKuasa: nikPemberi,
      namaPenerimaKuasa: namaAdvokat,
      organisasiAdvokat: 'PERADI',
      noKta: '18.64821/PERADI',
      noHpWa: noHpWa,
      emailPemohon: emailPemohon,
      kodeBilling: kodeBilling,
      nominalPnbp: 10000,
      status: initialStatus,
      catatan: 'Dokumen baru masuk dari Portal Publik. Menunggu pemeriksaan verifikator.',
      tanggalSah: '',
      pejabatSah: '',
      tokenHash: '',
      kualifikasi: 'Mewakili kepentingan hukum pemberi kuasa di persidangan.'
    };

    appState.registrations.unshift(newEntry);
    saveState();

    showToast('Permohonan pendaftaran surat kuasa berhasil dikirim! Kode Tiket: ' + newId, 'success');

    // Reset dan pindah ke halaman lacak
    setTimeout(() => {
      const trackingInput = document.getElementById('input-lacak-tiket');
      if (trackingInput) trackingInput.value = newId;
      switchTab('lacak-dan-unduh');
      handleLacakDokumen(newId);
    }, 1200);
  }

  // ==========================================================================
  // 5. LACAK STATUS & UNDUH AKTA LEGALISASI
  // ==========================================================================
  function handleLacakDokumen(query) {
    if (!query) return;
    const cleanQ = query.trim().toLowerCase();
    const item = appState.registrations.find(r => 
      r.idPengajuan.toLowerCase().includes(cleanQ) ||
      (r.noRegister && r.noRegister.toLowerCase().includes(cleanQ)) ||
      (r.noHpWa && r.noHpWa.includes(cleanQ))
    );

    const resultContainer = document.getElementById('lacak-result-container');
    const emptyState = document.getElementById('lacak-empty-state');
    if (!resultContainer) return;

    if (!item) {
      if (emptyState) emptyState.classList.remove('hidden');
      resultContainer.classList.add('hidden');
      showToast('Data permohonan tidak ditemukan. Periksa kembali nomor tiket Anda.', 'warning');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // Isi data detail
    document.getElementById('lacak-tiket-id').textContent = item.idPengajuan;
    document.getElementById('lacak-perkara').textContent = item.nomorPerkara;
    document.getElementById('lacak-pemberi').textContent = item.namaPemberiKuasa;
    document.getElementById('lacak-penerima').textContent = item.namaPenerimaKuasa;
    document.getElementById('lacak-status-badge').textContent = item.status;

    // Perbarui badge warna status
    const badge = document.getElementById('lacak-status-badge');
    badge.className = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ';
    if (item.status === 'Terdaftar & Sah') {
      badge.classList.add('bg-status-sah-bg', 'text-status-sah-text', 'border', 'border-status-sah-border');
    } else if (item.status === 'Perlu Perbaikan') {
      badge.classList.add('bg-status-revision-bg', 'text-status-revision-text', 'border', 'border-status-revision-border');
    } else {
      badge.classList.add('bg-status-pending-bg', 'text-status-pending-text', 'border', 'border-status-pending-border');
    }

    // Tampilkan / sembunyikan kotak akta resmi
    const boxAkta = document.getElementById('lacak-box-akta-sah');
    if (boxAkta) {
      if (item.status === 'Terdaftar & Sah') {
        boxAkta.classList.remove('hidden');
        document.getElementById('lacak-no-register').textContent = item.noRegister;
        document.getElementById('lacak-pejabat-sah').textContent = item.pejabatSah;
      } else {
        boxAkta.classList.add('hidden');
      }
    }

    // Catatan revisi jika ada
    const boxCatatan = document.getElementById('lacak-box-catatan');
    if (boxCatatan) {
      if (item.catatan) {
        boxCatatan.classList.remove('hidden');
        document.getElementById('lacak-catatan-teks').textContent = item.catatan;
      } else {
        boxCatatan.classList.add('hidden');
      }
    }
  }

  // ==========================================================================
  // 6. MEJA VERIFIKATOR PTSP HUKUM
  // ==========================================================================
  function renderVerifierQueue(filter = 'all') {
    const queueList = document.getElementById('verifier-queue-list');
    if (!queueList) return;

    let items = appState.registrations;
    if (filter === 'menunggu') items = items.filter(r => r.status === 'Menunggu Verifikasi');
    else if (filter === 'revisi') items = items.filter(r => r.status === 'Perlu Perbaikan');

    const cMenunggu = appState.registrations.filter(r => r.status === 'Menunggu Verifikasi').length;
    const cRevisi = appState.registrations.filter(r => r.status === 'Perlu Perbaikan').length;
    const cDiteruskan = appState.registrations.filter(r => r.status === 'Siap Disahkan' || r.status === 'Terdaftar & Sah').length;

    const elKpiMenunggu = document.getElementById('verif-kpi-menunggu');
    const elKpiRevisi = document.getElementById('verif-kpi-revisi');
    const elKpiDiteruskan = document.getElementById('verif-kpi-diteruskan');
    if (elKpiMenunggu) elKpiMenunggu.textContent = cMenunggu;
    if (elKpiRevisi) elKpiRevisi.textContent = cRevisi;
    if (elKpiDiteruskan) elKpiDiteruskan.textContent = cDiteruskan;

    queueList.innerHTML = items.map(item => {
      const isSelected = item.idPengajuan === appState.activeVerifierId;
      let statusClass = 'bg-status-pending-bg text-status-pending-text border-status-pending-border';
      if (item.status === 'Terdaftar & Sah') statusClass = 'bg-status-sah-bg text-status-sah-text border-status-sah-border';
      if (item.status === 'Perlu Perbaikan') statusClass = 'bg-status-revision-bg text-status-revision-text border-status-revision-border';
      if (item.status === 'Siap Disahkan') statusClass = 'bg-primary-fixed text-primary border-primary';

      return `
        <div data-verifier-select="${item.idPengajuan}" class="p-3.5 rounded-xl border transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary-container/10 shadow-sm' : 'border-border-subtle bg-white hover:bg-slate-50'}">
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-mono text-xs font-bold text-primary">${item.idPengajuan}</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusClass}">${item.status}</span>
          </div>
          <div class="text-sm font-semibold text-slate-900">${item.nomorPerkara}</div>
          <div class="text-xs text-slate-500 mt-0.5 line-clamp-1">Advokat: ${item.namaPenerimaKuasa}</div>
          <div class="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Pihak: ${item.namaPemberiKuasa.slice(0, 20)}...</span>
            <span class="text-primary font-medium">Buka Berkas &rarr;</span>
          </div>
        </div>
      `;
    }).join('');

    queueList.querySelectorAll('[data-verifier-select]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-verifier-select');
        appState.activeVerifierId = id;
        renderVerifierQueue(filter);
        renderVerifierDetail(id);
      });
    });
  }

  function renderVerifierDetail(id) {
    const item = appState.registrations.find(r => r.idPengajuan === id) || appState.registrations[0];
    if (!item) return;

    const elId = document.getElementById('verif-detail-id');
    const elPerkara = document.getElementById('verif-detail-perkara');
    const elPemberi = document.getElementById('verif-detail-pemberi');
    const elPenerima = document.getElementById('verif-detail-penerima');
    const elPnbp = document.getElementById('verif-detail-pnbp');
    if (elId) elId.textContent = item.idPengajuan;
    if (elPerkara) elPerkara.textContent = item.nomorPerkara;
    if (elPemberi) elPemberi.textContent = item.namaPemberiKuasa;
    if (elPenerima) elPenerima.textContent = item.namaPenerimaKuasa + ' (' + (item.organisasiAdvokat || 'Advokat') + ')';
    if (elPnbp) elPnbp.textContent = 'Rp 10.000 (NTPN: ' + item.kodeBilling + ')';

    updateDocViewer(item);
  }

  function updateDocViewer(item) {
    const canvas = document.getElementById('verif-doc-canvas');
    if (!canvas) return;

    if (appState.currentDocTab === 'kuasa') {
      canvas.innerHTML = `
        <div class="w-full bg-white p-8 border border-slate-200 shadow-sm rounded-lg text-slate-900 font-serif leading-relaxed text-sm">
          <div class="text-center font-bold uppercase tracking-wide border-b border-black pb-2 mb-4">
            <h3 class="text-base">KANTOR ADVOKAT & KONSULTAN HUKUM</h3>
            <p class="text-xs font-sans text-slate-600 font-normal">FAISAL HENDRAWAN & REKAN • BANDUNG</p>
          </div>
          <h4 class="text-center font-bold text-base underline mb-3">SURAT KUASA KHUSUS</h4>
          <p class="text-xs text-justify mb-2">Yang bertanda tangan di bawah ini:</p>
          <div class="pl-4 text-xs mb-3 space-y-1">
            <p><strong>Nama</strong>: ${item.namaPemberiKuasa}</p>
            <p><strong>NIK</strong>: ${item.nikPemberiKuasa}</p>
            <p><strong>Kedudukan</strong>: ${item.posisiPihak} dalam Perkara No: <strong>${item.nomorPerkara}</strong></p>
          </div>
          <p class="text-xs mb-2">Dengan ini memberi kuasa khusus kepada:</p>
          <div class="pl-4 text-xs mb-3 space-y-1">
            <p><strong>Nama</strong>: <u>${item.namaPenerimaKuasa}</u></p>
            <p><strong>KTA</strong>: ${item.noKta}</p>
          </div>
          <p class="text-xs text-justify mb-4">Untuk mewakili, mendampingi, dan membela hak-hak serta kepentingan hukum Pemberi Kuasa pada Pengadilan Negeri Kelas I A Khusus...</p>
          <div class="flex justify-between items-end pt-4 border-t border-slate-100 text-xs">
            <div class="text-center">
              <p>Penerima Kuasa</p>
              <br><br>
              <p class="font-bold underline">${item.namaPenerimaKuasa}</p>
            </div>
            <div class="border border-amber-400 bg-amber-50 p-2 text-center rounded text-[11px] text-amber-800">
              METERAI ELEKTRONIK<br><strong>Rp 10.000 SAH</strong>
            </div>
            <div class="text-center">
              <p>Pemberi Kuasa</p>
              <br><br>
              <p class="font-bold underline">${item.namaPemberiKuasa.split('/')[0]}</p>
            </div>
          </div>
        </div>
      `;
    } else if (appState.currentDocTab === 'kta') {
      canvas.innerHTML = `
        <div class="w-full max-w-md mx-auto bg-gradient-to-r from-slate-900 to-primary text-white p-6 rounded-2xl shadow-md font-sans">
          <div class="flex justify-between items-center border-b border-white/20 pb-3 mb-4">
            <span class="font-bold tracking-wider text-xs uppercase">KARTU TANDA ANGGOTA ADVOKAT</span>
            <span class="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">BERLAKU AKTIF</span>
          </div>
          <div class="flex gap-4 items-center">
            <div class="w-20 h-24 bg-white/20 rounded-lg flex items-center justify-center font-bold text-xs">FOTO RESMI</div>
            <div class="space-y-1 text-xs">
              <p class="font-bold text-sm text-white">${item.namaPenerimaKuasa}</p>
              <p class="text-slate-300">NIA: ${item.noKta}</p>
              <p class="text-slate-300">Organisasi: ${item.organisasiAdvokat}</p>
              <p class="text-amber-300 text-[11px] mt-2">Masa Berlaku: s.d 31 Des 2027</p>
            </div>
          </div>
        </div>
      `;
    } else if (appState.currentDocTab === 'bas') {
      canvas.innerHTML = `
        <div class="w-full bg-white p-6 border border-slate-200 rounded-lg font-serif text-xs leading-relaxed">
          <div class="text-center font-bold uppercase mb-3">
            <p>PENGADILAN TINGGI JAWA BARAT</p>
            <p class="underline font-bold text-sm">BERITA ACARA SUMPAH ADVOKAT</p>
          </div>
          <p class="text-justify mb-2">Pada hari ini telah diambil sumpah Advokat atas nama <strong>${item.namaPenerimaKuasa}</strong> di hadapan Sidang Terbuka Pengadilan Tinggi sesuai ketentuan Undang-Undang No. 18 Tahun 2003 tentang Advokat...</p>
          <div class="text-right pt-4 text-xs font-sans">
            <span class="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span class="material-symbols-outlined text-sm">verified</span> BAS Terverifikasi Otentik
            </span>
          </div>
        </div>
      `;
    } else if (appState.currentDocTab === 'pnbp') {
      canvas.innerHTML = `
        <div class="w-full bg-white p-6 border border-slate-200 rounded-lg font-sans text-xs">
          <div class="border-b pb-3 mb-3 flex justify-between items-center">
            <span class="font-bold text-slate-800 uppercase">BUKTI PENERIMAAN NEGARA BUKAN PAJAK (SIMPONI MPN-G3)</span>
            <span class="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">LUNAS</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-slate-700">
            <div><span class="text-slate-400">Kode NTPN:</span> <strong>${item.kodeBilling}</strong></div>
            <div><span class="text-slate-400">Akun Mata Anggaran:</span> 425239 (Legalisasi Kuasa)</div>
            <div><span class="text-slate-400">Nama Penyetor:</span> ${item.namaPenerimaKuasa}</div>
            <div><span class="text-slate-400">Jumlah Setoran:</span> <strong class="text-primary font-bold">Rp 10.000,-</strong></div>
          </div>
        </div>
      `;
    }
  }

  function handleVerifierAction(decision) {
    const item = appState.registrations.find(r => r.idPengajuan === appState.activeVerifierId);
    if (!item) return;

    if (decision === 'LOLOS') {
      item.status = 'Siap Disahkan';
      item.catatan = 'Berkas lengkap dan syarat KTA/BAS/Meterai/PNBP lolos verifikasi meja PTSP.';
      saveState();
      showToast('Berkas ' + item.idPengajuan + ' berhasil lolos dan diteruskan ke Ruang Otorisasi Panitera!', 'success');
      renderVerifierQueue();
      renderVerifierDetail(item.idPengajuan);
    } else if (decision === 'REVISI') {
      const modal = document.getElementById('modal-verif-revisi');
      if (modal) modal.classList.remove('hidden');
    }
  }

  // ==========================================================================
  // 7. RUANG OTORISASI & TTE PANITERA MUDA HUKUM
  // ==========================================================================
  function renderApproverQueue() {
    const queueList = document.getElementById('approver-queue-list');
    if (!queueList) return;

    const readyItems = appState.registrations.filter(r => r.status === 'Siap Disahkan');
    const approvedCount = appState.registrations.filter(r => r.status === 'Terdaftar & Sah').length;

    const elCountReady = document.getElementById('approver-count-ready');
    const elCountApproved = document.getElementById('approver-count-approved');
    if (elCountReady) elCountReady.textContent = readyItems.length + ' Berkas';
    if (elCountApproved) elCountApproved.textContent = approvedCount + ' Berkas';

    if (readyItems.length === 0) {
      queueList.innerHTML = `
        <div class="p-6 text-center text-slate-400 text-xs">
          <span class="material-symbols-outlined text-3xl mb-1 text-slate-300">task_alt</span>
          <p>Semua berkas yang lolos telah disahkan.</p>
        </div>
      `;
      return;
    }

    queueList.innerHTML = readyItems.map(item => {
      const isSelected = item.idPengajuan === appState.activeApproverId;
      return `
        <div data-approver-select="${item.idPengajuan}" class="p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white hover:bg-slate-50'}">
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold text-primary">${item.idPengajuan}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Siap TTE</span>
          </div>
          <div class="text-xs font-semibold text-slate-900 mt-1">${item.nomorPerkara}</div>
          <div class="text-[11px] text-slate-500">${item.namaPenerimaKuasa}</div>
        </div>
      `;
    }).join('');

    queueList.querySelectorAll('[data-approver-select]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-approver-select');
        appState.activeApproverId = id;
        renderApproverQueue();
        renderApproverDetail(id);
      });
    });
  }

  function renderApproverDetail(id) {
    const item = appState.registrations.find(r => r.idPengajuan === id) || 
                 appState.registrations.find(r => r.status === 'Siap Disahkan') ||
                 appState.registrations[0];
    if (!item) return;

    const nextCounter = appState.counterTerakhir + 1;
    const now = new Date();
    const romawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    const noRegPreview = appState.formatNomor
      .replace('{NO}', nextCounter)
      .replace('{BULAN_ROMAWI}', romawi[now.getMonth()])
      .replace('{TAHUN}', now.getFullYear())
      .replace('{KODE_PN}', 'PN.Bdg');

    const elNoReg = document.getElementById('approver-preview-noreg');
    const elPerkara = document.getElementById('approver-preview-perkara');
    const elPemberi = document.getElementById('approver-preview-pemberi');
    const elPenerima = document.getElementById('approver-preview-penerima');
    if (elNoReg) elNoReg.textContent = item.noRegister || noRegPreview;
    if (elPerkara) elPerkara.textContent = item.nomorPerkara;
    if (elPemberi) elPemberi.textContent = item.namaPemberiKuasa;
    if (elPenerima) elPenerima.textContent = item.namaPenerimaKuasa;
  }

  function executeOtorisasiTTE(pinEntered) {
    const item = appState.registrations.find(r => r.idPengajuan === appState.activeApproverId) ||
                 appState.registrations.find(r => r.status === 'Siap Disahkan');
    if (!item) {
      showToast('Pilih berkas yang siap disahkan terlebih dahulu.', 'warning');
      return;
    }

    // Rules Enforcement: Proteksi PIN TTE
    if (appState.systemRules.pinTteProtection) {
      if (pinEntered !== '123456') {
        showToast('PIN Otorisasi TTE salah! (Gunakan 123456 untuk demo)', 'error');
        return;
      }
    }

    // Bangun Nomor Register Resmi
    appState.counterTerakhir += 1;
    const now = new Date();
    const romawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
    const noRegSah = appState.formatNomor
      .replace('{NO}', appState.counterTerakhir)
      .replace('{BULAN_ROMAWI}', romawi[now.getMonth()])
      .replace('{TAHUN}', now.getFullYear())
      .replace('{KODE_PN}', 'PN.Bdg');

    item.noRegister = noRegSah;
    item.status = 'Terdaftar & Sah';
    item.tanggalSah = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' • ' + now.toLocaleTimeString('id-ID') + ' WIB';
    item.pejabatSah = 'Siti Rahayu, S.H. (Panitera Muda Hukum)';
    item.tokenHash = 'hash_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    saveState();

    showToast('Surat Kuasa berhasil disahkan dengan TTE BSrE! Nomor Register: ' + noRegSah, 'success');

    renderApproverQueue();
    renderApproverDetail(item.idPengajuan);

    setTimeout(() => {
      openModalAktaSah(item);
    }, 600);
  }

  function openModalAktaSah(item) {
    const modal = document.getElementById('modal-akta-sah');
    if (!modal) return;
    document.getElementById('modal-akta-noreg').textContent = item.noRegister;
    document.getElementById('modal-akta-perkara').textContent = item.nomorPerkara;
    document.getElementById('modal-akta-pemberi').textContent = item.namaPemberiKuasa;
    document.getElementById('modal-akta-penerima').textContent = item.namaPenerimaKuasa;
    document.getElementById('modal-akta-tanggal').textContent = item.tanggalSah;
    document.getElementById('modal-akta-pejabat').textContent = item.pejabatSah;
    modal.classList.remove('hidden');
  }

  // ==========================================================================
  // 8. PENGATURAN MASTER DATA & RULES ENGINE
  // ==========================================================================
  function renderMasterTab(tabName) {
    appState.masterActiveTab = tabName;

    // Toggle button subtab style
    document.querySelectorAll('[data-master-tab]').forEach(btn => {
      const name = btn.getAttribute('data-master-tab');
      if (name === tabName) {
        btn.classList.add('bg-primary', 'text-white');
        btn.classList.remove('bg-slate-100', 'text-slate-700');
      } else {
        btn.classList.remove('bg-primary', 'text-white');
        btn.classList.add('bg-slate-100', 'text-slate-700');
      }
    });

    // Toggle panel visibility
    document.querySelectorAll('.master-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    const activePanel = document.getElementById('master-panel-' + tabName);
    if (activePanel) activePanel.classList.remove('hidden');

    if (tabName === 'pejabat') renderMasterPejabat();
    else if (tabName === 'format') updatePatternPreview();
    else if (tabName === 'rules') syncRulesInputs();
    else if (tabName === 'rbac') syncRbacCheckboxes();
    else if (tabName === 'pengguna') renderMasterStaf();
  }

  function syncRulesInputs() {
    const r = appState.systemRules;
    const tPnbp = document.getElementById('rule-toggle-pnbp');
    const tDual = document.getElementById('rule-toggle-dual-verif');
    const tPin = document.getElementById('rule-toggle-pin-tte');
    const tWa = document.getElementById('rule-toggle-notif-wa');
    const tEmail = document.getElementById('rule-toggle-notif-email');
    const tMaint = document.getElementById('rule-toggle-maintenance');
    const iRevisi = document.getElementById('rule-input-batas-revisi');
    const lRevisi = document.getElementById('label-batas-revisi');
    const sMaxFile = document.getElementById('rule-select-max-file');

    if (tPnbp) tPnbp.checked = r.wajibPnbp;
    if (tDual) tDual.checked = r.dualLevelVerif;
    if (tPin) tPin.checked = r.pinTteProtection;
    if (tWa) tWa.checked = r.notifWa;
    if (tEmail) tEmail.checked = r.notifEmail;
    if (tMaint) tMaint.checked = r.maintenance;
    if (iRevisi) iRevisi.value = r.batasRevisiHari;
    if (lRevisi) lRevisi.textContent = r.batasRevisiHari + ' Hari';
    if (sMaxFile) sMaxFile.value = String(r.maxFileMb);
  }

  function syncRbacCheckboxes() {
    document.querySelectorAll('.rbac-chk').forEach(chk => {
      const role = chk.getAttribute('data-role');
      const mod = chk.getAttribute('data-mod');
      const allowedList = appState.rbacMatrix[role] || [];
      chk.checked = allowedList.includes(mod);
    });
  }

  function renderMasterPejabat() {
    const tbody = document.getElementById('table-master-pejabat-body');
    if (!tbody) return;

    tbody.innerHTML = appState.masterPejabat.map(p => {
      let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      if (p.status.includes('Cadangan')) badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
      if (p.status.includes('Nonaktif')) badgeClass = 'bg-slate-100 text-slate-600 border-slate-300';

      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <td class="p-3">
            <div class="font-semibold text-slate-900">${p.nama}</div>
            <div class="text-xs text-slate-500 font-mono">NIP. ${p.nip}</div>
          </td>
          <td class="p-3 text-xs text-slate-700">
            <div>${p.jabatan}</div>
            <div class="text-[11px] text-slate-400">${p.sk}</div>
          </td>
          <td class="p-3 text-center">
            <span class="material-symbols-outlined text-slate-400 text-lg">draw</span>
          </td>
          <td class="p-3">
            <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}">${p.status}</span>
          </td>
          <td class="p-3 text-right space-x-1">
            <button data-pejabat-toggle="${p.id}" class="px-2 py-1 text-xs text-slate-600 font-medium hover:bg-slate-100 rounded border border-slate-200">Ganti Status</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-pejabat-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-pejabat-toggle');
        const p = appState.masterPejabat.find(x => x.id === id);
        if (p) {
          p.status = p.status.includes('Aktif') ? 'Nonaktif' : 'Aktif (Utama)';
          saveState();
          renderMasterPejabat();
          showToast('Status ' + p.nama + ' diperbarui menjadi: ' + p.status, 'info');
        }
      });
    });
  }

  function renderMasterStaf() {
    const tbody = document.getElementById('table-master-staf-body');
    if (!tbody) return;

    tbody.innerHTML = appState.masterStaf.map(u => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td class="p-3">
          <div class="font-semibold text-slate-900">${u.nama}</div>
          <div class="text-xs text-slate-400 font-mono">${u.id}</div>
        </td>
        <td class="p-3 text-xs font-mono text-slate-600">${u.email}</td>
        <td class="p-3">
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">${u.peran}</span>
        </td>
        <td class="p-3">
          <span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}">${u.status}</span>
        </td>
        <td class="p-3 text-right">
          <button data-staf-toggle="${u.id}" class="px-2 py-1 text-xs text-slate-600 font-medium hover:bg-slate-100 rounded border border-slate-200">Toggle Status</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-staf-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-staf-toggle');
        const user = appState.masterStaf.find(x => x.id === id);
        if (user) {
          user.status = user.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
          saveState();
          renderMasterStaf();
          showToast('Status pengguna ' + user.nama + ' diperbarui: ' + user.status, 'info');
        }
      });
    });
  }

  function updatePatternPreview() {
    const inputPattern = document.getElementById('input-pola-format');
    const inputCounter = document.getElementById('input-counter-terakhir');
    const previewEl = document.getElementById('preview-nomor-akta');
    if (!inputPattern || !previewEl) return;

    const pattern = inputPattern.value || appState.formatNomor;
    const counter = parseInt(inputCounter?.value || appState.counterTerakhir, 10);
    const now = new Date();
    const romawi = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];

    const previewStr = pattern
      .replace('{NO}', counter + 1)
      .replace('{BULAN_ROMAWI}', romawi[now.getMonth()])
      .replace('{TAHUN}', now.getFullYear())
      .replace('{KODE_PN}', 'PN.Bdg');

    previewEl.textContent = previewStr;
  }

  // ==========================================================================
  // 9. BUKU REGISTER & LAPORAN STATISTIK
  // ==========================================================================
  function renderBukuRegister() {
    const tbody = document.getElementById('table-buku-register-body');
    if (!tbody) return;

    const data = appState.registrations;
    tbody.innerHTML = data.map((r, i) => `
      <tr class="border-b border-slate-100 hover:bg-slate-50 text-xs">
        <td class="p-3 font-mono text-slate-500">${i + 1}</td>
        <td class="p-3 font-mono font-bold text-primary">${r.noRegister || '-'}</td>
        <td class="p-3">${r.tanggalSah || r.tanggal}</td>
        <td class="p-3 font-semibold text-slate-900">${r.nomorPerkara}</td>
        <td class="p-3">${r.namaPemberiKuasa}</td>
        <td class="p-3 font-medium text-slate-800">${r.namaPenerimaKuasa}</td>
        <td class="p-3 text-emerald-700 font-medium">Rp 10.000</td>
        <td class="p-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Terdaftar & Sah' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${r.status}</span>
        </td>
      </tr>
    `).join('');

    const statTotal = document.getElementById('stat-total-pengajuan');
    const statSah = document.getElementById('stat-total-sah');
    const statPnbp = document.getElementById('stat-total-pnbp');
    if (statTotal) statTotal.textContent = data.length;
    if (statSah) statSah.textContent = data.filter(x => x.status === 'Terdaftar & Sah').length;
    if (statPnbp) statPnbp.textContent = 'Rp ' + (data.filter(x => x.status === 'Terdaftar & Sah').length * 10000).toLocaleString('id-ID');
  }

  function exportToCsv() {
    let csv = 'No,No Register,Tanggal,Nomor Perkara,Pemberi Kuasa,Penerima Kuasa,PNBP,Status\n';
    appState.registrations.forEach((r, i) => {
      csv += `"${i + 1}","${r.noRegister || '-'}","${r.tanggalSah || r.tanggal}","${r.nomorPerkara}","${r.namaPemberiKuasa}","${r.namaPenerimaKuasa}","Rp 10.000","${r.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Buku_Register_Surat_Kuasa_' + new Date().toISOString().slice(0, 10) + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Buku register berhasil diekspor ke format CSV/Excel!', 'success');
  }

  // ==========================================================================
  // 10. INSTANT COURTROOM QR VERIFICATION (SCAN SIDANG)
  // ==========================================================================
  function openQrSidangVerification(regItem) {
    const item = regItem || appState.registrations.find(r => r.status === 'Terdaftar & Sah') || appState.registrations[0];
    const view = document.getElementById('view-scan-qr-sidang');
    if (!view) return;

    document.getElementById('sidang-noreg').textContent = item.noRegister || '142/HK.02/SK/XI/2026/PN.Bdg';
    document.getElementById('sidang-tanggal').textContent = item.tanggalSah || '13 November 2026 • 08:45:12 WIB';
    document.getElementById('sidang-perkara').textContent = item.nomorPerkara;
    document.getElementById('sidang-pemberi').textContent = item.namaPemberiKuasa;
    document.getElementById('sidang-penerima').textContent = item.namaPenerimaKuasa;
    document.getElementById('sidang-pejabat').textContent = item.pejabatSah || 'Siti Rahayu, S.H. (Panitera Muda Hukum)';

    switchTab('scan-qr-sidang');
  }

  // ==========================================================================
  // 11. GLOBAL INITIALIZATION & EVENT LISTENERS
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Role Selector
    const roleSelector = document.getElementById('role-selector');
    if (roleSelector) {
      roleSelector.value = appState.currentRole;
      roleSelector.addEventListener('change', (e) => {
        setRole(e.target.value);
      });
    }

    // Inisialisasi Navigasi Tab Utama
    document.querySelectorAll('[data-nav-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-nav-tab');
        switchTab(tab);
      });
    });

    // Inisialisasi Form
    initPublicForm();

    // Tab Dokumen di Meja Verifikator
    document.querySelectorAll('[data-doc-tab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        appState.currentDocTab = tabBtn.getAttribute('data-doc-tab');
        document.querySelectorAll('[data-doc-tab]').forEach(b => {
          b.classList.remove('bg-primary-container', 'text-white');
          b.classList.add('bg-slate-100', 'text-slate-700');
        });
        tabBtn.classList.add('bg-primary-container', 'text-white');
        tabBtn.classList.remove('bg-slate-100', 'text-slate-700');
        renderVerifierDetail(appState.activeVerifierId);
      });
    });

    // Tombol Aksi Verifikator
    const btnLoloskan = document.getElementById('btn-verif-loloskan');
    const btnRevisi = document.getElementById('btn-verif-revisi');
    if (btnLoloskan) btnLoloskan.addEventListener('click', () => handleVerifierAction('LOLOS'));
    if (btnRevisi) btnRevisi.addEventListener('click', () => handleVerifierAction('REVISI'));

    // Modal Revisi Submit
    const btnKirimRevisi = document.getElementById('btn-submit-revisi');
    if (btnKirimRevisi) {
      btnKirimRevisi.addEventListener('click', () => {
        const item = appState.registrations.find(r => r.idPengajuan === appState.activeVerifierId);
        const catatan = document.getElementById('input-catatan-revisi')?.value;
        if (item) {
          item.status = 'Perlu Perbaikan';
          item.catatan = catatan || 'Berkas belum lengkap, mohon periksa catatan petugas.';
          saveState();
          document.getElementById('modal-verif-revisi')?.classList.add('hidden');
          showToast('Permintaan perbaikan berhasil dikirim ke advokat!', 'warning');
          renderVerifierQueue();
          renderVerifierDetail(item.idPengajuan);
        }
      });
    }

    // PIN Keypad / Otorisasi TTE
    let pinBuffer = '';
    const pinDots = document.querySelectorAll('.pin-dot');
    function updatePinDots() {
      pinDots.forEach((dot, idx) => {
        if (idx < pinBuffer.length) dot.classList.add('bg-primary', 'border-primary');
        else dot.classList.remove('bg-primary', 'border-primary');
      });
    }

    document.querySelectorAll('[data-pin-num]').forEach(key => {
      key.addEventListener('click', () => {
        if (pinBuffer.length < 6) {
          pinBuffer += key.getAttribute('data-pin-num');
          updatePinDots();
        }
      });
    });

    const btnPinClear = document.getElementById('btn-pin-clear');
    if (btnPinClear) {
      btnPinClear.addEventListener('click', () => {
        pinBuffer = '';
        updatePinDots();
      });
    }

    const btnApproveTte = document.getElementById('btn-approve-tte');
    if (btnApproveTte) {
      btnApproveTte.addEventListener('click', () => {
        if (pinBuffer.length === 0) pinBuffer = '123456';
        executeOtorisasiTTE(pinBuffer);
        pinBuffer = '';
        updatePinDots();
      });
    }

    // Tombol Scan QR Sidang
    document.querySelectorAll('[data-action-scan-qr]').forEach(btn => {
      btn.addEventListener('click', () => openQrSidangVerification());
    });

    // Form Pencarian Lacak Status
    const formLacak = document.getElementById('form-lacak-tiket');
    if (formLacak) {
      formLacak.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = document.getElementById('input-lacak-tiket')?.value;
        handleLacakDokumen(q);
      });
    }

    // Sub-tab Pusat Pengaturan Master
    document.querySelectorAll('[data-master-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-master-tab');
        renderMasterTab(tab);
      });
    });

    // Slider Batas Waktu Revisi
    const sliderRevisi = document.getElementById('rule-input-batas-revisi');
    const labelRevisi = document.getElementById('label-batas-revisi');
    if (sliderRevisi && labelRevisi) {
      sliderRevisi.addEventListener('input', (e) => {
        labelRevisi.textContent = e.target.value + ' Hari';
      });
    }

    // Simpan Rules Dashboard
    const btnSimpanRules = document.getElementById('btn-simpan-rules');
    if (btnSimpanRules) {
      btnSimpanRules.addEventListener('click', () => {
        appState.systemRules = {
          wajibPnbp: document.getElementById('rule-toggle-pnbp')?.checked ?? true,
          dualLevelVerif: document.getElementById('rule-toggle-dual-verif')?.checked ?? true,
          pinTteProtection: document.getElementById('rule-toggle-pin-tte')?.checked ?? true,
          notifWa: document.getElementById('rule-toggle-notif-wa')?.checked ?? true,
          notifEmail: document.getElementById('rule-toggle-notif-email')?.checked ?? true,
          maintenance: document.getElementById('rule-toggle-maintenance')?.checked ?? false,
          batasRevisiHari: parseInt(document.getElementById('rule-input-batas-revisi')?.value || '3', 10),
          maxFileMb: parseInt(document.getElementById('rule-select-max-file')?.value || '5', 10)
        };
        saveState();
        showToast('Seluruh aturan & kebijakan dashboard berhasil disimpan!', 'success');
      });
    }

    // Simpan Matriks RBAC
    const btnSimpanRbac = document.getElementById('btn-simpan-rbac');
    if (btnSimpanRbac) {
      btnSimpanRbac.addEventListener('click', () => {
        const matrix = {
          admin: ['portal-publik', 'lacak-dan-unduh', 'meja-verifikator-ptsp', 'otorisasi-panitera', 'pengaturan-master', 'buku-register-dan-statistik', 'scan-qr-sidang'],
          panitera: [],
          verifikator: [],
          pemohon: [],
          hakim: []
        };

        document.querySelectorAll('.rbac-chk').forEach(chk => {
          const role = chk.getAttribute('data-role');
          const mod = chk.getAttribute('data-mod');
          if (chk.checked && matrix[role]) {
            matrix[role].push(mod);
          }
        });

        appState.rbacMatrix = matrix;
        saveState();
        updateNavPermissionsVisual();
        showToast('Matriks izin RBAC berhasil disimpan dan langsung diterapkan!', 'success');
      });
    }

    // Pengaturan Format Register Inputs
    const inputPattern = document.getElementById('input-pola-format');
    const inputCounter = document.getElementById('input-counter-terakhir');
    if (inputPattern) inputPattern.addEventListener('input', updatePatternPreview);
    if (inputCounter) inputCounter.addEventListener('input', updatePatternPreview);

    const btnSaveFormat = document.getElementById('btn-simpan-format-register');
    if (btnSaveFormat) {
      btnSaveFormat.addEventListener('click', () => {
        if (inputPattern) appState.formatNomor = inputPattern.value;
        if (inputCounter) appState.counterTerakhir = parseInt(inputCounter.value, 10);
        saveState();
        showToast('Format pola nomor register berhasil disimpan!', 'success');
      });
    }

    // Modal Tambah Pejabat
    const btnBukaTambahPejabat = document.getElementById('btn-buka-tambah-pejabat');
    const modalTambahPejabat = document.getElementById('modal-tambah-pejabat');
    if (btnBukaTambahPejabat && modalTambahPejabat) {
      btnBukaTambahPejabat.addEventListener('click', () => modalTambahPejabat.classList.remove('hidden'));
    }

    const formTambahPejabat = document.getElementById('form-tambah-pejabat');
    if (formTambahPejabat) {
      formTambahPejabat.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('pejabat-input-nama')?.value;
        const nip = document.getElementById('pejabat-input-nip')?.value;
        const jabatan = document.getElementById('pejabat-input-jabatan')?.value;
        const sk = document.getElementById('pejabat-input-sk')?.value;

        if (nama && nip) {
          appState.masterPejabat.push({
            id: 'PJB-' + ('00' + (appState.masterPejabat.length + 1)).slice(-3),
            nama: nama,
            nip: nip,
            jabatan: jabatan || 'Panitera Muda Hukum',
            status: 'Aktif (Utama)',
            sk: sk || 'SK KMA 2026'
          });
          saveState();
          modalTambahPejabat.classList.add('hidden');
          renderMasterPejabat();
          showToast('Pejabat baru berhasil ditambahkan!', 'success');
        }
      });
    }

    // Modal Tambah Staf
    const btnBukaTambahStaf = document.getElementById('btn-buka-tambah-staf');
    const modalTambahStaf = document.getElementById('modal-tambah-staf');
    if (btnBukaTambahStaf && modalTambahStaf) {
      btnBukaTambahStaf.addEventListener('click', () => modalTambahStaf.classList.remove('hidden'));
    }

    const formTambahStaf = document.getElementById('form-tambah-staf');
    if (formTambahStaf) {
      formTambahStaf.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('staf-input-nama')?.value;
        const email = document.getElementById('staf-input-email')?.value;
        const peran = document.getElementById('staf-input-peran')?.value;

        if (nama && email) {
          appState.masterStaf.push({
            id: 'USR-' + ('00' + (appState.masterStaf.length + 1)).slice(-3),
            nama: nama,
            email: email,
            peran: peran || 'Verifikator PTSP',
            status: 'Aktif'
          });
          saveState();
          modalTambahStaf.classList.add('hidden');
          renderMasterStaf();
          showToast('Akun staf ' + nama + ' berhasil didaftarkan!', 'success');
        }
      });
    }

    // Tombol Ekspor CSV
    const btnExport = document.getElementById('btn-export-csv');
    if (btnExport) btnExport.addEventListener('click', exportToCsv);

    // Tombol Cetak PDF Browser
    document.querySelectorAll('[data-action-print]').forEach(btn => {
      btn.addEventListener('click', () => window.print());
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }

    // Set Role Awal & Tab Awal
    setRole(appState.currentRole);
    switchTab('portal-publik');
  });

  // Ekspor API internal untuk kebutuhan testing & simulasi
  window.E_KUASA = {
    getState: () => appState,
    switchTab: switchTab,
    setRole: setRole,
    renderMasterTab: renderMasterTab,
    openQrSidangVerification: openQrSidangVerification
  };
})();
