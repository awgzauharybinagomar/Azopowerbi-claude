// Main app — context, tweaks integration, page router

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": "#117ACA",
  "density": "comfortable",
  "lang": "bm",
  "showAlerts": true,
  "showTopClasses": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState('overview');
  const [drill, setDrill] = React.useState(null);
  const [tooltip, setTooltip] = React.useState(null);
  const [filters, setFilters] = React.useState({
    year: 'all', classId: 'all', gender: 'all', dateRange: 'ytd',
  });

  // Smooth body bg when dark mode flips so the area outside the app doesn't flash
  React.useEffect(() => {
    document.body.style.background = tweaks.dark ? '#0F1115' : '#F3F2F1';
  }, [tweaks.dark]);

  const t = SKM_I18N[tweaks.lang] || SKM_I18N.bm;

  const ctx = {
    tweaks, setTweak, t, lang: tweaks.lang,
    page, setPage, drill, setDrill,
    filters, setFilters,
    tooltip, setTooltip,
  };

  const cssVars = skmCssVars(tweaks);

  const PageComp = {
    overview: PageOverview,
    academic: PageAcademic,
    attendance: PageAttendance,
    students: PageStudents,
    teachers: PageTeachers,
    cocurricular: PageCocurricular,
    discipline: PageDiscipline,
  }[page] || PageOverview;

  return (
    <SKMContext.Provider value={ctx}>
      <div className="skm-app" style={cssVars}>
        <TopBar/>
        <TabBar/>
        <FilterBar/>
        <div className="skm-content">
          <PageHeading/>
          <PageComp/>
        </div>
        <Tooltip/>
        {drill && <ClassDetail classId={drill} onClose={() => setDrill(null)}/>}
        <TweaksUI/>
      </div>
    </SKMContext.Provider>
  );
}

function PageHeading() {
  const { page, t, filters } = useSKM();
  const blurbs = {
    overview:    'Ringkasan pencapaian, kehadiran dan demografi sekolah.',
    academic:    'PBD penuh, perbandingan kelas, dan trend pencapaian.',
    attendance:  'Pemantauan kehadiran harian, mingguan dan bulanan.',
    students:    'Demografi, sosioekonomi, dan saringan murid.',
    teachers:    'Senarai guru, beban mengajar, dan latihan profesional.',
    cocurricular:'Kelab, sukan dan pencapaian luar bilik darjah.',
    discipline:  'Kes disiplin, BMI dan liputan vaksinasi.',
  };
  const filterBadges = [];
  if (filters.year !== 'all')   filterBadges.push('Tahun ' + filters.year);
  if (filters.classId !== 'all') filterBadges.push(SKM.classes.find(c => c.id === filters.classId)?.cls);
  if (filters.gender !== 'all') filterBadges.push(filters.gender === 'L' ? 'Lelaki' : 'Perempuan');
  return (
    <div style={{ marginBottom: 14, display: 'flex', alignItems: 'flex-end', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text)', letterSpacing: -0.3 }}>
          {t.page[page]}
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{blurbs[page]}</div>
      </div>
      {filterBadges.length > 0 && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--muted)' }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Ditapis:</span>
          {filterBadges.map((b, i) => (
            <span key={i} style={{
              padding: '2px 8px', background: 'var(--accent-soft)', color: 'var(--accent)',
              borderRadius: 10, fontWeight: 600, fontSize: 11,
            }}>{b}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function TweaksUI() {
  const { tweaks, setTweak } = useSKM();
  return (
    <TweaksPanel>
      <TweakSection label="Penampilan"/>
      <TweakToggle label="Mod Gelap" value={tweaks.dark} onChange={v => setTweak('dark', v)}/>
      <TweakRadio  label="Ketumpatan" value={tweaks.density}
        options={['compact', 'comfortable']}
        onChange={v => setTweak('density', v)}/>
      <TweakColor  label="Warna Aksen" value={tweaks.accent}
        options={['#117ACA', '#107C10', '#5C2E91', '#A4262C']}
        onChange={v => setTweak('accent', v)}/>
      <TweakSection label="Bahasa"/>
      <TweakRadio label="Bahasa" value={tweaks.lang}
        options={['bm', 'en']}
        onChange={v => setTweak('lang', v)}/>
      <TweakSection label="Kandungan"/>
      <TweakToggle label="Tunjuk Amaran" value={tweaks.showAlerts}
        onChange={v => setTweak('showAlerts', v)}/>
      <TweakToggle label="Tunjuk Kelas Cemerlang" value={tweaks.showTopClasses}
        onChange={v => setTweak('showTopClasses', v)}/>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
