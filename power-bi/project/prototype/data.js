// Extended dataset for SK Melikai full prototype (all 8 pages + drill-through).
// Numbers are illustrative but consistent across pages.

window.SKM = {
  meta: {
    school: 'SK Melikai',
    location: 'Menumbok, Sabah',
    code: 'XBA3030',
    session: '2025',
    asOf: '15 Mei 2025',
    headmaster: 'En. Ahmad Razali bin Hashim',
  },

  // ── KPIs ────────────────────────────────────────────────────────
  kpis: {
    students: 287, studentsDelta: +6,
    teachers: 18, teachersDelta: +1,
    attendance: 94.2, attendanceDelta: +1.8,
    passRate: 82.4, passRateDelta: +3.1,
    literacy: 96, numeracy: 91,
    b40Pct: 68, okuCount: 7,
    budget: 142500, budgetUsed: 89200,   // RM
  },

  // ── Enrolment / classes ────────────────────────────────────────
  enrolByYear: [
    { year: 'Tahun 1', boys: 24, girls: 22 },
    { year: 'Tahun 2', boys: 26, girls: 21 },
    { year: 'Tahun 3', boys: 23, girls: 25 },
    { year: 'Tahun 4', boys: 28, girls: 26 },
    { year: 'Tahun 5', boys: 21, girls: 24 },
    { year: 'Tahun 6', boys: 24, girls: 23 },
  ],
  classes: [
    { id: '1C', cls: '1 Cemerlang', year: 1, n: 23, attn: 95.2, avg: 76.4, teacher: 'Cikgu Nurul Aisyah' },
    { id: '1G', cls: '1 Gemilang',  year: 1, n: 23, attn: 93.1, avg: 72.1, teacher: 'Cikgu Siti Rahmah' },
    { id: '2C', cls: '2 Cemerlang', year: 2, n: 24, attn: 94.8, avg: 75.8, teacher: 'Cikgu Lim Mei Ling' },
    { id: '2G', cls: '2 Gemilang',  year: 2, n: 23, attn: 92.6, avg: 71.3, teacher: 'Cikgu Faridah' },
    { id: '3C', cls: '3 Cemerlang', year: 3, n: 24, attn: 94.3, avg: 77.1, teacher: 'Cikgu Hafiz' },
    { id: '3G', cls: '3 Gemilang',  year: 3, n: 24, attn: 91.4, avg: 70.2, teacher: 'Cikgu Jasmine' },
    { id: '4C', cls: '4 Cemerlang', year: 4, n: 27, attn: 95.1, avg: 80.9, teacher: 'Cikgu Marziah' },
    { id: '4G', cls: '4 Gemilang',  year: 4, n: 27, attn: 91.2, avg: 73.6, teacher: 'Cikgu Rosli' },
    { id: '5C', cls: '5 Cemerlang', year: 5, n: 23, attn: 95.8, avg: 81.7, teacher: 'Cikgu Sarimah' },
    { id: '5G', cls: '5 Gemilang',  year: 5, n: 22, attn: 92.4, avg: 74.5, teacher: 'Cikgu Devi' },
    { id: '6C', cls: '6 Cemerlang', year: 6, n: 24, attn: 96.4, avg: 84.2, teacher: 'Cikgu Mariam' },
    { id: '6G', cls: '6 Gemilang',  year: 6, n: 23, attn: 94.7, avg: 78.4, teacher: 'Cikgu Yusof' },
  ],

  // ── Demographics ───────────────────────────────────────────────
  ethnic: [
    { group: 'Bumiputera Sabah', pct: 71, count: 204 },
    { group: 'Melayu',           pct: 18, count:  52 },
    { group: 'Cina',             pct:  7, count:  20 },
    { group: 'Lain-lain',        pct:  4, count:  11 },
  ],
  socioeconomic: [
    { band: 'B40', pct: 68, count: 195 },
    { band: 'M40', pct: 27, count:  78 },
    { band: 'T20', pct:  5, count:  14 },
  ],
  oku: [
    { kind: 'Pembelajaran',  count: 4 },
    { kind: 'Pendengaran',   count: 2 },
    { kind: 'Penglihatan',   count: 1 },
  ],
  linus: [
    { year: 'T1', lit: 91, num: 84 },
    { year: 'T2', lit: 94, num: 89 },
    { year: 'T3', lit: 97, num: 93 },
  ],

  // ── Attendance ─────────────────────────────────────────────────
  attendanceTrend: [
    { m: 'Jan', pct: 92.1 },
    { m: 'Feb', pct: 93.4 },
    { m: 'Mac', pct: 94.0 },
    { m: 'Apr', pct: 95.1 },
    { m: 'Mei', pct: 94.2 },
  ],
  // 5 weeks × 5 days (Isnin–Jumaat) heatmap, May 2025
  attendanceDaily: [
    [94.8, 95.1, 94.2, 93.8, 92.4],
    [95.6, 95.9, 95.0, 94.6, 93.1],
    [94.1, 94.5, 93.9, 92.7, 91.8],
    [95.2, 94.8, 94.4, 93.9, 92.6],
    [93.7, 94.0, 93.2, 92.5, 90.9],
  ],
  attendanceReasons: [
    { reason: 'Sakit',          pct: 52 },
    { reason: 'Urusan Keluarga', pct: 21 },
    { reason: 'Cuti Sah',       pct: 14 },
    { reason: 'Tanpa Sebab',    pct:  9 },
    { reason: 'Pengangkutan',   pct:  4 },
  ],

  // ── PBD by subject ─────────────────────────────────────────────
  pbd: [
    { subj: 'Bahasa Melayu',    t1: 2, t2: 6,  t3: 22, t4: 38, t5: 24, t6: 8 },
    { subj: 'Bahasa Inggeris',  t1: 4, t2: 11, t3: 28, t4: 34, t5: 17, t6: 6 },
    { subj: 'Matematik',        t1: 3, t2: 8,  t3: 24, t4: 36, t5: 21, t6: 8 },
    { subj: 'Sains',            t1: 2, t2: 7,  t3: 26, t4: 38, t5: 20, t6: 7 },
    { subj: 'Pendidikan Islam', t1: 1, t2: 4,  t3: 19, t4: 41, t5: 26, t6: 9 },
    { subj: 'Sejarah',          t1: 3, t2: 9,  t3: 27, t4: 35, t5: 19, t6: 7 },
  ],
  pbdTrend: [
    { sesi: '2022', pct: 71.2 },
    { sesi: '2023', pct: 75.6 },
    { sesi: '2024', pct: 79.3 },
    { sesi: '2025', pct: 82.4 },
  ],

  // ── Teachers ───────────────────────────────────────────────────
  teachers: [
    { name: 'En. Ahmad Razali',  role: 'Guru Besar',        subj: 'Pendidikan Islam', exp: 22, cpd: 28, load: 12 },
    { name: 'Pn. Mariam Saleh',  role: 'PK Pentadbiran',    subj: 'Bahasa Melayu',    exp: 18, cpd: 32, load: 18 },
    { name: 'En. Rosli Ibrahim', role: 'PK HEM',            subj: 'Sains',            exp: 16, cpd: 24, load: 20 },
    { name: 'Pn. Sarimah Daud',  role: 'PK Kokurikulum',    subj: 'Pendidikan Jasmani', exp: 14, cpd: 30, load: 22 },
    { name: 'Cikgu Nurul Aisyah', role: 'Guru',             subj: 'Bahasa Melayu',    exp: 9,  cpd: 26, load: 26 },
    { name: 'Cikgu Lim Mei Ling', role: 'Guru',             subj: 'Matematik',        exp: 12, cpd: 22, load: 28 },
    { name: 'Cikgu Hafiz Ramli', role: 'Guru',             subj: 'Sains',            exp: 7,  cpd: 18, load: 27 },
    { name: 'Cikgu Faridah Ali', role: 'Guru',             subj: 'Bahasa Inggeris',  exp: 11, cpd: 20, load: 25 },
    { name: 'Cikgu Jasmine Tan', role: 'Guru',             subj: 'Bahasa Inggeris',  exp: 5,  cpd: 16, load: 26 },
    { name: 'Cikgu Yusof Hamzah', role: 'Guru',             subj: 'Sejarah',          exp: 15, cpd: 24, load: 24 },
    { name: 'Cikgu Devi Subra',  role: 'Guru',             subj: 'Matematik',        exp: 6,  cpd: 14, load: 27 },
    { name: 'Cikgu Siti Rahmah', role: 'Guru',             subj: 'Pendidikan Islam', exp: 8,  cpd: 22, load: 24 },
    { name: 'Cikgu Marziah',     role: 'Guru',             subj: 'Sains',            exp: 13, cpd: 26, load: 26 },
    { name: 'Cikgu Norazlin',    role: 'Guru',             subj: 'Pendidikan Moral', exp: 10, cpd: 18, load: 22 },
    { name: 'Cikgu Hanafi',      role: 'Guru',             subj: 'Pendidikan Jasmani', exp: 4,  cpd: 12, load: 23 },
    { name: 'Cikgu Liza Wong',   role: 'Guru',             subj: 'Pend. Seni Visual', exp: 6,  cpd: 14, load: 21 },
    { name: 'Cikgu Maslina',     role: 'Guru',             subj: 'Bahasa Melayu',    exp: 17, cpd: 28, load: 25 },
    { name: 'Cikgu Azman',       role: 'Guru Sandaran',    subj: 'Matematik',        exp: 2,  cpd:  8, load: 22 },
  ],
  cpd: [
    { month: 'Jan', hours: 38 },
    { month: 'Feb', hours: 42 },
    { month: 'Mac', hours: 51 },
    { month: 'Apr', hours: 47 },
    { month: 'Mei', hours: 24 },
  ],

  // ── Finance (PCG = Pemberian Per Kapita) ───────────────────────
  budgetCategories: [
    { name: 'Mata Pelajaran',   allocated: 54000, spent: 34800 },
    { name: 'Pusat Sumber',     allocated: 16500, spent: 11200 },
    { name: 'Kokurikulum',      allocated: 22000, spent: 14600 },
    { name: 'Sukan',            allocated: 18000, spent: 12400 },
    { name: 'Bimbingan',        allocated:  8500, spent:  4100 },
    { name: 'Penyelenggaraan',  allocated: 23500, spent: 12100 },
  ],
  budgetTrend: [
    { m: 'Jan', spend:  9200, target: 11875 },
    { m: 'Feb', spend: 14600, target: 11875 },
    { m: 'Mac', spend: 22800, target: 11875 },
    { m: 'Apr', spend: 19400, target: 11875 },
    { m: 'Mei', spend: 23200, target: 11875 },
  ],

  // ── Cocurricular ───────────────────────────────────────────────
  cocurricular: [
    { name: 'Pengakap',          members: 64, color: '#2F6F4E' },
    { name: 'Bulan Sabit Merah', members: 48, color: '#C0392B' },
    { name: 'Kadet Polis',       members: 32, color: '#1F4E8C' },
    { name: 'Sukan & Olahraga',  members: 71, color: '#D97706' },
    { name: 'Kelab Sains',       members: 38, color: '#7C3AED' },
    { name: 'Kelab Bahasa',      members: 34, color: '#0E7490' },
  ],
  achievements: [
    { event: 'Olahraga MSSD Kuala Penyu', year: 2025, level: 'Daerah', placing: 'Naib Johan', cat: 'Sukan' },
    { event: 'Pertandingan Bercerita BM', year: 2025, level: 'Daerah', placing: 'Johan',       cat: 'Akademik' },
    { event: 'Kuiz Sains',                year: 2025, level: 'Zon',    placing: 'Tempat ke-3', cat: 'Akademik' },
    { event: 'Pengakap Cemerlang',        year: 2024, level: 'Negeri', placing: 'Anugerah',    cat: 'Unit Beruniform' },
    { event: 'Reka Cipta',                year: 2024, level: 'Daerah', placing: 'Johan',       cat: 'Akademik' },
  ],

  // ── Discipline & Health ────────────────────────────────────────
  disciplineByMonth: [
    { m: 'Jan', cases: 3, severity: 'minor' },
    { m: 'Feb', cases: 5, severity: 'minor' },
    { m: 'Mac', cases: 2, severity: 'minor' },
    { m: 'Apr', cases: 7, severity: 'minor' },
    { m: 'Mei', cases: 4, severity: 'minor' },
  ],
  disciplineCategories: [
    { kind: 'Ponteng',          n: 8 },
    { kind: 'Lewat',            n: 6 },
    { kind: 'Pakaian',          n: 4 },
    { kind: 'Bergaduh',         n: 2 },
    { kind: 'Lain-lain',        n: 1 },
  ],
  bmi: [
    { band: 'Kurang berat',  pct: 14 },
    { band: 'Normal',        pct: 71 },
    { band: 'Berlebihan',    pct: 11 },
    { band: 'Obes',          pct:  4 },
  ],
  vaccinations: [
    { name: 'BCG',     coverage: 100 },
    { name: 'DPT',     coverage: 98 },
    { name: 'MMR',     coverage: 96 },
    { name: 'HPV (P)', coverage: 92 },
    { name: 'JE',      coverage: 89 },
  ],

  // ── Alerts ─────────────────────────────────────────────────────
  alerts: [
    { kind: 'attendance', who: '4 Gemilang',     detail: 'Kehadiran turun 4.2% minggu lalu', sev: 'warn' },
    { kind: 'pbd',        who: 'B. Inggeris T3', detail: '15% murid pada Tahap 1–2',         sev: 'warn' },
    { kind: 'staff',      who: 'Cikgu Lim',      detail: 'Cuti bersalin bermula 1 Jun',      sev: 'info' },
    { kind: 'finance',    who: 'Penyelenggaraan', detail: 'Belanja melebihi sasaran bulanan', sev: 'warn' },
  ],
};

// Backwards-compat alias for V1 file
window.SKM_DATA = window.SKM;
