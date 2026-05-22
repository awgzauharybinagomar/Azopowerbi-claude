// Pages — Teachers, Finance, Co-curricular, Discipline, Drill-through

// ─── Page: Teachers ────────────────────────────────────
function PageTeachers() {
  const [sort, setSort] = React.useState('load');
  const sorted = React.useMemo(() => SKM.teachers.slice().sort((a, b) => b[sort] - a[sort]), [sort]);
  const avgLoad = (SKM.teachers.reduce((s, t) => s + t.load, 0) / SKM.teachers.length).toFixed(1);
  const avgCpd  = (SKM.teachers.reduce((s, t) => s + t.cpd, 0) / SKM.teachers.length).toFixed(1);
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="Jumlah Guru" value={SKM.teachers.length} delta={1} deltaSuffix=" YoY" sub="termasuk pentadbir"/>
        <KPI label="Nisbah Guru:Murid" value={`1:${Math.round(SKM.kpis.students / SKM.teachers.length)}`} sub="≤ 1:20 sasaran"/>
        <KPI label="Purata Beban" value={avgLoad} unit="waktu" sub="seminggu"/>
        <KPI label="Purata Jam CPD" value={avgCpd} unit="jam" sub="YTD · sasaran 30j"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Senarai Guru"
          action={
            <div style={{ display: 'flex', gap: 4, fontSize: 11 }}>
              {[['load','Beban'],['cpd','CPD'],['exp','Pengalaman']].map(([k, l]) => (
                <div key={k} className={'skm-btn ghost' + (sort === k ? ' active' : '')}
                  onClick={() => setSort(k)}
                  style={{ padding: '3px 8px',
                    background: sort === k ? 'var(--chip-active-bg)' : 'transparent',
                    color: sort === k ? 'var(--accent)' : 'var(--muted)' }}>
                  {l}
                </div>
              ))}
            </div>
          }>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ color: 'var(--muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                <th style={{ textAlign: 'left',  padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Nama</th>
                <th style={{ textAlign: 'left',  padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Jawatan</th>
                <th style={{ textAlign: 'left',  padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Subjek Utama</th>
                <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Pengl.</th>
                <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>Beban</th>
                <th style={{ textAlign: 'right', padding: '6px 4px', borderBottom: '1px solid var(--border)' }}>CPD</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(g => (
                <tr key={g.name}>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-l)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 11, background: 'var(--accent-soft)',
                        color: 'var(--accent)', display: 'grid', placeItems: 'center',
                        fontSize: 10, fontWeight: 600,
                      }}>{g.name.split(' ').slice(-2).map(s => s[0]).join('')}</div>
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-l)', color: 'var(--muted)' }}>{g.role}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-l)', color: 'var(--muted)' }}>{g.subj}</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{g.exp}t</td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums', color: g.load > 26 ? 'var(--warn)' : 'var(--text)', fontWeight: g.load > 26 ? 600 : 400 }}>
                    {g.load}j
                  </td>
                  <td style={{ padding: '6px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums', color: g.cpd >= 24 ? 'var(--ok)' : g.cpd < 16 ? 'var(--bad)' : 'var(--text)' }}>
                    {g.cpd}j
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <div style={{ display: 'grid', gap: 'var(--gap)', gridAutoRows: 'min-content' }}>
          <Card title="Jam CPD · Bulanan"
            action={<span style={{ fontSize: 11, color: 'var(--ok)' }}>202 jam YTD</span>}>
            <ColumnChart data={SKM.cpd} valueKey="hours" labelKey="month" target={40}/>
          </Card>
          <Card title="Subjek mengikut Bilangan Guru">
            <HBarList data={[
              { name: 'Bahasa Melayu', count: 3 },
              { name: 'Matematik', count: 3 },
              { name: 'Sains', count: 3 },
              { name: 'B. Inggeris', count: 2 },
              { name: 'P. Islam', count: 2 },
              { name: 'PJ', count: 2 },
              { name: 'Lain-lain', count: 3 },
            ]} valueKey="count" labelKey="name" unit=" guru" max={4}/>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Page: Finance ─────────────────────────────────────
function PageFinance() {
  const fmt = v => 'RM' + (v / 1000).toFixed(1) + 'k';
  const fmtFull = v => 'RM' + v.toLocaleString('en-MY');
  const used = SKM.kpis.budgetUsed, total = SKM.kpis.budget;
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="Peruntukan PCG" value={fmt(total)} sub="Setahun · 2025"/>
        <KPI label="Telah Digunakan" value={fmt(used)} sub={`${(used/total*100).toFixed(1)}% peruntukan`}/>
        <KPI label="Baki" value={fmt(total - used)} delta={-4} deltaSuffix="% vs unjuran"/>
        <KPI label="Per Murid" value={'RM' + Math.round(total / SKM.kpis.students)} sub="peruntukan tahunan"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Perbelanjaan vs Peruntukan · Kategori">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SKM.budgetCategories.map(c => {
              const pct = c.spent / c.allocated * 100;
              return (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{c.name}</span>
                    <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(c.spent)} <span style={{ color: 'var(--faint)' }}>/ {fmt(c.allocated)}</span>
                      <span style={{ marginLeft: 8, color: pct > 80 ? 'var(--warn)' : 'var(--text)', fontWeight: 600 }}>{pct.toFixed(0)}%</span>
                    </span>
                  </div>
                  <div style={{ height: 10, background: 'var(--border-l)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%',
                      background: pct > 80 ? 'var(--warn)' : 'var(--accent)' }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card title="Perbelanjaan Bulanan vs Sasaran" action={
          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, background: 'var(--accent)' }}/>Sebenar
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 12, height: 0, borderTop: '2px dashed var(--warn)' }}/>Sasaran
            </span>
          </div>
        }>
          <ColumnChart data={SKM.budgetTrend} valueKey="spend" labelKey="m" target={11875} height={220}
            format={v => 'RM' + (v / 1000).toFixed(0) + 'k'}/>
        </Card>
      </div>
      <Card title="Ringkasan Akaun PCG · 2025">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: 'var(--muted)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              <th style={{ textAlign: 'left',  padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Kategori</th>
              <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Peruntukan</th>
              <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Belanja</th>
              <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>Baki</th>
              <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)' }}>% Guna</th>
              <th style={{ textAlign: 'left', padding: '8px 4px', borderBottom: '1px solid var(--border)', width: 100 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {SKM.budgetCategories.map(c => {
              const pct = c.spent / c.allocated * 100;
              const status = pct > 85 ? { label: 'Hampir Habis', color: 'var(--warn)' }
                          : pct > 50 ? { label: 'Aktif', color: 'var(--ok)' }
                          : { label: 'Awal', color: 'var(--muted)' };
              return (
                <tr key={c.name}>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtFull(c.allocated)}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtFull(c.spent)}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--muted)' }}>{fmtFull(c.allocated - c.spent)}</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{pct.toFixed(1)}%</td>
                  <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 10,
                      background: status.color + '20', color: status.color, fontWeight: 500,
                    }}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Page: Co-curricular ──────────────────────────────
function PageCocurricular() {
  const totalMembers = SKM.cocurricular.reduce((s, c) => s + c.members, 0);
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="Kelab & Persatuan" value={SKM.cocurricular.length} sub="aktif"/>
        <KPI label="Penyertaan" value={totalMembers} sub="penyertaan murid"/>
        <KPI label="Anugerah · 2025" value={3} delta={1} deltaSuffix=" YoY" sub="Daerah / Negeri"/>
        <KPI label="Sukan & Permainan" value={71} sub="murid aktif"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Penyertaan mengikut Kelab"
          action={<span style={{ fontSize: 11, color: 'var(--muted)' }}>seorang murid boleh sertai &gt; 1 kelab</span>}>
          <HBarList data={SKM.cocurricular} valueKey="members" labelKey="name" unit=" murid" colorKey="color"/>
        </Card>
        <Card title="Pencapaian Terkini">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SKM.achievements.map((a, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '8px 0', borderBottom: i < SKM.achievements.length - 1 ? '1px solid var(--border-l)' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 4, background: 'var(--accent-soft)',
                  color: 'var(--accent)', display: 'grid', placeItems: 'center', flex: '0 0 auto',
                  fontSize: 14,
                }}>🏆</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.event}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {a.level} · {a.cat} · {a.year}
                  </div>
                </div>
                <div style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 10,
                  background: a.placing === 'Johan' ? 'var(--ok)20' : 'var(--accent-soft)',
                  color: a.placing === 'Johan' ? 'var(--ok)' : 'var(--accent)',
                  fontWeight: 600, whiteSpace: 'nowrap',
                }}>{a.placing}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Page: Discipline & Health ─────────────────────────
function PageDiscipline() {
  return (
    <div style={{ display: 'grid', gap: 'var(--gap)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KPI label="Kes Disiplin · YTD" value={21} delta={-3} deltaSuffix=" kes" sub="vs sesi lalu"/>
        <KPI label="Murid Terlibat" value={14} sub="4.9% daripada murid"/>
        <KPI label="BMI Normal" value={71} unit="%" sub="murid sihat"/>
        <KPI label="Vaksin Lengkap" value={94} unit="%" sub="setakat ini"/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Kes Disiplin · Bulanan">
          <ColumnChart data={SKM.disciplineByMonth} valueKey="cases" labelKey="m"/>
        </Card>
        <Card title="Jenis Kes Disiplin">
          <HBarList data={SKM.disciplineCategories} valueKey="n" labelKey="kind" unit=" kes" max={10}/>
        </Card>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card title="Indeks Jisim Tubuh (BMI) · Murid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SKM.bmi.map((b, i) => {
              const colors = ['var(--warn)', 'var(--ok)', '#EAA300', 'var(--bad)'];
              return (
                <div key={b.band}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>{b.band}</span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 10, background: 'var(--border-l)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: b.pct + '%', height: '100%', background: colors[i] }}/>
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 6, padding: 10, background: 'var(--accent-soft)',
              color: 'var(--accent-deep)', borderRadius: 2, fontSize: 12 }}>
              43 murid (kurang berat / berlebihan / obes) telah dirujuk ke Klinik Kesihatan Menumbok untuk pemantauan.
            </div>
          </div>
        </Card>
        <Card title="Liputan Vaksinasi">
          <HBarList data={SKM.vaccinations} valueKey="coverage" labelKey="name" max={100}/>
        </Card>
      </div>
    </div>
  );
}

// ─── Drill-through: Class Detail ──────────────────────
function ClassDetail({ classId, onClose }) {
  const cls = SKM.classes.find(c => c.id === classId);
  if (!cls) return null;
  const t = useSKM().t;
  // Synthesize per-subject scores for this class
  const subjects = SKM.pbd.map((p, i) => ({
    subj: p.subj,
    avg: Math.round(cls.avg + (i - 2.5) * 2.4),
    pass: Math.round(((p.t3 + p.t4 + p.t5 + p.t6) / (p.t1+p.t2+p.t3+p.t4+p.t5+p.t6)) * 100),
  }));
  const pbdRow = { ...SKM.pbd[0], subj: cls.cls,
    t1: 1, t2: 2, t3: Math.round(cls.n * 0.25), t4: Math.round(cls.n * 0.35),
    t5: Math.round(cls.n * 0.25), t6: cls.n - Math.round(cls.n * 0.25) - Math.round(cls.n * 0.35) - Math.round(cls.n * 0.25) - 3 };
  return (
    <div className="skm-modal-bg" onClick={onClose}>
      <div className="skm-modal" onClick={e => e.stopPropagation()} style={{ width: 880 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="skm-btn ghost" onClick={onClose} style={{ padding: '4px 8px' }}>
            ← {t.backToOverview}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {t.classDetail}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{cls.cls}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Guru Kelas · {cls.teacher}</div>
        </div>
        <div style={{ padding: 16, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <KPI label="Bilangan Murid" value={cls.n}/>
            <KPI label="Kehadiran" value={cls.attn} unit="%" sub={cls.attn >= 95 ? 'Atas sasaran' : 'Bawah sasaran'}/>
            <KPI label="Skor Purata" value={cls.avg}/>
            <KPI label="Ranking Sekolah"
              value={'#' + (SKM.classes.slice().sort((a, b) => b.avg - a.avg).findIndex(c => c.id === cls.id) + 1)}
              sub="berdasarkan skor"/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card title="Skor mengikut Mata Pelajaran">
              <ColumnChart data={subjects} valueKey="avg" labelKey="subj" height={200}
                format={v => v.toFixed(0)}/>
            </Card>
            <Card title="Taburan Tahap · PBD">
              <PBDStack data={[pbdRow]}/>
            </Card>
          </div>
          <Card title="Senarai Pelajar · ringkasan">
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              ({cls.n} murid · klik untuk butiran individu — TBD)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginTop: 10 }}>
              {Array.from({ length: cls.n }, (_, i) => (
                <div key={i} style={{
                  padding: '6px 8px', background: 'var(--bg-alt)', border: '1px solid var(--border-l)',
                  borderRadius: 2, fontSize: 11, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9, background: 'var(--accent-soft)',
                    color: 'var(--accent)', display: 'grid', placeItems: 'center', fontSize: 9,
                    fontWeight: 600, flex: '0 0 auto',
                  }}>{String.fromCharCode(65 + (i % 26))}</div>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Murid {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

window.PageTeachers = PageTeachers;
window.PageFinance = PageFinance;
window.PageCocurricular = PageCocurricular;
window.PageDiscipline = PageDiscipline;
window.ClassDetail = ClassDetail;
