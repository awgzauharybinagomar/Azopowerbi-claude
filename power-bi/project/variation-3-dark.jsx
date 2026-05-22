// Variation 3 — "Operations Console"
// Dark, dense, observability-tool aesthetic. Mono numbers, vivid accents,
// information-dense layout. Reads more like a control room than a report.

const V3_C = {
  bg:      '#0A0E1A',
  panel:   '#10162A',
  panel2:  '#161D33',
  border:  'rgba(255,255,255,0.06)',
  borderL: 'rgba(255,255,255,0.12)',
  text:    '#E6E8EE',
  muted:   '#8A93A6',
  faint:   '#4E5566',
  cyan:    '#34D8FF',
  emerald: '#34D399',
  amber:   '#FBBF24',
  red:     '#F87171',
  violet:  '#A78BFA',
  pink:    '#F472B6',
};

const V3_SANS = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
const V3_MONO = '"JetBrains Mono", "SF Mono", ui-monospace, "Cascadia Mono", Menlo, monospace';

function V3_Chrome({ children }) {
  return (
    <div style={{
      width: 1440, height: 900, background: V3_C.bg, color: V3_C.text,
      font: `13px/1.4 ${V3_SANS}`, display: 'flex', flexDirection: 'column',
      backgroundImage: `radial-gradient(circle at 20% -10%, rgba(52,216,255,0.06), transparent 50%),
                         radial-gradient(circle at 100% 100%, rgba(167,139,250,0.05), transparent 50%)`,
    }}>
      {children}
    </div>
  );
}

function V3_TopBar() {
  const m = window.SKM_DATA.meta;
  return (
    <div style={{
      height: 48, borderBottom: `1px solid ${V3_C.border}`, display: 'flex',
      alignItems: 'center', padding: '0 16px', gap: 14, flex: '0 0 auto',
      background: 'rgba(0,0,0,0.2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 5, background: V3_C.cyan,
          boxShadow: `0 0 16px ${V3_C.cyan}80`,
          display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 12, color: V3_C.bg,
        }}>SK</div>
        <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: 0.2 }}>
          {m.school}<span style={{ color: V3_C.faint }}> / </span>
          <span style={{ color: V3_C.muted, fontWeight: 500 }}>{m.location}</span>
        </div>
      </div>
      {/* tabs */}
      <div style={{ display: 'flex', gap: 0, marginLeft: 16 }}>
        {['Overview', 'Akademik', 'Kehadiran', 'Guru', 'Kewangan'].map((t, i) => (
          <div key={t} style={{
            padding: '14px 14px', fontSize: 12, fontWeight: 500,
            color: i === 0 ? V3_C.text : V3_C.muted,
            borderBottom: i === 0 ? `2px solid ${V3_C.cyan}` : '2px solid transparent',
            marginBottom: -1,
          }}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
        background: 'rgba(52,211,153,0.1)', border: `1px solid ${V3_C.emerald}40`,
        borderRadius: 4, fontSize: 11, color: V3_C.emerald, fontFamily: V3_MONO,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 3, background: V3_C.emerald,
          boxShadow: `0 0 8px ${V3_C.emerald}` }}/>
        LIVE · sinkron 12s lalu
      </div>
      <div style={{ fontSize: 11, color: V3_C.muted, fontFamily: V3_MONO }}>{m.asOf}</div>
      <div style={{
        width: 28, height: 28, borderRadius: 6, border: `1px solid ${V3_C.borderL}`,
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, color: V3_C.muted,
      }}>AR</div>
    </div>
  );
}

function V3_Panel({ title, sub, accent, children, style, headerRight }) {
  return (
    <div style={{
      background: V3_C.panel, border: `1px solid ${V3_C.border}`, borderRadius: 8,
      display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', ...style,
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 12, right: 12, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}/>
      )}
      {title && (
        <div style={{
          padding: '10px 14px 8px', display: 'flex', alignItems: 'center',
          borderBottom: `1px solid ${V3_C.border}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: V3_C.muted, textTransform: 'uppercase', letterSpacing: 1.2 }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: V3_C.faint, marginLeft: 8 }}>{sub}</div>}
          <div style={{ flex: 1 }}/>
          {headerRight}
        </div>
      )}
      <div style={{ padding: 14, flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}

function V3_KPI({ label, value, unit, delta, deltaSuffix, accent, spark }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div style={{
      background: V3_C.panel, border: `1px solid ${V3_C.border}`, borderRadius: 8,
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: accent, opacity: 0.7,
      }}/>
      <div style={{
        fontSize: 10, fontWeight: 600, color: V3_C.muted, textTransform: 'uppercase', letterSpacing: 1.5,
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, fontFamily: V3_MONO }}>
        <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -1, color: V3_C.text, lineHeight: 1 }}>{value}</div>
        {unit && <div style={{ color: V3_C.muted, fontSize: 14 }}>{unit}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {delta != null && (
          <span style={{
            fontFamily: V3_MONO, fontSize: 11, padding: '2px 6px', borderRadius: 3,
            color: up ? V3_C.emerald : V3_C.red,
            background: up ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
          }}>{up ? '↑' : '↓'} {Math.abs(delta)}{deltaSuffix || ''}</span>
        )}
        {spark && (
          <svg width="60" height="14" viewBox="0 0 60 14" style={{ marginLeft: 'auto' }}>
            <polyline points={spark} fill="none" stroke={accent} strokeWidth="1.25"/>
          </svg>
        )}
      </div>
    </div>
  );
}

function V3_AreaChart() {
  const data = window.SKM_DATA.attendanceTrend;
  const W = 600, H = 200, P = { t: 16, r: 16, b: 28, l: 36 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const yMin = 90, yMax = 96;
  const x = i => P.l + (i / (data.length - 1)) * iw;
  const y = v => P.t + (1 - (v - yMin) / (yMax - yMin)) * ih;
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.pct)}`).join(' ');
  const area = `${path} L${x(data.length - 1)},${P.t + ih} L${x(0)},${P.t + ih} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="v3-attn" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={V3_C.cyan} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={V3_C.cyan} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[90, 92, 94, 96].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={V3_C.border}/>
          <text x={P.l - 8} y={y(v) + 3} textAnchor="end" fontSize="10" fill={V3_C.faint} fontFamily={V3_MONO}>{v}</text>
        </g>
      ))}
      <path d={area} fill="url(#v3-attn)"/>
      <path d={path} fill="none" stroke={V3_C.cyan} strokeWidth="2"
        style={{ filter: `drop-shadow(0 0 6px ${V3_C.cyan}80)` }}/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.pct)} r="3.5" fill={V3_C.bg} stroke={V3_C.cyan} strokeWidth="1.5"/>
          <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="10" fill={V3_C.muted} fontFamily={V3_MONO}>{d.m}</text>
        </g>
      ))}
    </svg>
  );
}

function V3_PBDHeatmap() {
  const data = window.SKM_DATA.pbd;
  const tahap = ['t1','t2','t3','t4','t5','t6'];
  const colors = ['#7F1D1D', '#B45309', '#A16207', '#15803D', '#0E7490', '#5B21B6'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '110px repeat(6, 1fr) 56px',
        gap: 4, fontSize: 10, color: V3_C.faint, fontFamily: V3_MONO, paddingLeft: 4, marginBottom: 2 }}>
        <div></div>
        {tahap.map((t, i) => <div key={t} style={{ textAlign: 'center' }}>T{i+1}</div>)}
        <div style={{ textAlign: 'right' }}>LULUS</div>
      </div>
      {data.map(row => {
        const total = tahap.reduce((s, k) => s + row[k], 0);
        const pass = (row.t3 + row.t4 + row.t5 + row.t6) / total * 100;
        return (
          <div key={row.subj} style={{
            display: 'grid', gridTemplateColumns: '110px repeat(6, 1fr) 56px', gap: 4, alignItems: 'center',
          }}>
            <div style={{ fontSize: 12, color: V3_C.text, fontWeight: 500 }}>{row.subj}</div>
            {tahap.map((k, i) => {
              const v = row[k];
              const intensity = Math.min(1, v / 42);
              return (
                <div key={k} style={{
                  height: 26, background: colors[i],
                  opacity: 0.25 + intensity * 0.75,
                  borderRadius: 3, display: 'grid', placeItems: 'center',
                  fontFamily: V3_MONO, fontSize: 11, color: '#fff', fontWeight: 600,
                }}>{v}</div>
              );
            })}
            <div style={{
              textAlign: 'right', fontFamily: V3_MONO, fontSize: 13,
              color: pass >= 85 ? V3_C.emerald : pass >= 75 ? V3_C.amber : V3_C.red,
              fontWeight: 600,
            }}>{pass.toFixed(0)}%</div>
          </div>
        );
      })}
    </div>
  );
}

function V3_Pyramid() {
  const data = [...window.SKM_DATA.enrolByYear].reverse();
  const max = Math.max(...data.map(d => Math.max(d.boys, d.girls)));
  const rowH = 22, W = 280, mid = 28;
  return (
    <svg viewBox={`0 0 ${W} ${data.length * rowH + 14}`} width="100%" style={{ display: 'block' }}>
      {data.map((d, i) => {
        const y = 6 + i * rowH;
        const side = (W - mid) / 2;
        const bw = (d.boys / max) * (side - 16);
        const gw = (d.girls / max) * (side - 16);
        return (
          <g key={d.year}>
            <rect x={W/2 - mid/2 - bw} y={y} width={bw} height={14} fill={V3_C.cyan} opacity="0.85" rx="2"/>
            <rect x={W/2 + mid/2}      y={y} width={gw} height={14} fill={V3_C.pink} opacity="0.85" rx="2"/>
            <text x={W/2 - mid/2 - bw - 6} y={y + 11} textAnchor="end" fontSize="11"
              fill={V3_C.muted} fontFamily={V3_MONO}>{d.boys}</text>
            <text x={W/2 + mid/2 + gw + 6} y={y + 11} textAnchor="start" fontSize="11"
              fill={V3_C.muted} fontFamily={V3_MONO}>{d.girls}</text>
            <text x={W/2} y={y + 11} textAnchor="middle" fontSize="10" fill={V3_C.faint} fontFamily={V3_MONO}>
              {d.year.replace('Tahun ', 'T')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function V3_Cocurricular() {
  const data = window.SKM_DATA.cocurricular;
  const max = Math.max(...data.map(d => d.members));
  const cols = [V3_C.emerald, V3_C.red, V3_C.cyan, V3_C.amber, V3_C.violet, V3_C.pink];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d, i) => (
        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
          <div style={{ flex: '0 0 140px', color: V3_C.text }}>{d.name}</div>
          <div style={{ flex: 1, height: 6, background: V3_C.panel2, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              width: `${(d.members / max) * 100}%`, height: '100%',
              background: cols[i],
              boxShadow: `0 0 8px ${cols[i]}80`,
            }}/>
          </div>
          <div style={{
            flex: '0 0 32px', textAlign: 'right', fontFamily: V3_MONO,
            color: V3_C.text, fontWeight: 600,
          }}>{d.members}</div>
        </div>
      ))}
    </div>
  );
}

function V3_Donut() {
  const data = window.SKM_DATA.demographics;
  const colors = [V3_C.cyan, V3_C.violet, V3_C.amber, V3_C.muted];
  const total = data.reduce((s, d) => s + d.pct, 0);
  const R = 56, r = 36;
  let acc = 0;
  const arc = (start, end) => {
    const a0 = (start / total) * Math.PI * 2 - Math.PI / 2;
    const a1 = (end / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > total / 2 ? 1 : 0;
    const x0 = 70 + R * Math.cos(a0), y0 = 70 + R * Math.sin(a0);
    const x1 = 70 + R * Math.cos(a1), y1 = 70 + R * Math.sin(a1);
    const x2 = 70 + r * Math.cos(a1), y2 = 70 + r * Math.sin(a1);
    const x3 = 70 + r * Math.cos(a0), y3 = 70 + r * Math.sin(a0);
    return `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3} Z`;
  };
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <svg viewBox="0 0 140 140" width="120" height="120">
        {data.map((d, i) => {
          const p = arc(acc, acc + d.pct);
          acc += d.pct;
          return <path key={i} d={p} fill={colors[i]} opacity="0.9"/>;
        })}
        <text x="70" y="68" textAnchor="middle" fontSize="22" fontWeight="600"
          fill={V3_C.text} fontFamily={V3_MONO}>287</text>
        <text x="70" y="84" textAnchor="middle" fontSize="9" fill={V3_C.muted}
          letterSpacing="2" textTransform="uppercase">MURID</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
        {data.map((d, i) => (
          <div key={d.group} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <span style={{ width: 8, height: 8, background: colors[i], borderRadius: 2 }}/>
            <span style={{ flex: 1, color: V3_C.text, fontSize: 11, minWidth: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.group}</span>
            <span style={{ fontFamily: V3_MONO, color: V3_C.muted, fontSize: 11 }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function V3_Alerts() {
  const data = window.SKM_DATA.alerts;
  const palette = { warn: V3_C.amber, info: V3_C.cyan };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((a, i) => (
        <div key={i} style={{
          display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 10px',
          background: V3_C.panel2, borderRadius: 5, borderLeft: `2px solid ${palette[a.sev]}`,
        }}>
          <div style={{
            fontFamily: V3_MONO, fontSize: 10, color: palette[a.sev], letterSpacing: 1,
            textTransform: 'uppercase', flex: '0 0 auto', marginTop: 1,
          }}>{a.sev === 'warn' ? 'WARN' : 'INFO'}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: V3_C.text }}>{a.who}</div>
            <div style={{ fontSize: 11, color: V3_C.muted, marginTop: 1 }}>{a.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function V3_ClassList() {
  const data = window.SKM_DATA.topClasses;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ color: V3_C.faint, fontFamily: V3_MONO }}>
          <th style={{ textAlign: 'left',  padding: '4px 6px', fontSize: 10, letterSpacing: 1, fontWeight: 500 }}>KELAS</th>
          <th style={{ textAlign: 'right', padding: '4px 6px', fontSize: 10, letterSpacing: 1, fontWeight: 500 }}>N</th>
          <th style={{ textAlign: 'right', padding: '4px 6px', fontSize: 10, letterSpacing: 1, fontWeight: 500 }}>SKOR</th>
          <th style={{ textAlign: 'right', padding: '4px 6px', fontSize: 10, letterSpacing: 1, fontWeight: 500 }}>HADIR</th>
        </tr>
      </thead>
      <tbody>
        {data.map(r => (
          <tr key={r.cls} style={{ borderTop: `1px solid ${V3_C.border}` }}>
            <td style={{ padding: '7px 6px', color: V3_C.text, fontWeight: 500 }}>{r.cls}</td>
            <td style={{ padding: '7px 6px', textAlign: 'right', color: V3_C.muted, fontFamily: V3_MONO }}>{r.n}</td>
            <td style={{ padding: '7px 6px', textAlign: 'right', fontFamily: V3_MONO, color: V3_C.cyan, fontWeight: 600 }}>{r.avg}</td>
            <td style={{ padding: '7px 6px', textAlign: 'right', fontFamily: V3_MONO,
              color: r.attn >= 95 ? V3_C.emerald : V3_C.text }}>{r.attn}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function V3_Dashboard() {
  const k = window.SKM_DATA.kpis;
  return (
    <V3_Chrome>
      <V3_TopBar/>
      <div style={{ flex: 1, padding: 14, display: 'grid',
        gridTemplateRows: 'auto 1fr 1fr', gap: 12, minHeight: 0 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          <V3_KPI label="Murid"     value={k.students} delta={k.studentsDelta} deltaSuffix=" YoY" accent={V3_C.cyan}    spark="0,8 12,6 24,7 36,4 48,3 60,2"/>
          <V3_KPI label="Kehadiran" value={k.attendance} unit="%" delta={k.attendanceDelta} deltaSuffix="pp" accent={V3_C.emerald} spark="0,10 12,8 24,6 36,3 48,4 60,5"/>
          <V3_KPI label="PBD Lulus" value={k.passRate}  unit="%" delta={k.passRateDelta} deltaSuffix="pp" accent={V3_C.violet}  spark="0,11 12,9 24,7 36,6 48,4 60,3"/>
          <V3_KPI label="LINUS Lit." value={k.literacy} unit="%" delta={2} deltaSuffix="pp" accent={V3_C.amber}   spark="0,9 12,7 24,6 36,4 48,3 60,2"/>
          <V3_KPI label="Guru"      value={k.teachers} delta={1} deltaSuffix=" guru" accent={V3_C.pink}   spark="0,5 12,5 24,4 36,4 48,3 60,3"/>
        </div>
        {/* Middle row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.9fr', gap: 12, minHeight: 0 }}>
          <V3_Panel title="Kehadiran · Bulanan" sub="Jan – Mei 2025"
            accent={V3_C.cyan}
            headerRight={<div style={{ display: 'flex', gap: 6, fontFamily: V3_MONO, fontSize: 10, color: V3_C.faint }}>
              <span>5d</span><span style={{ color: V3_C.text }}>5b</span><span>YTD</span></div>}>
            <V3_AreaChart/>
          </V3_Panel>
          <V3_Panel title="Demografi" accent={V3_C.violet}>
            <V3_Donut/>
          </V3_Panel>
          <V3_Panel title="Amaran" sub="3 aktif" accent={V3_C.amber}>
            <V3_Alerts/>
          </V3_Panel>
        </div>
        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 0.9fr', gap: 12, minHeight: 0 }}>
          <V3_Panel title="PBD · Taburan Tahap" sub="Bil. murid mengikut mata pelajaran" accent={V3_C.emerald}>
            <V3_PBDHeatmap/>
          </V3_Panel>
          <V3_Panel title="Kelab & Aktiviti" sub="Penyertaan murid" accent={V3_C.pink}>
            <V3_Cocurricular/>
          </V3_Panel>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12, minHeight: 0 }}>
            <V3_Panel title="Enrolmen · L / P" accent={V3_C.cyan}>
              <V3_Pyramid/>
            </V3_Panel>
            <V3_Panel title="Kelas Cemerlang" accent={V3_C.cyan}>
              <V3_ClassList/>
            </V3_Panel>
          </div>
        </div>
      </div>
    </V3_Chrome>
  );
}

window.V3_Dashboard = V3_Dashboard;
