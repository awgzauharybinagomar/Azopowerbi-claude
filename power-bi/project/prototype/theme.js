// Theme + i18n + global state hooks for the SK Melikai prototype.
// Mode (light/dark) and accent are driven by Tweaks. Density adjusts spacing/font scale.

window.SKM_TOKENS = {
  light: {
    bg:        '#F3F2F1',
    bgAlt:     '#FAFAF9',
    card:      '#FFFFFF',
    cardHover: '#FAF9F8',
    border:    '#E1DFDD',
    borderL:   '#EDEBE9',
    text:      '#201F1E',
    textSec:   '#3B3A39',
    muted:     '#605E5C',
    faint:     '#8A8886',
    ghost:     '#C8C6C4',
    headerBg:  '#FFFFFF',
    chipBg:    '#FFFFFF',
    chipActiveBg: '#EFF6FC',
    chipActiveBorder: 'var(--accent)',
    tooltipBg: '#FFFFFF',
    tooltipText: '#201F1E',
    overlay:   'rgba(0,0,0,0.32)',
    ok:        '#107C10',
    warn:      '#D83B01',
    bad:       '#A4262C',
    girl:      '#C239B3',
    boy:       '#117ACA',
  },
  dark: {
    bg:        '#0F1115',
    bgAlt:     '#13161C',
    card:      '#1A1D24',
    cardHover: '#22262E',
    border:    '#262B35',
    borderL:   '#1F232C',
    text:      '#ECECEC',
    textSec:   '#C8CBD2',
    muted:     '#8A93A6',
    faint:     '#5C6478',
    ghost:     '#3A4050',
    headerBg:  '#13161C',
    chipBg:    '#1A1D24',
    chipActiveBg: 'rgba(80,162,255,0.18)',
    chipActiveBorder: 'var(--accent)',
    tooltipBg: '#22262E',
    tooltipText: '#ECECEC',
    overlay:   'rgba(0,0,0,0.6)',
    ok:        '#4ADE80',
    warn:      '#FBBF24',
    bad:       '#F87171',
    girl:      '#F472B6',
    boy:       '#60A5FA',
  },
};

// Indexed by base hex (matches Tweaks palette swatches).
window.SKM_ACCENTS = {
  '#117ACA': { base: '#117ACA', soft: '#DEECF9', deep: '#0B5A9C', dark: '#50A2FF' },
  '#107C10': { base: '#107C10', soft: '#DFF6DD', deep: '#0B5C0B', dark: '#4ADE80' },
  '#5C2E91': { base: '#5C2E91', soft: '#E9DCFD', deep: '#41216B', dark: '#A78BFA' },
  '#A4262C': { base: '#A4262C', soft: '#FDE7E9', deep: '#7A1B1F', dark: '#F87171' },
};

window.SKM_DENSITY = {
  compact:     { pad: 10, gap:  8, font: 12, kpiFont: 26, cardTitleFont: 12 },
  comfortable: { pad: 14, gap: 12, font: 13, kpiFont: 32, cardTitleFont: 13 },
};

window.SKM_I18N = {
  bm: {
    students: 'Murid', teachers: 'Guru', attendance: 'Kehadiran',
    passRate: 'Lulus PBD', literacy: 'Literasi', numeracy: 'Numerasi',
    overview: 'Ringkasan', academic: 'Akademik', attendanceTab: 'Kehadiran',
    teachersTab: 'Guru', studentsTab: 'Murid', finance: 'Kewangan',
    cocurricular: 'Kokurikulum', discipline: 'Disiplin',
    session: 'Sesi', allYears: 'Semua Tahun', allClasses: 'Semua Kelas', allGender: 'Lelaki & Perempuan',
    updated: 'Dikemaskini', export: 'Eksport', filter: 'Tapis', clear: 'Padam',
    boys: 'Lelaki', girls: 'Perempuan',
    vs: 'vs sesi lalu',
    alerts: 'Amaran & Tindakan',
    enrolByYear: 'Enrolmen mengikut Tahun',
    ethnicMix: 'Komposisi Etnik',
    monthlyAttendance: 'Kehadiran Bulanan',
    pbdBySubject: 'PBD · Taburan Tahap mengikut Mata Pelajaran',
    topClasses: 'Kelas Berprestasi Tinggi',
    classDetail: 'Butiran Kelas',
    backToOverview: 'Kembali',
    page: { overview: 'Ringkasan', academic: 'Akademik', attendance: 'Kehadiran',
      teachers: 'Guru', students: 'Hal Ehwal Murid', finance: 'Kewangan',
      cocurricular: 'Kokurikulum', discipline: 'Disiplin & Kesihatan' },
  },
  en: {
    students: 'Students', teachers: 'Teachers', attendance: 'Attendance',
    passRate: 'PBD Pass Rate', literacy: 'Literacy', numeracy: 'Numeracy',
    overview: 'Overview', academic: 'Academic', attendanceTab: 'Attendance',
    teachersTab: 'Teachers', studentsTab: 'Students', finance: 'Finance',
    cocurricular: 'Co-curricular', discipline: 'Discipline',
    session: 'Session', allYears: 'All Years', allClasses: 'All Classes', allGender: 'Boys & Girls',
    updated: 'Updated', export: 'Export', filter: 'Filter', clear: 'Clear',
    boys: 'Boys', girls: 'Girls',
    vs: 'vs last session',
    alerts: 'Alerts & Actions',
    enrolByYear: 'Enrolment by Year',
    ethnicMix: 'Ethnic Composition',
    monthlyAttendance: 'Monthly Attendance',
    pbdBySubject: 'PBD · Level Distribution by Subject',
    topClasses: 'Top Performing Classes',
    classDetail: 'Class Detail',
    backToOverview: 'Back',
    page: { overview: 'Overview', academic: 'Academic', attendance: 'Attendance',
      teachers: 'Teachers', students: 'Student Affairs', finance: 'Finance',
      cocurricular: 'Co-curricular', discipline: 'Discipline & Health' },
  },
};

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// React context for shell-wide state (tweaks, filters, page, drill target).
window.SKMContext = React.createContext(null);

window.useSKM = function() {
  const ctx = React.useContext(window.SKMContext);
  if (!ctx) throw new Error('useSKM outside provider');
  return ctx;
};

// Resolve tokens for the current mode + accent + density into CSS variables
// applied to the root .skm-app container.
window.skmCssVars = function(tweaks) {
  const t = SKM_TOKENS[tweaks.dark ? 'dark' : 'light'];
  const a = SKM_ACCENTS[tweaks.accent] || SKM_ACCENTS['#117ACA'];
  const d = SKM_DENSITY[tweaks.density] || SKM_DENSITY.comfortable;
  return {
    '--bg': t.bg, '--bg-alt': t.bgAlt, '--card': t.card, '--card-hover': t.cardHover,
    '--border': t.border, '--border-l': t.borderL,
    '--text': t.text, '--text-sec': t.textSec, '--muted': t.muted, '--faint': t.faint, '--ghost': t.ghost,
    '--header-bg': t.headerBg, '--chip-bg': t.chipBg,
    '--chip-active-bg': t.chipActiveBg, '--chip-active-border': a.base,
    '--tooltip-bg': t.tooltipBg, '--tooltip-text': t.tooltipText, '--overlay': t.overlay,
    '--ok': t.ok, '--warn': t.warn, '--bad': t.bad, '--boy': t.boy, '--girl': t.girl,
    '--accent':      tweaks.dark ? a.dark : a.base,
    '--accent-soft': tweaks.dark ? hexToRgba(a.base, 0.18) : a.soft,
    '--accent-deep': a.deep,
    '--pad': d.pad + 'px', '--gap': d.gap + 'px',
    '--font': d.font + 'px',
    '--kpi-font': d.kpiFont + 'px',
    '--card-title-font': d.cardTitleFont + 'px',
  };
};
