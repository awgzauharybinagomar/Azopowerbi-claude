// Shared data for SK Melikai Menumbok dashboards.
// SK = Sekolah Kebangsaan (national primary school), Menumbok is in Sabah, Malaysia.
//
// SUMBER: laporan Power BI sebenar sekolah (publish-to-web), diekstrak 12 Jun 2026.
// Data laporan = sesi 2023/2024, keputusan PBD Julai 2024.
// Medan bertanda [SEBENAR] datang terus dari laporan itu.
// Medan bertanda [ILUSTRASI] tiada dalam laporan sebenar dan kekal sebagai data rekaan
// untuk demo reka bentuk sahaja. JANGAN petik medan ILUSTRASI sebagai fakta sekolah.

window.SKM_DATA = {
  // [SEBENAR] Maklumat Asas Sekolah
  meta: {
    school: 'SK Melikai Menumbok',
    location: 'Menumbok, Sabah',          // alamat: SK. Melikai, Peti Surat 08, 89767 Menumbok, Sabah
    code: 'XBA6312',
    session: '2023/2024',
    asOf: 'Julai 2024',
    headmaster: 'En. Abdul Din bin Hajim',
  },
  kpis: {
    students: 125,            // [SEBENAR] Lelaki 67, Perempuan 58 (+19 murid prasekolah)
    studentsDelta: 0,         // tiada data perbandingan tahun lepas dalam laporan
    teachers: 16,             // [SEBENAR] guru; bukan guru 4
    attendance: 94.2,         // [ILUSTRASI] laporan sebenar tiada modul kehadiran
    attendanceDelta: +1.8,    // [ILUSTRASI]
    passRate: 73.0,           // [SEBENAR, anggaran] % murid TP3+ merentas 6 subjek teras (sampel Keputusan PBD Julai 2024)
    passRateDelta: 0,         // tiada data trend dalam laporan
    literacy: 96,             // [ILUSTRASI] laporan sebenar tiada data LINUS
    numeracy: 91,             // [ILUSTRASI]
  },
  // [SEBENAR] Enrolmen Tahun 1 hingga 6 (jumlah 125: L 67, P 58)
  enrolByYear: [
    { year: 'Tahun 1', boys:  8, girls: 11 },
    { year: 'Tahun 2', boys:  8, girls:  9 },
    { year: 'Tahun 3', boys: 17, girls:  9 },
    { year: 'Tahun 4', boys:  9, girls: 13 },
    { year: 'Tahun 5', boys: 10, girls:  9 },
    { year: 'Tahun 6', boys: 15, girls:  7 },
  ],
  // [SEBENAR] Bilangan murid mengikut kaum (5 teratas + lain-lain; 22 kaum kesemuanya).
  // Lain-lain: Kadazan 4, Suluk 4, Kedayan 3, Bugis 2, Iban 2, Jawa 2, Melanau 2,
  // Sino-Native 2, Banjar 1, Bumiputera Sarawak 1, Cina 1, Filipinos 1, Indonesia 1,
  // Melayu Sarawak 1, Murut 1, Sungai 1, Tidung 1.
  demographics: [
    { group: 'Bisaya',           pct: 32.8, count: 41 },
    { group: 'Brunei',           pct: 13.6, count: 17 },
    { group: 'Kedayan (Sabah)',  pct: 11.2, count: 14 },
    { group: 'Bajau',            pct:  9.6, count: 12 },
    { group: 'Melayu',           pct:  8.8, count: 11 },
    { group: 'Lain-lain',        pct: 24.0, count: 30 },
  ],
  // [ILUSTRASI] Laporan sebenar tiada modul kehadiran bulanan.
  attendanceTrend: [
    { m: 'Jan', pct: 92.1 },
    { m: 'Feb', pct: 93.4 },
    { m: 'Mac', pct: 94.0 },
    { m: 'Apr', pct: 95.1 },
    { m: 'Mei', pct: 94.2 },
  ],
  // [SEBENAR, anggaran] PBD (Pentaksiran Bilik Darjah), Keputusan Julai 2024.
  // % murid per Tahap Penguasaan, dikira daripada sampel 21 murid dalam jadual laporan.
  // Laporan hanya merekod TP1 hingga TP4 dalam sampel; t5/t6 = 0.
  // Subjek penuh laporan: BM BI MT SN PAI PSV PK PJ AR MZ RBT SEJ PM (13 subjek);
  // 6 subjek teras sahaja dipaparkan di sini.
  pbd: [
    { subj: 'Bahasa Melayu',     t1: 5,  t2: 24, t3: 38, t4: 33, t5: 0, t6: 0 },
    { subj: 'Bahasa Inggeris',   t1: 5,  t2: 29, t3: 38, t4: 28, t5: 0, t6: 0 },
    { subj: 'Matematik',         t1: 5,  t2: 38, t3: 47, t4: 10, t5: 0, t6: 0 },
    { subj: 'Sains',             t1: 5,  t2: 24, t3: 47, t4: 24, t5: 0, t6: 0 },
    { subj: 'Pendidikan Islam',  t1: 10, t2: 14, t3: 62, t4: 14, t5: 0, t6: 0 },
    { subj: 'Sejarah',           t1: 0,  t2: 5,  t3: 33, t4: 62, t5: 0, t6: 0 },
  ],
  // [ILUSTRASI] Laporan sebenar tiada modul kokurikulum.
  cocurricular: [
    { name: 'Pengakap',       members: 64, color: '#2F6F4E' },
    { name: 'Bulan Sabit Merah', members: 48, color: '#C0392B' },
    { name: 'Kadet Polis',    members: 32, color: '#1F4E8C' },
    { name: 'Sukan & Olahraga', members: 71, color: '#D97706' },
    { name: 'Kelab Sains',    members: 38, color: '#7C3AED' },
    { name: 'Kelab Bahasa',   members: 34, color: '#0E7490' },
  ],
  // [ILUSTRASI skor] Nama kelas SEBENAR (6 kelas nama planet:
  // Tahap Satu = Marikh, Utarid, Zuhrah; Tahap Dua = Musytari, Uranus, Zuhal),
  // tetapi laporan tidak mendedahkan skor purata / kehadiran per kelas.
  topClasses: [
    { cls: 'Zuhal',    avg: 84.2, attn: 96.4, n: 22 },
    { cls: 'Uranus',   avg: 81.7, attn: 95.8, n: 19 },
    { cls: 'Musytari', avg: 80.9, attn: 95.1, n: 22 },
    { cls: 'Zuhrah',   avg: 78.4, attn: 94.7, n: 26 },
    { cls: 'Utarid',   avg: 77.1, attn: 94.3, n: 17 },
  ],
  // [ILUSTRASI] Laporan sebenar tiada modul amaran.
  alerts: [
    { kind: 'pbd',   who: 'Matematik',  detail: '43% murid pada Tahap 1 hingga 2 (sampel Julai 2024)', sev: 'warn' },
    { kind: 'pbd',   who: 'B. Inggeris', detail: '34% murid pada Tahap 1 hingga 2 (sampel Julai 2024)', sev: 'warn' },
    { kind: 'staff', who: 'Prasekolah',  detail: '19 murid prasekolah berdaftar', sev: 'info' },
  ],
  // [ILUSTRASI] Laporan sebenar tiada modul fasiliti.
  facilities: [
    { name: 'Bilik Darjah',   value:  6, cap:  8 },
    { name: 'Makmal Komputer', value:  1, cap:  1 },
    { name: 'Pusat Sumber',   value:  1, cap:  1 },
    { name: 'Padang',         value:  1, cap:  1 },
    { name: 'Kantin',         value:  1, cap:  1 },
  ],
};
