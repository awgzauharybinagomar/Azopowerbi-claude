// Shared data for SK Melikai Menumbok dashboards.
// SK = Sekolah Kebangsaan (national primary school), Menumbok is in Sabah, Malaysia.
// Numbers are illustrative but realistic for a rural ~300-student primary school.

window.SKM_DATA = {
  meta: {
    school: 'SK Melikai',
    location: 'Menumbok, Sabah',
    code: 'XBA3030',
    session: '2025',
    asOf: '15 Mei 2025',
    headmaster: 'En. Ahmad Razali bin Hashim',
  },
  kpis: {
    students: 287,
    studentsDelta: +6,        // vs last year
    teachers: 18,
    attendance: 94.2,         // % YTD
    attendanceDelta: +1.8,
    passRate: 82.4,           // % PBD Tahap Cemerlang+Baik+Sederhana
    passRateDelta: +3.1,
    literacy: 96,             // LINUS Literasi %
    numeracy: 91,             // LINUS Numerasi %
  },
  // Tahun 1–6 enrollment
  enrolByYear: [
    { year: 'Tahun 1', boys: 24, girls: 22 },
    { year: 'Tahun 2', boys: 26, girls: 21 },
    { year: 'Tahun 3', boys: 23, girls: 25 },
    { year: 'Tahun 4', boys: 28, girls: 26 },
    { year: 'Tahun 5', boys: 21, girls: 24 },
    { year: 'Tahun 6', boys: 24, girls: 23 },
  ],
  // Ethnic composition (rural Sabah → strong Bumiputera Sabah representation)
  demographics: [
    { group: 'Bumiputera Sabah',   pct: 71, count: 204 },
    { group: 'Melayu',             pct: 18, count:  52 },
    { group: 'Cina',               pct:  7, count:  20 },
    { group: 'Lain-lain',          pct:  4, count:  11 },
  ],
  // Monthly attendance Jan–May 2025
  attendanceTrend: [
    { m: 'Jan', pct: 92.1 },
    { m: 'Feb', pct: 93.4 },
    { m: 'Mac', pct: 94.0 },
    { m: 'Apr', pct: 95.1 },
    { m: 'Mei', pct: 94.2 },
  ],
  // PBD (Pentaksiran Bilik Darjah) — Tahap 1–6 distribution per core subject
  // Tahap 1–2 = needs support, 3–4 = on track, 5–6 = excelling
  pbd: [
    { subj: 'Bahasa Melayu',     t1: 2,  t2: 6,  t3: 22, t4: 38, t5: 24, t6: 8 },
    { subj: 'Bahasa Inggeris',   t1: 4,  t2: 11, t3: 28, t4: 34, t5: 17, t6: 6 },
    { subj: 'Matematik',         t1: 3,  t2: 8,  t3: 24, t4: 36, t5: 21, t6: 8 },
    { subj: 'Sains',             t1: 2,  t2: 7,  t3: 26, t4: 38, t5: 20, t6: 7 },
    { subj: 'Pendidikan Islam',  t1: 1,  t2: 4,  t3: 19, t4: 41, t5: 26, t6: 9 },
    { subj: 'Sejarah',           t1: 3,  t2: 9,  t3: 27, t4: 35, t5: 19, t6: 7 },
  ],
  // Co-curricular participation by club
  cocurricular: [
    { name: 'Pengakap',       members: 64, color: '#2F6F4E' },
    { name: 'Bulan Sabit Merah', members: 48, color: '#C0392B' },
    { name: 'Kadet Polis',    members: 32, color: '#1F4E8C' },
    { name: 'Sukan & Olahraga', members: 71, color: '#D97706' },
    { name: 'Kelab Sains',    members: 38, color: '#7C3AED' },
    { name: 'Kelab Bahasa',   members: 34, color: '#0E7490' },
  ],
  // Top performing classes by composite score
  topClasses: [
    { cls: '6 Cemerlang', avg: 84.2, attn: 96.4, n: 24 },
    { cls: '5 Cemerlang', avg: 81.7, attn: 95.8, n: 23 },
    { cls: '4 Cemerlang', avg: 80.9, attn: 95.1, n: 27 },
    { cls: '6 Gemilang',  avg: 78.4, attn: 94.7, n: 23 },
    { cls: '3 Cemerlang', avg: 77.1, attn: 94.3, n: 24 },
  ],
  // Recent incidents / flags
  alerts: [
    { kind: 'attendance', who: '4 Gemilang', detail: 'Kehadiran turun 4.2% minggu lalu', sev: 'warn' },
    { kind: 'pbd',        who: 'B. Inggeris T3', detail: '15% murid pada Tahap 1–2', sev: 'warn' },
    { kind: 'staff',      who: 'Cikgu Lim',    detail: 'Cuti bersalin bermula 1 Jun',   sev: 'info' },
  ],
  // Facilities / inventory snapshot
  facilities: [
    { name: 'Bilik Darjah',   value: 14, cap: 16 },
    { name: 'Makmal Komputer', value:  1, cap:  1 },
    { name: 'Pusat Sumber',   value:  1, cap:  1 },
    { name: 'Padang',         value:  1, cap:  1 },
    { name: 'Kantin',         value:  1, cap:  1 },
  ],
};
