// Variation 2 — "Editorial / Data Journalism"
// Magazine-style report: serif display, warm paper bg, annotated charts.
// Looks more like a printed feature than a BI tool.

const V2_C = {
  bg:      '#F6F2EA',
  paper:   '#FBF8F2',
  ink:     '#1E1A14',
  body:    '#3A342B',
  muted:   '#7A6F5E',
  rule:    '#D8CFBE',
  accent:  '#9A2A1F',   // deep brick
  warm:    '#C56A2E',
  cool:    '#2C5F73',
  gold:    '#B7892C',
};

const V2_SERIF = 'Source Serif 4, "Source Serif Pro", "Tinos", "Times New Roman", Georgia, serif';
const V2_SANS  = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

function V2_Chrome({ children }) {
  return (
    <div style={{
      width: 1440, height: 900, background: V2_C.bg, color: V2_C.ink,
      font: `14px/1.55 ${V2_SANS}`, padding: 40, display: 'flex', flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

function V2_Masthead() {
  const m = window.SKM_DATA.meta;
  return (
    <div style={{
      borderBottom: `2px solid ${V2_C.ink}`, paddingBottom: 14, marginBottom: 18,
      display: 'flex', alignItems: 'flex-end', gap: 24,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: V2_SANS, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
          color: V2_C.accent, fontWeight: 600, marginBottom: 4,
        }}>Laporan Tahunan · Sesi {m.session}</div>
        <div style={{ fontFamily: V2_SERIF, fontSize: 38, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.05 }}>
          {m.school}, {m.location}
        </div>
        <div style={{ fontFamily: V2_SERIF, fontStyle: 'italic', fontSize: 16, color: V2_C.muted, marginTop: 4 }}>
          A school of {window.SKM_DATA.kpis.students}, taught by {window.SKM_DATA.kpis.teachers}, on the road to Sabah's western shore.
        </div>
      </div>
      <div style={{ textAlign: 'right', fontSize: 11, color: V2_C.muted, lineHeight: 1.6 }}>
        <div>Kod Sekolah</div>
        <div style={{ fontFamily: V2_SERIF, fontSize: 18, color: V2_C.ink, letterSpacing: 1 }}>{m.code}</div>
        <div style={{ marginTop: 6 }}>Setakat</div>
        <div style={{ fontFamily: V2_SERIF, fontSize: 14, color: V2_C.ink }}>{m.asOf}</div>
      </div>
    </div>
  );
}

function V2_Hero() {
  const k = window.SKM_DATA.kpis;
  return (
    <div style={{
      background: V2_C.paper, border: `1px solid ${V2_C.rule}`, padding: '24px 28px',
      display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto', gap: 32, alignItems: 'center',
    }}>
      <div>
        <div style={{
          fontFamily: V2_SERIF, fontSize: 88, fontWeight: 600, lineHeight: 0.95, color: V2_C.accent,
          letterSpacing: -2,
        }}>{k.passRate}<span style={{ fontSize: 36, color: V2_C.warm }}>%</span></div>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: V2_C.muted, marginTop: 4 }}>
          PBD · Tahap 3 ke atas
        </div>
      </div>
      <div style={{ fontFamily: V2_SERIF, fontSize: 17, lineHeight: 1.5, color: V2_C.body, maxWidth: 460 }}>
        Empat daripada lima murid kini mencapai sekurang-kurangnya <em>Tahap Memuaskan</em> dalam
        pentaksiran bilik darjah — naik <strong style={{ color: V2_C.accent }}>3.1 mata peratus</strong> berbanding
        sesi 2024. Bacaan tertinggi di SK Melikai sejak rekod PBD bermula.
      </div>
      <V2_Stat label="Murid"      value={k.students} delta={`+${k.studentsDelta}`}/>
      <V2_Stat label="Kehadiran"  value={`${k.attendance}%`} delta={`+${k.attendanceDelta}pp`}/>
      <V2_Stat label="LINUS Lit." value={`${k.literacy}%`} delta="+2pp"/>
    </div>
  );
}

function V2_Stat({ label, value, delta }) {
  return (
    <div style={{ borderLeft: `1px solid ${V2_C.rule}`, paddingLeft: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: V2_C.muted }}>{label}</div>
      <div style={{ fontFamily: V2_SERIF, fontSize: 30, fontWeight: 600, marginTop: 2, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 11, color: V2_C.warm, marginTop: 2 }}>{delta}</div>
    </div>
  );
}

function V2_AttnLine() {
  const data = window.SKM_DATA.attendanceTrend;
  const W = 720, H = 220, P = { t: 28, r: 110, b: 32, l: 36 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const yMin = 90, yMax = 96;
  const x = i => P.l + (i / (data.length - 1)) * iw;
  const y = v => P.t + (1 - (v - yMin) / (yMax - yMin)) * ih;
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.pct)}`).join(' ');
  const target = 95;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* target line */}
      <line x1={P.l} x2={W - P.r} y1={y(target)} y2={y(target)}
        stroke={V2_C.muted} strokeDasharray="3 3" opacity="0.6"/>
      <text x={W - P.r + 6} y={y(target) + 4} fontSize="10" fill={V2_C.muted} fontStyle="italic" fontFamily={V2_SERIF}>
        sasaran 95%
      </text>
      {[90, 92, 94, 96].map(v => (
        <text key={v} x={P.l - 8} y={y(v) + 3} textAnchor="end" fontSize="10" fill={V2_C.muted} fontFamily={V2_SERIF}>{v}%</text>
      ))}
      <path d={path} fill="none" stroke={V2_C.accent} strokeWidth="2.5"/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.pct)} r="4" fill={V2_C.paper} stroke={V2_C.accent} strokeWidth="2.5"/>
          <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill={V2_C.body} fontFamily={V2_SERIF} fontStyle="italic">{d.m}</text>
        </g>
      ))}
      {/* Annotation on peak */}
      <g>
        <line x1={x(3)} x2={x(3) + 60} y1={y(95.1) - 6} y2={y(95.1) - 28} stroke={V2_C.ink} strokeWidth="0.75"/>
        <text x={x(3) + 64} y={y(95.1) - 32} fontSize="11" fill={V2_C.ink} fontFamily={V2_SERIF} fontStyle="italic">
          Puncak April —
        </text>
        <text x={x(3) + 64} y={y(95.1) - 18} fontSize="11" fill={V2_C.muted} fontFamily={V2_SERIF}>
          minggu ujian pertengahan
        </text>
      </g>
      {/* y-axis label */}
      <text x={P.l - 28} y={P.t - 10} fontSize="10" fill={V2_C.muted} fontFamily={V2_SANS} letterSpacing="2" textTransform="uppercase">
        % HADIR
      </text>
    </svg>
  );
}

function V2_PBDStrips() {
  const data = window.SKM_DATA.pbd;
  const tahap = [
    { k: 't1', c: '#8C2D21' },
    { k: 't2', c: '#C56A2E' },
    { k: 't3', c: '#D9A441' },
    { k: 't4', c: '#7A8C3A' },
    { k: 't5', c: '#2C5F73' },
    { k: 't6', c: '#1B3A4B' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, color: V2_C.muted,
        textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2 }}>
        <span style={{ flex: '0 0 130px' }}>Mata pelajaran</span>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
          <span>Memerlukan sokongan</span><span>·</span><span>Cemerlang</span>
        </div>
        <span style={{ width: 42, textAlign: 'right' }}>Lulus</span>
      </div>
      {data.map(row => {
        const total = tahap.reduce((s, t) => s + row[t.k], 0);
        const pass = ((row.t3 + row.t4 + row.t5 + row.t6) / total * 100).toFixed(0);
        return (
          <div key={row.subj} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              flex: '0 0 130px', fontFamily: V2_SERIF, fontSize: 14, color: V2_C.ink,
            }}>{row.subj}</div>
            <div style={{ flex: 1, height: 16, display: 'flex', border: `1px solid ${V2_C.rule}` }}>
              {tahap.map(t => (
                <div key={t.k} style={{
                  width: `${(row[t.k] / total) * 100}%`, background: t.c,
                }} title={`Tahap ${t.k.slice(1)}: ${row[t.k]}`}/>
              ))}
            </div>
            <div style={{
              flex: '0 0 42px', textAlign: 'right', fontFamily: V2_SERIF, fontSize: 16,
              fontWeight: 600, color: V2_C.ink,
            }}>{pass}<span style={{ fontSize: 10, color: V2_C.muted }}>%</span></div>
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: V2_C.muted,
        fontFamily: V2_SERIF, fontStyle: 'italic' }}>
        {tahap.map((t, i) => (
          <span key={t.k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, background: t.c, display: 'inline-block' }}/>
            Tahap {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function V2_EnrolPyramid() {
  const data = [...window.SKM_DATA.enrolByYear].reverse(); // T6 on top
  const max = Math.max(...data.map(d => Math.max(d.boys, d.girls)));
  const W = 360, rowH = 28, midGap = 36;
  return (
    <svg viewBox={`0 0 ${W} ${data.length * rowH + 28}`} width="100%" style={{ display: 'block' }}>
      <text x={W/2 - midGap/2 - 4} y={12} textAnchor="end" fontSize="10" fill={V2_C.muted} fontFamily={V2_SANS}
        letterSpacing="2" textTransform="uppercase">Lelaki</text>
      <text x={W/2 + midGap/2 + 4} y={12} textAnchor="start" fontSize="10" fill={V2_C.muted} fontFamily={V2_SANS}
        letterSpacing="2" textTransform="uppercase">Perempuan</text>
      {data.map((d, i) => {
        const y = 22 + i * rowH;
        const sideW = (W - midGap) / 2;
        const bw = (d.boys / max) * (sideW - 4);
        const gw = (d.girls / max) * (sideW - 4);
        return (
          <g key={d.year}>
            <rect x={W/2 - midGap/2 - bw} y={y} width={bw} height={18} fill={V2_C.cool}/>
            <rect x={W/2 + midGap/2}      y={y} width={gw} height={18} fill={V2_C.warm}/>
            <text x={W/2 - midGap/2 - bw - 4} y={y + 13} textAnchor="end" fontSize="11" fill={V2_C.body} fontFamily={V2_SERIF}>{d.boys}</text>
            <text x={W/2 + midGap/2 + gw + 4} y={y + 13} textAnchor="start" fontSize="11" fill={V2_C.body} fontFamily={V2_SERIF}>{d.girls}</text>
            <text x={W/2} y={y + 13} textAnchor="middle" fontSize="11" fill={V2_C.ink} fontFamily={V2_SERIF} fontStyle="italic">
              {d.year.replace('Tahun ', 'T')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function V2_Demographics() {
  const data = window.SKM_DATA.demographics;
  const colors = [V2_C.accent, V2_C.gold, V2_C.cool, V2_C.muted];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Single horizontal stacked bar */}
      <div style={{ display: 'flex', height: 22, border: `1px solid ${V2_C.rule}` }}>
        {data.map((d, i) => (
          <div key={d.group} style={{ width: `${d.pct}%`, background: colors[i] }}/>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map((d, i) => (
          <div key={d.group} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 13 }}>
            <span style={{ width: 8, height: 8, background: colors[i], display: 'inline-block' }}/>
            <span style={{ flex: 1, fontFamily: V2_SERIF, color: V2_C.ink }}>{d.group}</span>
            <span style={{ fontFamily: V2_SERIF, fontStyle: 'italic', color: V2_C.muted, fontSize: 12 }}>{d.count} murid</span>
            <span style={{
              fontFamily: V2_SERIF, fontSize: 18, fontWeight: 600, color: V2_C.ink,
              width: 50, textAlign: 'right',
            }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function V2_Section({ kicker, title, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, ...style }}>
      <div style={{
        borderBottom: `1px solid ${V2_C.ink}`, paddingBottom: 6, marginBottom: 14,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: V2_C.accent, fontWeight: 600 }}>
          {kicker}
        </div>
        <div style={{ fontFamily: V2_SERIF, fontSize: 22, fontWeight: 600, marginTop: 2, letterSpacing: -0.3 }}>
          {title}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

function V2_Dashboard() {
  return (
    <V2_Chrome>
      <V2_Masthead/>
      <V2_Hero/>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 36, marginTop: 24, flex: 1, minHeight: 0 }}>
        <V2_Section kicker="Bahagian I · Kehadiran" title="Tertinggi dalam empat tahun">
          <p style={{
            fontFamily: V2_SERIF, fontSize: 14, lineHeight: 1.6, color: V2_C.body,
            margin: '0 0 12px', maxWidth: 620,
          }}>
            Kehadiran bulanan mencatat kenaikan stabil sepanjang separuh pertama sesi, dengan April
            mencatat kemuncak <strong>95.1%</strong> — buat pertama kalinya sasaran kementerian dilepasi.
          </p>
          <V2_AttnLine/>
        </V2_Section>
        <V2_Section kicker="Bahagian II · Demografi" title="Wajah pelajar">
          <p style={{ fontFamily: V2_SERIF, fontSize: 13, lineHeight: 1.55, color: V2_C.body, margin: '0 0 14px' }}>
            Komposisi etnik mencerminkan komuniti pesisir Menumbok — majoriti Bumiputera Sabah,
            dengan kepelbagaian yang stabil sejak 2022.
          </p>
          <V2_Demographics/>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${V2_C.rule}` }}>
            <div style={{
              fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: V2_C.muted,
              marginBottom: 8, fontWeight: 600,
            }}>Enrolmen · Lelaki / Perempuan</div>
            <V2_EnrolPyramid/>
          </div>
        </V2_Section>
      </div>
      <div style={{ marginTop: 18 }}>
        <V2_Section kicker="Bahagian III · Pencapaian Akademik" title="Pentaksiran Bilik Darjah">
          <V2_PBDStrips/>
        </V2_Section>
      </div>
    </V2_Chrome>
  );
}

window.V2_Dashboard = V2_Dashboard;
