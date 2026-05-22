// Variation 1 — "Modernized Power BI"
// Familiar Microsoft/Fluent dashboard idiom: white cards on light gray,
// Segoe UI, blue accent. Cleaned-up type ramp + spacing, no chrome noise.

const V1_C = {
  bg:        '#F3F2F1',
  card:      '#FFFFFF',
  border:    '#E1DFDD',
  text:      '#201F1E',
  muted:     '#605E5C',
  faint:     '#8A8886',
  accent:    '#117ACA',
  accentDim: '#DEECF9',
  ok:        '#107C10',
  warn:      '#D83B01',
  bad:       '#A4262C',
  girl:      '#C239B3',
  boy:       '#117ACA',
};

const V1_FONT = '"Segoe UI", "Segoe UI Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

function V1_Chrome({ children }) {
  return (
    <div style={{
      width: 1440, height: 900, background: V1_C.bg, color: V1_C.text,
      font: `13px/1.4 ${V1_FONT}`, display: 'flex', flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

function V1_Header() {
  const m = window.SKM_DATA.meta;
  return (
    <div style={{
      height: 56, background: '#FFFFFF', borderBottom: `1px solid ${V1_C.border}`,
      display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, flex: '0 0 auto',
    }}>
      {/* Power BI–ish mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="2" y="6"  width="5" height="14" fill="#F2C811"/>
          <rect x="9.5" y="2" width="5" height="18" fill="#E8A33D"/>
          <rect x="17" y="9" width="5" height="11" fill="#D98E0B"/>
        </svg>
        <div style={{ fontWeight: 600, fontSize: 14 }}>Laporan Sekolah · {m.school}</div>
        <div style={{ color: V1_C.muted, fontSize: 12 }}>{m.location} · Kod {m.code}</div>
      </div>
      <div style={{ flex: 1 }}/>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['Sesi 2025', 'Semua Tahun', 'Semua Kelas'].map(t => (
          <div key={t} style={{
            border: `1px solid ${V1_C.border}`, padding: '5px 10px 5px 26px',
            borderRadius: 2, fontSize: 12, color: V1_C.text, background: '#FFFFFF',
            position: 'relative',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ position: 'absolute', left: 8, top: 7 }}>
              <path d="M1 2h10l-4 5v4l-2-1V7L1 2z" fill="none" stroke={V1_C.muted} strokeWidth="1"/>
            </svg>
            {t}
          </div>
        ))}
      </div>
      <div style={{ width: 1, height: 24, background: V1_C.border }}/>
      <div style={{ color: V1_C.muted, fontSize: 12 }}>Dikemaskini {m.asOf}</div>
      <div style={{
        width: 28, height: 28, borderRadius: 14, background: V1_C.accent, color: '#fff',
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
      }}>AR</div>
    </div>
  );
}

function V1_KPI({ label, value, unit, delta, deltaSuffix, sub }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div style={{
      background: V1_C.card, border: `1px solid ${V1_C.border}`, borderRadius: 2,
      padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0,
    }}>
      <div style={{ color: V1_C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
        {unit && <div style={{ color: V1_C.muted, fontSize: 14, fontWeight: 500 }}>{unit}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        {delta != null && (
          <span style={{ color: up ? V1_C.ok : V1_C.bad, fontWeight: 600 }}>
            {up ? '▲' : '▼'} {Math.abs(delta)}{deltaSuffix || ''}
          </span>
        )}
        {sub && <span style={{ color: V1_C.muted }}>{sub}</span>}
      </div>
    </div>
  );
}

function V1_Card({ title, action, children, style }) {
  return (
    <div style={{
      background: V1_C.card, border: `1px solid ${V1_C.border}`, borderRadius: 2,
      display: 'flex', flexDirection: 'column', minHeight: 0, ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', padding: '10px 14px 8px',
        borderBottom: `1px solid ${V1_C.border}`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
        <div style={{ flex: 1 }}/>
        {action || <span style={{ color: V1_C.faint, fontSize: 14 }}>⋯</span>}
      </div>
      <div style={{ padding: 14, flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────

function V1_AttendanceLine() {
  const data = window.SKM_DATA.attendanceTrend;
  const W = 560, H = 200, P = { t: 16, r: 12, b: 24, l: 32 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const yMin = 90, yMax = 96;
  const x = i => P.l + (i / (data.length - 1)) * iw;
  const y = v => P.t + (1 - (v - yMin) / (yMax - yMin)) * ih;
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.pct)}`).join(' ');
  const area = `${path} L${x(data.length - 1)},${P.t + ih} L${x(0)},${P.t + ih} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[90, 92, 94, 96].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={V1_C.border}/>
          <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill={V1_C.muted}>{v}%</text>
        </g>
      ))}
      <path d={area} fill={V1_C.accent} opacity="0.08"/>
      <path d={path} fill="none" stroke={V1_C.accent} strokeWidth="2"/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.pct)} r="3.5" fill="#fff" stroke={V1_C.accent} strokeWidth="2"/>
          <text x={x(i)} y={y(d.pct) - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill={V1_C.text}>{d.pct}%</text>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={V1_C.muted}>{d.m}</text>
        </g>
      ))}
    </svg>
  );
}

function V1_PBDStack() {
  const data = window.SKM_DATA.pbd;
  const W = 560, H = 230, P = { t: 8, r: 8, b: 24, l: 90 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const bh = ih / data.length - 6;
  const tahap = [
    { key: 't1', label: 'T1', color: '#A4262C' },
    { key: 't2', label: 'T2', color: '#D83B01' },
    { key: 't3', label: 'T3', color: '#EAA300' },
    { key: 't4', label: 'T4', color: '#107C10' },
    { key: 't5', label: 'T5', color: '#0078D4' },
    { key: 't6', label: 'T6', color: '#5C2E91' },
  ];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {data.map((row, i) => {
          const total = tahap.reduce((s, k) => s + row[k.key], 0);
          let acc = 0;
          return (
            <g key={row.subj} transform={`translate(0,${P.t + i * (bh + 6)})`}>
              <text x={P.l - 8} y={bh / 2 + 4} textAnchor="end" fontSize="11" fill={V1_C.text}>{row.subj}</text>
              {tahap.map(k => {
                const w = (row[k.key] / total) * iw;
                const x = P.l + acc;
                acc += w;
                return (
                  <g key={k.key}>
                    <rect x={x} y={0} width={w} height={bh} fill={k.color}/>
                    {w > 22 && <text x={x + w / 2} y={bh / 2 + 4} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">{row[k.key]}</text>}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: V1_C.muted, flexWrap: 'wrap' }}>
        {tahap.map(t => (
          <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: t.color, display: 'inline-block' }}/>
            Tahap {t.label.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}

function V1_EnrolBars() {
  const data = window.SKM_DATA.enrolByYear;
  const W = 360, H = 200, P = { t: 12, r: 8, b: 22, l: 24 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const max = Math.max(...data.map(d => d.boys + d.girls)) + 4;
  const bw = iw / data.length - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 20, 40].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={P.t + (1 - v / max) * ih} y2={P.t + (1 - v / max) * ih} stroke={V1_C.border}/>
          <text x={P.l - 4} y={P.t + (1 - v / max) * ih + 3} textAnchor="end" fontSize="9" fill={V1_C.muted}>{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = P.l + i * (bw + 8) + 4;
        const bh = (d.boys / max) * ih;
        const gh = (d.girls / max) * ih;
        const yB = P.t + ih - bh;
        const yG = yB - gh;
        return (
          <g key={d.year}>
            <rect x={x} y={yG} width={bw} height={gh} fill={V1_C.girl}/>
            <rect x={x} y={yB} width={bw} height={bh} fill={V1_C.boy}/>
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill={V1_C.muted}>{d.year.replace('Tahun ', 'T')}</text>
            <text x={x + bw / 2} y={yG - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={V1_C.text}>{d.boys + d.girls}</text>
          </g>
        );
      })}
    </svg>
  );
}

function V1_DemographicsDonut() {
  const data = window.SKM_DATA.demographics;
  const colors = ['#117ACA', '#D83B01', '#107C10', '#5C2E91'];
  const total = data.reduce((s, d) => s + d.pct, 0);
  const R = 64, r = 40;
  let acc = 0;
  const arc = (start, end) => {
    const a0 = (start / total) * Math.PI * 2 - Math.PI / 2;
    const a1 = (end / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > total / 2 ? 1 : 0;
    const x0 = 80 + R * Math.cos(a0), y0 = 80 + R * Math.sin(a0);
    const x1 = 80 + R * Math.cos(a1), y1 = 80 + R * Math.sin(a1);
    const x2 = 80 + r * Math.cos(a1), y2 = 80 + r * Math.sin(a1);
    const x3 = 80 + r * Math.cos(a0), y3 = 80 + r * Math.sin(a0);
    return `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3} Z`;
  };
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <svg viewBox="0 0 160 160" width="160" height="160">
        {data.map((d, i) => {
          const path = arc(acc, acc + d.pct);
          acc += d.pct;
          return <path key={i} d={path} fill={colors[i]}/>;
        })}
        <text x="80" y="78" textAnchor="middle" fontSize="22" fontWeight="600" fill={V1_C.text}>287</text>
        <text x="80" y="94" textAnchor="middle" fontSize="10" fill={V1_C.muted}>murid</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
        {data.map((d, i) => (
          <div key={d.group} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, background: colors[i], flex: '0 0 auto' }}/>
            <span style={{ flex: 1, color: V1_C.text }}>{d.group}</span>
            <span style={{ color: V1_C.muted, fontVariantNumeric: 'tabular-nums' }}>{d.count}</span>
            <span style={{ width: 36, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function V1_ClassTable() {
  const data = window.SKM_DATA.topClasses;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ color: V1_C.muted, textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.4 }}>
          <th style={{ textAlign: 'left',  padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, fontWeight: 600 }}>Kelas</th>
          <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, fontWeight: 600 }}>Bil.</th>
          <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, fontWeight: 600 }}>Skor</th>
          <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, fontWeight: 600 }}>Kehadiran</th>
          <th style={{ textAlign: 'left',  padding: '8px 8px', borderBottom: `1px solid ${V1_C.border}`, fontWeight: 600, width: 110 }}>Trend</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={r.cls}>
            <td style={{ padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, fontWeight: 600 }}>{r.cls}</td>
            <td style={{ padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, textAlign: 'right', color: V1_C.muted, fontVariantNumeric: 'tabular-nums' }}>{r.n}</td>
            <td style={{ padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r.avg}</td>
            <td style={{ padding: '8px 4px', borderBottom: `1px solid ${V1_C.border}`, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ color: r.attn >= 95 ? V1_C.ok : V1_C.text }}>{r.attn}%</span>
            </td>
            <td style={{ padding: '8px 8px', borderBottom: `1px solid ${V1_C.border}` }}>
              <svg width="80" height="14" viewBox="0 0 80 14">
                <polyline points={[...Array(8)].map((_, k) =>
                  `${k * 11},${10 - Math.sin(i + k * 0.7) * 3 - (r.avg - 78) * 0.4}`).join(' ')}
                  fill="none" stroke={V1_C.accent} strokeWidth="1.5"/>
              </svg>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function V1_Alerts() {
  const data = window.SKM_DATA.alerts;
  const ico = { warn: V1_C.warn, info: V1_C.accent };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 2, background: ico[a.sev] + '20',
            color: ico[a.sev], display: 'grid', placeItems: 'center', fontWeight: 700,
            fontSize: 11, flex: '0 0 auto',
          }}>!</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{a.who}</div>
            <div style={{ fontSize: 11, color: V1_C.muted }}>{a.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────

function V1_Dashboard() {
  const k = window.SKM_DATA.kpis;
  return (
    <V1_Chrome>
      <V1_Header/>
      <div style={{ flex: 1, padding: 16, display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 12, minHeight: 0 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          <V1_KPI label="Jumlah Murid"  value={k.students} delta={k.studentsDelta} deltaSuffix=" murid" sub="vs sesi lalu"/>
          <V1_KPI label="Kehadiran YTD" value={k.attendance} unit="%" delta={k.attendanceDelta} deltaSuffix="pp" sub="vs sesi lalu"/>
          <V1_KPI label="PBD Lulus"     value={k.passRate}  unit="%" delta={k.passRateDelta}  deltaSuffix="pp" sub="Tahap 3 ke atas"/>
          <V1_KPI label="LINUS"         value={`${k.literacy}/${k.numeracy}`} unit="%" sub="Literasi / Numerasi"/>
          <V1_KPI label="Guru"          value={k.teachers} sub="Nisbah 1:16"/>
        </div>
        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12, minHeight: 0 }}>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1.1fr', gap: 12, minHeight: 0 }}>
            <V1_Card title="Kehadiran Bulanan (Jan – Mei 2025)" action={<span style={{ fontSize: 11, color: V1_C.muted }}>min. 90% sasaran</span>}>
              <V1_AttendanceLine/>
            </V1_Card>
            <V1_Card title="Pentaksiran Bilik Darjah · Taburan Tahap mengikut Mata Pelajaran">
              <V1_PBDStack/>
            </V1_Card>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 0.8fr', gap: 12, minHeight: 0 }}>
            <V1_Card title="Komposisi Etnik">
              <V1_DemographicsDonut/>
            </V1_Card>
            <V1_Card title="Enrolmen mengikut Tahun" action={
              <div style={{ display: 'flex', gap: 10, fontSize: 11, color: V1_C.muted }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: V1_C.boy }}/>L</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: V1_C.girl }}/>P</span>
              </div>
            }>
              <V1_EnrolBars/>
            </V1_Card>
            <V1_Card title="Amaran & Tindakan">
              <V1_Alerts/>
            </V1_Card>
          </div>
        </div>
        {/* Bottom */}
        <V1_Card title="Kelas Berprestasi Tinggi" style={{ height: 200 }}>
          <V1_ClassTable/>
        </V1_Card>
      </div>
    </V1_Chrome>
  );
}

window.V1_Dashboard = V1_Dashboard;
