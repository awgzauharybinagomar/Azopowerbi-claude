// Chart primitives — all SVG, with tooltip & cross-filter support.

// Tahap palette for PBD charts (shared light/dark)
const TAHAP = [
  { k: 't1', label: 'Tahap 1', short: 'T1', color: '#A4262C' },
  { k: 't2', label: 'Tahap 2', short: 'T2', color: '#D83B01' },
  { k: 't3', label: 'Tahap 3', short: 'T3', color: '#EAA300' },
  { k: 't4', label: 'Tahap 4', short: 'T4', color: '#107C10' },
  { k: 't5', label: 'Tahap 5', short: 'T5', color: '#0078D4' },
  { k: 't6', label: 'Tahap 6', short: 'T6', color: '#5C2E91' },
];
window.TAHAP = TAHAP;

// ─── KPI card ──────────────────────────────────────────────
function KPI({ label, value, unit, delta, deltaSuffix, sub, ico }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="skm-card" style={{ padding: 'calc(var(--pad) + 0px) var(--pad)', display: 'flex', flexDirection: 'column', gap: 4, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {ico && (
          <div style={{
            width: 26, height: 26, borderRadius: 4, background: 'var(--accent-soft)',
            color: 'var(--accent)', display: 'grid', placeItems: 'center',
          }}>{ico}</div>
        )}
        <div style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>
          {label}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <div style={{ fontSize: 'var(--kpi-font)', fontWeight: 600, letterSpacing: -0.5, lineHeight: 1, color: 'var(--text)' }}>{value}</div>
        {unit && <div style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}>{unit}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, minHeight: 16 }}>
        {delta != null && (
          <span style={{ color: up ? 'var(--ok)' : 'var(--bad)', fontWeight: 600 }}>
            {up ? '▲' : '▼'} {Math.abs(delta)}{deltaSuffix || ''}
          </span>
        )}
        {sub && <span style={{ color: 'var(--muted)' }}>{sub}</span>}
      </div>
    </div>
  );
}

// ─── Attendance Line ──────────────────────────────────────
function AttendanceLine({ data, height = 200, target = 95 }) {
  const tip = useTip();
  const W = 600, H = height, P = { t: 18, r: 16, b: 26, l: 36 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const yMin = 90, yMax = 96;
  const x = i => P.l + (i / (data.length - 1)) * iw;
  const y = v => P.t + (1 - (v - yMin) / (yMax - yMin)) * ih;
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.pct)}`).join(' ');
  const area = `${path} L${x(data.length - 1)},${P.t + ih} L${x(0)},${P.t + ih} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="attn-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[90, 92, 94, 96].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="var(--border)"/>
          <text x={P.l - 6} y={y(v) + 3} textAnchor="end" fontSize="10" fill="var(--muted)">{v}%</text>
        </g>
      ))}
      <line x1={P.l} x2={W - P.r} y1={y(target)} y2={y(target)}
        stroke="var(--accent)" strokeDasharray="3 3" opacity="0.5"/>
      <text x={W - P.r - 4} y={y(target) - 4} textAnchor="end" fontSize="10" fill="var(--accent)">target {target}%</text>
      <path d={area} fill="url(#attn-area)"/>
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2"/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d.pct)} r="3.5" fill="var(--card)" stroke="var(--accent)" strokeWidth="2"/>
          {/* Hover hit */}
          <rect x={x(i) - 24} y={P.t} width="48" height={ih} fill="transparent"
            onMouseMove={tip.onMouseMove(<>
              <div className="tth">{d.m} 2025</div>
              <div><span className="ttk">Kehadiran</span><span className="ttv">{d.pct}%</span></div>
              <div><span className="ttk">vs sasaran</span>
                <span className="ttv" style={{ color: d.pct >= target ? 'var(--ok)' : 'var(--warn)' }}>
                  {d.pct >= target ? '+' : ''}{(d.pct - target).toFixed(1)}pp
                </span>
              </div>
            </>)}
            onMouseLeave={tip.onMouseLeave}/>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{d.m}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── PBD Stacked Bars (clickable subjects → cross-filter) ──
function PBDStack({ data }) {
  const tip = useTip();
  const W = 600, P = { t: 8, r: 8, b: 28, l: 110 };
  const rowH = 22, gap = 6;
  const H = P.t + data.length * (rowH + gap) - gap + P.b;
  const iw = W - P.l - P.r;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        {data.map((row, i) => {
          const total = TAHAP.reduce((s, k) => s + row[k.k], 0);
          let acc = 0;
          return (
            <g key={row.subj} transform={`translate(0,${P.t + i * (rowH + gap)})`}>
              <text x={P.l - 8} y={rowH / 2 + 4} textAnchor="end" fontSize="11.5" fill="var(--text)">{row.subj}</text>
              {TAHAP.map(k => {
                const w = (row[k.k] / total) * iw;
                const x = P.l + acc;
                acc += w;
                return (
                  <g key={k.k}
                    onMouseMove={tip.onMouseMove(<>
                      <div className="tth">{row.subj} · {k.label}</div>
                      <div><span className="ttk">Murid</span><span className="ttv">{row[k.k]}</span></div>
                      <div><span className="ttk">% kelas</span><span className="ttv">{(row[k.k]/total*100).toFixed(1)}%</span></div>
                    </>)}
                    onMouseLeave={tip.onMouseLeave}>
                    <rect x={x} y={0} width={w} height={rowH} fill={k.color} className="skm-svg-bar"/>
                    {w > 22 && (
                      <text x={x + w / 2} y={rowH / 2 + 4} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">
                        {row[k.k]}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 14, marginTop: 6, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap' }}>
        {TAHAP.map(t => (
          <div key={t.k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, background: t.color, display: 'inline-block' }}/>
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Enrolment Bars (clickable → cross-filter year) ───────
function EnrolBars({ data }) {
  const tip = useTip();
  const { filters, setFilters } = useSKM();
  const W = 360, H = 200, P = { t: 14, r: 8, b: 22, l: 24 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const max = Math.max(...data.map(d => d.boys + d.girls)) + 4;
  const bw = iw / data.length - 6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, 20, 40].map(v => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={P.t + (1 - v / max) * ih} y2={P.t + (1 - v / max) * ih} stroke="var(--border)"/>
          <text x={P.l - 4} y={P.t + (1 - v / max) * ih + 3} textAnchor="end" fontSize="9" fill="var(--muted)">{v}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = P.l + i * (bw + 6) + 3;
        const bh = (d.boys / max) * ih;
        const gh = (d.girls / max) * ih;
        const yB = P.t + ih - bh;
        const yG = yB - gh;
        const year = i + 1;
        const active = filters.year === year;
        const dim = filters.year !== 'all' && !active;
        return (
          <g key={d.year}
            className="skm-clickable"
            onClick={() => setFilters(f => ({ ...f, year: f.year === year ? 'all' : year, classId: 'all' }))}
            onMouseMove={tip.onMouseMove(<>
              <div className="tth">{d.year}</div>
              <div><span className="ttk">Lelaki</span><span className="ttv">{d.boys}</span></div>
              <div><span className="ttk">Perempuan</span><span className="ttv">{d.girls}</span></div>
              <div><span className="ttk">Jumlah</span><span className="ttv">{d.boys + d.girls}</span></div>
            </>)}
            onMouseLeave={tip.onMouseLeave}>
            <rect x={x} y={yG} width={bw} height={gh} fill="var(--girl)" opacity={dim ? 0.35 : 1}/>
            <rect x={x} y={yB} width={bw} height={bh} fill="var(--boy)"  opacity={dim ? 0.35 : 1}/>
            {active && <rect x={x - 2} y={yG - 2} width={bw + 4} height={bh + gh + 4}
              fill="none" stroke="var(--accent)" strokeWidth="1.5"/>}
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">T{year}</text>
            <text x={x + bw / 2} y={yG - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">{d.boys + d.girls}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut ────────────────────────────────────────────────
function Donut({ data, label, total, centerLabel }) {
  const tip = useTip();
  const colors = ['var(--accent)', '#D83B01', '#107C10', '#5C2E91', '#0078D4'];
  const sum = data.reduce((s, d) => s + d.pct, 0);
  const R = 60, r = 38, cx = 70, cy = 70;
  let acc = 0;
  const arc = (start, end) => {
    const a0 = (start / sum) * Math.PI * 2 - Math.PI / 2;
    const a1 = (end / sum) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > sum / 2 ? 1 : 0;
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    const x2 = cx + r * Math.cos(a1), y2 = cy + r * Math.sin(a1);
    const x3 = cx + r * Math.cos(a0), y3 = cy + r * Math.sin(a0);
    return `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3} Z`;
  };
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
      <svg viewBox="0 0 140 140" width="140" height="140">
        {data.map((d, i) => {
          const path = arc(acc, acc + d.pct);
          acc += d.pct;
          return (
            <path key={i} d={path} fill={colors[i % colors.length]}
              className="skm-svg-bar"
              onMouseMove={tip.onMouseMove(<>
                <div className="tth">{d.group || d.band || d.kind}</div>
                <div><span className="ttk">Murid</span><span className="ttv">{d.count}</span></div>
                <div><span className="ttk">%</span><span className="ttv">{d.pct}%</span></div>
              </>)}
              onMouseLeave={tip.onMouseLeave}/>
          );
        })}
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontWeight="600" fill="var(--text)">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--muted)">{centerLabel}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ width: 10, height: 10, background: colors[i % colors.length], flex: '0 0 auto' }}/>
            <span style={{ flex: 1, color: 'var(--text)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.group || d.band || d.kind}</span>
            <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{d.count}</span>
            <span style={{ width: 38, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Class table with drill-through ─────────────────────────
function ClassTable({ data, showTrend = true }) {
  const { setDrill } = useSKM();
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ color: 'var(--muted)', textTransform: 'uppercase', fontSize: 10, letterSpacing: 0.4 }}>
          <th style={{ textAlign: 'left',  padding: '8px 4px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Kelas</th>
          <th style={{ textAlign: 'left',  padding: '8px 4px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Guru Kelas</th>
          <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Bil.</th>
          <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Skor</th>
          <th style={{ textAlign: 'right', padding: '8px 4px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Hadir</th>
          {showTrend && <th style={{ textAlign: 'left', padding: '8px 8px', borderBottom: '1px solid var(--border)', fontWeight: 600, width: 110 }}>Trend</th>}
          <th style={{ width: 24, borderBottom: '1px solid var(--border)' }}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, i) => (
          <tr key={r.id || r.cls} className="skm-clickable" onClick={() => setDrill(r.id || r.cls)}>
            <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', fontWeight: 600, color: 'var(--accent)' }}>{r.cls}</td>
            <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', color: 'var(--muted)' }}>{r.teacher || '—'}</td>
            <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{r.n}</td>
            <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{r.avg}</td>
            <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ color: r.attn >= 95 ? 'var(--ok)' : 'var(--text)' }}>{r.attn}%</span>
            </td>
            {showTrend && (
              <td style={{ padding: '8px 8px', borderBottom: '1px solid var(--border-l)' }}>
                <svg width="80" height="14" viewBox="0 0 80 14">
                  <polyline
                    points={[...Array(8)].map((_, k) => `${k * 11},${10 - Math.sin(i + k * 0.7) * 3 - (r.avg - 78) * 0.4}`).join(' ')}
                    fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
                </svg>
              </td>
            )}
            <td style={{ padding: '8px 4px', borderBottom: '1px solid var(--border-l)', color: 'var(--faint)' }}>›</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Alerts ───────────────────────────────────────────────
function Alerts({ data }) {
  const palette = { warn: 'var(--warn)', info: 'var(--accent)', bad: 'var(--bad)' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{
            width: 22, height: 22, borderRadius: 2, background: palette[a.sev] + '20',
            color: palette[a.sev], display: 'grid', placeItems: 'center', fontWeight: 700,
            fontSize: 11, flex: '0 0 auto',
          }}>!</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{a.who}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Heatmap (attendance daily) ─────────────────────────────
function AttendanceHeatmap({ data }) {
  const tip = useTip();
  const days = ['Isn', 'Sel', 'Rab', 'Kha', 'Jum'];
  const scale = v => {
    const t = Math.max(0, Math.min(1, (v - 88) / 8));
    return `rgba(17, 122, 202, ${0.15 + t * 0.75})`;
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(5, 1fr)', gap: 4 }}>
        <div/>
        {days.map(d => <div key={d} style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', padding: '4px 0' }}>{d}</div>)}
        {data.map((week, wi) => (
          <React.Fragment key={wi}>
            <div style={{ fontSize: 10, color: 'var(--muted)', display: 'grid', placeItems: 'center' }}>W{wi+1}</div>
            {week.map((v, di) => (
              <div key={di} style={{
                aspectRatio: '1.5/1', background: scale(v), borderRadius: 2,
                display: 'grid', placeItems: 'center', fontSize: 10, color: v > 93 ? 'white' : 'var(--text)',
                fontWeight: 500,
              }}
              onMouseMove={tip.onMouseMove(<>
                <div className="tth">Minggu {wi+1} · {days[di]}</div>
                <div><span className="ttk">Kehadiran</span><span className="ttv">{v}%</span></div>
              </>)}
              onMouseLeave={tip.onMouseLeave}>
                {v.toFixed(0)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal bar list ────────────────────────────────────
function HBarList({ data, valueKey = 'pct', labelKey = 'name', max, unit = '%', colorKey, accent }) {
  const tip = useTip();
  const m = max ?? Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}
          onMouseMove={tip.onMouseMove(<>
            <div className="tth">{d[labelKey]}</div>
            <div><span className="ttk">Nilai</span><span className="ttv">{d[valueKey]}{unit}</span></div>
          </>)}
          onMouseLeave={tip.onMouseLeave}>
          <div style={{ flex: '0 0 130px', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {d[labelKey]}
          </div>
          <div style={{ flex: 1, height: 12, background: 'var(--border-l)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              width: `${(d[valueKey] / m) * 100}%`, height: '100%',
              background: colorKey ? d[colorKey] : (accent || 'var(--accent)'),
            }}/>
          </div>
          <div style={{ flex: '0 0 48px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
            {d[valueKey]}{unit}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Generic column chart ───────────────────────────────────
function ColumnChart({ data, valueKey, labelKey, height = 180, target, format = v => v }) {
  const tip = useTip();
  const W = 400, H = height, P = { t: 18, r: 12, b: 26, l: 36 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const max = Math.max(...data.map(d => d[valueKey]), target || 0) * 1.15;
  const bw = iw / data.length - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0, max / 2, max].map((v, i) => (
        <g key={i}>
          <line x1={P.l} x2={W - P.r} y1={P.t + (1 - v / max) * ih} y2={P.t + (1 - v / max) * ih} stroke="var(--border-l)"/>
          <text x={P.l - 4} y={P.t + (1 - v / max) * ih + 3} textAnchor="end" fontSize="9" fill="var(--muted)">{format(Math.round(v))}</text>
        </g>
      ))}
      {target != null && (
        <line x1={P.l} x2={W - P.r} y1={P.t + (1 - target / max) * ih} y2={P.t + (1 - target / max) * ih}
          stroke="var(--warn)" strokeDasharray="3 3"/>
      )}
      {data.map((d, i) => {
        const x = P.l + i * (bw + 8) + 4;
        const bh = (d[valueKey] / max) * ih;
        const y = P.t + ih - bh;
        return (
          <g key={i}
            onMouseMove={tip.onMouseMove(<>
              <div className="tth">{d[labelKey]}</div>
              <div><span className="ttk">Nilai</span><span className="ttv">{format(d[valueKey])}</span></div>
            </>)}
            onMouseLeave={tip.onMouseLeave}>
            <rect x={x} y={y} width={bw} height={bh} fill="var(--accent)"/>
            <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{d[labelKey]}</text>
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">{format(d[valueKey])}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Line chart (generic) ───────────────────────────────────
function LineChart({ data, xKey, yKey, height = 180, format = v => v, unit = '' }) {
  const tip = useTip();
  const W = 400, H = height, P = { t: 18, r: 12, b: 26, l: 36 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const vals = data.map(d => d[yKey]);
  const max = Math.max(...vals) * 1.1;
  const min = Math.min(0, Math.min(...vals) * 0.9);
  const x = i => P.l + (i / (data.length - 1)) * iw;
  const y = v => P.t + (1 - (v - min) / (max - min)) * ih;
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d[yKey])}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2"/>
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(d[yKey])} r="3.5" fill="var(--card)" stroke="var(--accent)" strokeWidth="2"/>
          <rect x={x(i) - 24} y={P.t} width="48" height={ih} fill="transparent"
            onMouseMove={tip.onMouseMove(<>
              <div className="tth">{d[xKey]}</div>
              <div><span className="ttk">Nilai</span><span className="ttv">{format(d[yKey])}{unit}</span></div>
            </>)}
            onMouseLeave={tip.onMouseLeave}/>
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--muted)">{d[xKey]}</text>
          <text x={x(i)} y={y(d[yKey]) - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text)">{format(d[yKey])}</text>
        </g>
      ))}
    </svg>
  );
}

// Expose
Object.assign(window, {
  KPI, AttendanceLine, PBDStack, EnrolBars, Donut, ClassTable, Alerts,
  AttendanceHeatmap, HBarList, ColumnChart, LineChart, TAHAP,
});
