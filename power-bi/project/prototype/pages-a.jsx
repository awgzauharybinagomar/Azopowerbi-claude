// Pages — Overview, Academic, Attendance, Students

// ─── Helper: filter classes by current filter state ─────────
function useFilteredClasses() {
  const { filters } = useSKM();
  return React.useMemo(() => SKM.classes.filter(c => {
    if (filters.year !== 'all' && c.year !== filters.year) return false;
    if (filters.classId !== 'all' && c.id !== filters.classId) return false;
    return true;
  }), [filters.year, filters.classId]);
}

// Filter monthly attendance trend based on date range
function useFilteredTrend() {
  const { filters } = useSKM();
  const full = SKM.attendanceTrend;
  if (filters.dateRange === '30d')     return full.slice(-2);
  if (filters.dateRange === '7d')      return full.slice(-1);
  if (filters.dateRange === 'session') return full;
  return full;  // ytd default
}

function useFilteredKpis() {
  const { filters } = useSKM();
  const classes = useFilteredClasses();
  if (filters.year === 'all' && filters.classId === 'all' && filters.gender === 'all') {
    return SKM.kpis;
  }
  // Recompute simple aggregates from filtered classes
  const n = classes.reduce((s, c) => s + c.n, 0);
  const attn = classes.length ? classes.reduce((s, c) => s + c.attn * c.n, 0) / Math.max(1, n) : 0;
  const avg  = classes.length ? classes.reduce((s, c) => s + c.avg  * c.n, 0) / Math.max(1, n) : 0;
  return {
    ...SKM.kpis,
    students: n,
    attendance: +attn.toFixed(1),
    passRate: +(avg + 5).toFixed(1),  // approx pass = avg + offset
  };
}

// ─── Page: Overview ─────────────────────────────────────
function PageOverview() {
  const k = useFilteredKpis();
  const trend = useFilteredTrend();
  const { t, tweaks } = useSKM();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--gap)' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--gap)' }}>
        <KPI label={t.students}   value={k.students} delta={SKM.kpis.studentsDelta} deltaSuffix=" murid" sub={t.vs}/>
        <KPI label={t.attendance + ' YTD'} value={k.attendance} unit="%" delta={SKM.kpis.attendanceDelta} deltaSuffix="pp" sub={t.vs}/>
        <KPI label={t.passRate}   value={k.passRate}  unit="%" delta={SKM.kpis.passRateDelta} deltaSuffix="pp" sub="Tahap 3+"/>
        <KPI label={'LINUS'} value={`${SKM.kpis.literacy}/${SKM.kpis.numeracy}`} unit="%" sub={t.literacy + ' / ' + t.numeracy}/>
        <KPI label={t.teachers} value={SKM.kpis.teachers} sub="Nisbah 1:16"/>
      </div>
      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--gap)' }}>
        <div style={{ display: 'grid', gap: 'var(--gap)', gridAutoRows: 'min-content' }}>
          <Card title={t.monthlyAttendance + ' · Jan – Mei 2025'}
            action={<span style={{ fontSize: 11, color: 'var(--muted)' }}>sasaran ≥ 95%</span>}>
            <AttendanceLine data={trend}/>
          </Card>
          <Card title={t.pbdBySubject}>
            <PBDStack data={SKM.pbd}/>
          </Card>
        </div>
        <div style={{ display: 'grid', gap: 'var(--gap)', gridAutoRows: 'min-content' }}>
          <Card title={t.ethnicMix}>
            <Donut data={SKM.ethnic} total={SKM.kpis.students} centerLabel="murid"/>
          </Card>
          <Card title={t.enrolByYear}
            action={<div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--boy)'  }}/>{t.boys[0]}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--girl)' }}/>{t.girls[0]}</span>
            </div>}>
            <EnrolBars data={SKM.enrolByYear}/>
          </Card>
          {tweaks.showAlerts && (
            <Card title={t.alerts}>
              <Alerts data={SKM.alerts}/>
            </Card>
          )}
        </div>
      </div>
      {/* Top classes */}
      {tweaks.showTopClasses && (
        <Card title={t.topClasses + ' · klik untuk butiran'}>
          <ClassTable data={SKM.classes.slice().sort((a, b) => b.avg - a.avg).slice(0, 5)}/>
        </Card>
      )}
    </div>
  );
}

// ─── Page: Academic (PBD penuh, kelas, trend) ───────────
function PageAcademic() {
  const k = useFilteredKpis();
  const classes = useFilteredClasses();
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="PBD Lulus" value={k.passRate} unit="%" delta={3.1} deltaSuffix="pp" sub="Tahap 3+"/>
        <KPI label="Skor Purata" value={(classes.reduce((s, c) => s + c.avg, 0) / Math.max(1, classes.length)).toFixed(1)} sub="markah purata"/>
        <KPI label="Murid Cemerlang" value={Math.round(k.students * 0.31)} sub="Tahap 5–6"/>
        <KPI label="Perlu Sokongan" value={Math.round(k.students * 0.09)} sub="Tahap 1–2" delta={-2} deltaSuffix=" murid"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
        <Card title="PBD · Taburan Tahap mengikut Mata Pelajaran">
          <PBDStack data={SKM.pbd}/>
        </Card>
        <Card title="Trend PBD Lulus · Sesi 2022–2025"
          action={<span style={{ fontSize: 11, color: 'var(--ok)' }}>▲ 11.2pp 3 sesi</span>}>
          <LineChart data={SKM.pbdTrend} xKey="sesi" yKey="pct" unit="%" format={v => v.toFixed(1)}/>
        </Card>
      </div>
      <Card title="Pencapaian Kelas · klik untuk butiran">
        <ClassTable data={classes.slice().sort((a, b) => b.avg - a.avg)}/>
      </Card>
    </div>
  );
}

// ─── Page: Attendance ──────────────────────────────────
function PageAttendance() {
  const k = useFilteredKpis();
  const t = useSKM().t;
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="Kehadiran YTD" value={k.attendance} unit="%" delta={1.8} deltaSuffix="pp" sub={t.vs}/>
        <KPI label="Kehadiran Sempurna" value={73} sub="murid · 100% YTD"/>
        <KPI label="Kelas < 92%" value={2} sub="memerlukan tindakan" delta={-1} deltaSuffix=" kelas"/>
        <KPI label="Hari Persekolahan" value={92} sub="daripada 195"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Kehadiran Bulanan · Trend"
          action={<span style={{ fontSize: 11, color: 'var(--muted)' }}>sasaran ≥ 95%</span>}>
          <AttendanceLine data={SKM.attendanceTrend} height={220}/>
        </Card>
        <Card title="Sebab Ketidakhadiran">
          <HBarList data={SKM.attendanceReasons} valueKey="pct" labelKey="reason"/>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Heatmap Kehadiran Harian · Mei 2025"
          action={<span style={{ fontSize: 11, color: 'var(--muted)' }}>5 minggu × 5 hari</span>}>
          <AttendanceHeatmap data={SKM.attendanceDaily}/>
        </Card>
        <Card title="Kehadiran mengikut Kelas">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.4 }}>
                <th style={{ textAlign: 'left',  padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Kelas</th>
                <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Hadir</th>
                <th style={{ padding: '6px 4px', borderBottom: '1px solid var(--border)', width: '50%' }}></th>
              </tr>
            </thead>
            <tbody>
              {SKM.classes.slice().sort((a, b) => b.attn - a.attn).map(c => (
                <tr key={c.id}>
                  <td style={{ padding: '5px 4px', borderBottom: '1px solid var(--border-l)' }}>{c.cls}</td>
                  <td style={{ padding: '5px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums', color: c.attn >= 95 ? 'var(--ok)' : c.attn < 92 ? 'var(--bad)' : 'var(--text)',
                    fontWeight: 600 }}>{c.attn}%</td>
                  <td style={{ padding: '5px 4px', borderBottom: '1px solid var(--border-l)' }}>
                    <div style={{ height: 6, background: 'var(--border-l)', borderRadius: 1 }}>
                      <div style={{
                        width: `${((c.attn - 85) / 15) * 100}%`, height: '100%',
                        background: c.attn >= 95 ? 'var(--ok)' : c.attn < 92 ? 'var(--bad)' : 'var(--accent)',
                        borderRadius: 1,
                      }}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── Page: Students (demographics, B40, OKU, LINUS) ─────
function PageStudents() {
  const t = useSKM().t;
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="Jumlah Murid" value={SKM.kpis.students} delta={6} deltaSuffix=" YoY"/>
        <KPI label="B40" value={SKM.kpis.b40Pct} unit="%" sub={`${SKM.socioeconomic[0].count} murid`}/>
        <KPI label="OKU" value={SKM.kpis.okuCount} sub="murid berdaftar"/>
        <KPI label="LINUS Literasi" value={SKM.kpis.literacy} unit="%" delta={2} deltaSuffix="pp"/>
        <KPI label="LINUS Numerasi" value={SKM.kpis.numeracy} unit="%" delta={3} deltaSuffix="pp"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--gap)' }}>
        <Card title={t.ethnicMix}>
          <Donut data={SKM.ethnic} total={SKM.kpis.students} centerLabel="murid"/>
        </Card>
        <Card title="Status Sosioekonomi · B40/M40/T20">
          <Donut data={SKM.socioeconomic} total={SKM.kpis.students} centerLabel="murid"/>
        </Card>
        <Card title={t.enrolByYear} action={
          <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--boy)' }}/>{t.boys[0]}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--girl)' }}/>{t.girls[0]}</span>
          </div>
        }>
          <EnrolBars data={SKM.enrolByYear}/>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card title="OKU mengikut Kategori">
          <HBarList data={SKM.oku} valueKey="count" labelKey="kind" unit="" max={6}/>
          <div style={{ marginTop: 12, padding: 10, background: 'var(--accent-soft)',
            color: 'var(--accent-deep)', borderRadius: 2, fontSize: 12 }}>
            7 murid OKU berdaftar dengan JPN. Semua menerima bantuan RMT &amp; KWAPM.
          </div>
        </Card>
        <Card title="LINUS · Saringan mengikut Tahun">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: 'var(--muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                <th style={{ textAlign: 'left',  padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Tahun</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Literasi</th>
                <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Numerasi</th>
                <th style={{ padding: '8px 4px', borderBottom: '1px solid var(--border)', width: '40%' }}></th>
              </tr>
            </thead>
            <tbody>
              {SKM.linus.map(r => (
                <tr key={r.year}>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', fontWeight: 600 }}>{r.year}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums' }}>{r.lit}%</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums' }}>{r.num}%</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--border-l)' }}>
                        <div style={{ width: `${r.lit}%`, height: '100%', background: 'var(--accent)' }}/>
                      </div>
                      <div style={{ flex: 1, height: 6, background: 'var(--border-l)' }}>
                        <div style={{ width: `${r.num}%`, height: '100%', background: '#107C10' }}/>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

window.PageOverview = PageOverview;
window.PageAcademic = PageAcademic;
window.PageAttendance = PageAttendance;
window.PageStudents = PageStudents;
