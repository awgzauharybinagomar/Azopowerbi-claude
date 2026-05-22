// Shell — top bar, tabs, filter bar, card primitive, tooltip system, alerts.

// ─── Global styles (injected once) ─────────────────────────────
(function injectStyles() {
  if (document.getElementById('skm-styles')) return;
  const s = document.createElement('style');
  s.id = 'skm-styles';
  s.textContent = `
    .skm-app { font: var(--font)/1.4 "Segoe UI", "Segoe UI Variable", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
               color: var(--text); background: var(--bg); width: 100vw; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .skm-topbar { height: 48px; flex: 0 0 auto; background: var(--header-bg); border-bottom: 1px solid var(--border);
                  display: flex; align-items: center; padding: 0 16px; gap: 14px; }
    .skm-tabbar { height: 40px; flex: 0 0 auto; background: var(--header-bg); border-bottom: 1px solid var(--border);
                  display: flex; align-items: stretch; padding: 0 12px; gap: 0; overflow-x: auto; }
    .skm-tab { padding: 0 14px; display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px;
               font-weight: 500; cursor: default; border-bottom: 2px solid transparent; margin-bottom: -1px; white-space: nowrap; }
    .skm-tab:hover { color: var(--text); background: var(--card-hover); }
    .skm-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .skm-tab .ico { width: 14px; height: 14px; }
    .skm-filterbar { height: 44px; flex: 0 0 auto; background: var(--bg-alt); border-bottom: 1px solid var(--border);
                     display: flex; align-items: center; padding: 0 16px; gap: 8px; overflow-x: auto; }
    .skm-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px 4px 10px; height: 26px;
                background: var(--chip-bg); border: 1px solid var(--border); border-radius: 2px; font-size: 12px;
                color: var(--text); cursor: default; white-space: nowrap; }
    .skm-chip:hover { background: var(--card-hover); }
    .skm-chip.active { border-color: var(--chip-active-border); background: var(--chip-active-bg); color: var(--accent); font-weight: 600; }
    .skm-chip .x { width: 14px; height: 14px; display: grid; place-items: center; border-radius: 2px; color: var(--faint); }
    .skm-chip .x:hover { background: var(--ghost); color: var(--text); }
    .skm-card { background: var(--card); border: 1px solid var(--border); border-radius: 2px;
                display: flex; flex-direction: column; min-height: 0; }
    .skm-card-head { display: flex; align-items: center; padding: calc(var(--pad) - 4px) var(--pad) 6px;
                     border-bottom: 1px solid var(--border-l); gap: 8px; }
    .skm-card-title { font-size: var(--card-title-font); font-weight: 600; color: var(--text); }
    .skm-card-sub { font-size: 11px; color: var(--faint); }
    .skm-card-body { padding: var(--pad); flex: 1; min-height: 0; }
    .skm-btn { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--card);
               border: 1px solid var(--border); border-radius: 2px; font-size: 12px; color: var(--text); cursor: default; }
    .skm-btn:hover { background: var(--card-hover); }
    .skm-btn.primary { background: var(--accent); border-color: var(--accent); color: white; }
    .skm-btn.primary:hover { filter: brightness(0.92); }
    .skm-btn.ghost { background: transparent; border-color: transparent; color: var(--muted); }
    .skm-btn.ghost:hover { background: var(--card-hover); color: var(--text); }
    .skm-content { flex: 1; min-height: 0; overflow: auto; padding: 16px; }
    .skm-page-grid { display: grid; gap: var(--gap); }
    .skm-tooltip { position: fixed; pointer-events: none; background: var(--tooltip-bg); color: var(--tooltip-text);
                   border: 1px solid var(--border); border-radius: 4px; padding: 8px 10px; font-size: 12px;
                   box-shadow: 0 6px 20px rgba(0,0,0,0.18); z-index: 100; max-width: 260px; line-height: 1.4; }
    .skm-tooltip .ttk { color: var(--muted); font-size: 11px; margin-right: 4px; }
    .skm-tooltip .ttv { font-weight: 600; font-variant-numeric: tabular-nums; }
    .skm-tooltip .tth { font-weight: 600; margin-bottom: 4px; }
    .skm-modal-bg { position: fixed; inset: 0; background: var(--overlay); display: grid; place-items: center; z-index: 50; }
    .skm-modal { background: var(--card); border: 1px solid var(--border); border-radius: 4px; width: 720px; max-width: 92vw;
                 max-height: 92vh; overflow: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .skm-rangepop { position: absolute; top: calc(100% + 4px); left: 0; background: var(--card); border: 1px solid var(--border);
                    border-radius: 2px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.18); z-index: 20; min-width: 280px; }
    .skm-svg-bar { transition: opacity 0.15s, filter 0.15s; }
    .skm-svg-bar.dim { opacity: 0.35; }
    .skm-svg-bar.hl  { filter: brightness(1.08); }
    .skm-clickable { cursor: pointer; }
    .skm-clickable:hover { filter: brightness(0.96); }
    /* Scrollbars */
    .skm-app *::-webkit-scrollbar { width: 10px; height: 10px; }
    .skm-app *::-webkit-scrollbar-track { background: transparent; }
    .skm-app *::-webkit-scrollbar-thumb { background: var(--ghost); border-radius: 5px; border: 2px solid var(--bg); }
    .skm-app *::-webkit-scrollbar-thumb:hover { background: var(--muted); }
  `;
  document.head.appendChild(s);
})();

// ─── Tooltip ─────────────────────────────────────────────────
function Tooltip() {
  const { tooltip } = useSKM();
  if (!tooltip) return null;
  const { x, y, content } = tooltip;
  return (
    <div className="skm-tooltip" style={{ left: x + 12, top: y + 12 }}>
      {content}
    </div>
  );
}

// Hook to wire hover handlers to any SVG/HTML element.
window.useTip = function() {
  const { setTooltip } = useSKM();
  return {
    onMouseMove: (content) => (e) => setTooltip({ x: e.clientX, y: e.clientY, content }),
    onMouseLeave: () => setTooltip(null),
  };
};

// ─── Top bar ─────────────────────────────────────────────────
function TopBar() {
  const { tweaks, t } = useSKM();
  const m = SKM.meta;
  return (
    <div className="skm-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="22" height="22" viewBox="0 0 24 24">
          <rect x="2"  y="6" width="5" height="14" fill="#F2C811"/>
          <rect x="9.5" y="2" width="5" height="18" fill="#E8A33D"/>
          <rect x="17"  y="9" width="5" height="11" fill="#D98E0B"/>
        </svg>
        <div style={{ fontWeight: 600, fontSize: 13 }}>Laporan Sekolah · {m.school}</div>
        <div style={{ color: 'var(--muted)', fontSize: 12 }}>{m.location} · Kod {m.code}</div>
      </div>
      <div style={{ flex: 1 }}/>
      <ExportButton/>
      <div style={{ width: 1, height: 24, background: 'var(--border)' }}/>
      <div style={{ color: 'var(--muted)', fontSize: 12 }}>{t.updated} {m.asOf}</div>
      <div style={{
        width: 28, height: 28, borderRadius: 14, background: 'var(--accent)', color: '#fff',
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
      }}>AR</div>
    </div>
  );
}

function ExportButton() {
  const [open, setOpen] = React.useState(false);
  const { t } = useSKM();
  return (
    <div style={{ position: 'relative' }}>
      <div className="skm-btn" onClick={() => setOpen(o => !o)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 1v6m0 0L3 4m3 3 3-3M2 9v1a1 1 0 001 1h6a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
        {t.export}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 2, padding: 4, minWidth: 160,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 20,
        }}>
          {['PDF', 'Excel (.xlsx)', 'PowerPoint', 'CSV'].map(opt => (
            <div key={opt} onClick={() => setOpen(false)} className="skm-btn ghost"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '6px 10px' }}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab bar ────────────────────────────────────────────────
const PAGES = [
  { id: 'overview',    icon: 'home' },
  { id: 'academic',    icon: 'book' },
  { id: 'attendance',  icon: 'calendar' },
  { id: 'students',    icon: 'users' },
  { id: 'teachers',    icon: 'briefcase' },
  { id: 'cocurricular', icon: 'trophy' },
  { id: 'discipline',  icon: 'shield' },
];

function TabIcon({ name }) {
  const paths = {
    home:     <path d="M2 6l5-4 5 4v6a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" fill="none" stroke="currentColor" strokeWidth="1.2"/>,
    book:     <path d="M2 3a1 1 0 011-1h3v10H3a1 1 0 01-1-1V3zm5-1h3a1 1 0 011 1v8a1 1 0 01-1 1H7V2z" fill="none" stroke="currentColor" strokeWidth="1.2"/>,
    calendar: <g fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="3" width="10" height="9" rx="1"/><path d="M2 6h10M5 2v2M9 2v2"/></g>,
    users:    <g fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="5" cy="5" r="2"/><path d="M2 11c0-2 1.5-3 3-3s3 1 3 3"/><circle cx="10" cy="5.5" r="1.5"/><path d="M8.5 11c0-1.5 1-2.5 2-2.5s2 1 2 2.5"/></g>,
    briefcase:<g fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="4" width="10" height="8" rx="1"/><path d="M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1"/></g>,
    wallet:   <g fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="2" y="4" width="10" height="8" rx="1"/><path d="M9 8.5h2"/></g>,
    trophy:   <g fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 2h6v3a3 3 0 01-6 0V2zM2 3h2v2a1 1 0 01-2 0V3zm8 0h2v2a1 1 0 01-2 0V3zM6 8v2H4v2h6v-2H8V8"/></g>,
    shield:   <path d="M7 2L2 4v3c0 3 2 5 5 6 3-1 5-3 5-6V4L7 2z" fill="none" stroke="currentColor" strokeWidth="1.2"/>,
  };
  return <svg className="ico" viewBox="0 0 14 14">{paths[name]}</svg>;
}

function TabBar() {
  const { page, setPage, t } = useSKM();
  return (
    <div className="skm-tabbar">
      {PAGES.map(p => (
        <div key={p.id} className={'skm-tab' + (page === p.id ? ' active' : '')}
          onClick={() => setPage(p.id)}>
          <TabIcon name={p.icon}/>
          {t.page[p.id]}
        </div>
      ))}
    </div>
  );
}

// ─── Filter bar ─────────────────────────────────────────────
function FilterBar() {
  const { filters, setFilters, t, lang } = useSKM();
  return (
    <div className="skm-filterbar">
      <svg width="14" height="14" viewBox="0 0 14 14" style={{ color: 'var(--muted)', flex: '0 0 auto' }}>
        <path d="M1 2h12l-4.5 6v4l-3-1.5V8L1 2z" fill="none" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
      <FilterChip label={t.session + ' 2025'} fixed/>
      <FilterChipSelect
        label={t.allYears}
        value={filters.year}
        options={[{ v: 'all', l: t.allYears }, ...Array.from({ length: 6 }, (_, i) => ({
          v: i + 1, l: (lang === 'bm' ? 'Tahun ' : 'Year ') + (i + 1),
        }))]}
        onChange={v => setFilters(f => ({ ...f, year: v, classId: 'all' }))}
      />
      <FilterChipSelect
        label={t.allClasses}
        value={filters.classId}
        options={[
          { v: 'all', l: t.allClasses },
          ...SKM.classes
            .filter(c => filters.year === 'all' || c.year === filters.year)
            .map(c => ({ v: c.id, l: c.cls })),
        ]}
        onChange={v => setFilters(f => ({ ...f, classId: v }))}
      />
      <FilterChipSelect
        label={t.allGender}
        value={filters.gender}
        options={[
          { v: 'all', l: t.allGender },
          { v: 'L', l: t.boys },
          { v: 'P', l: t.girls },
        ]}
        onChange={v => setFilters(f => ({ ...f, gender: v }))}
      />
      <DateRangeChip/>
      <div style={{ flex: 1 }}/>
      {(filters.year !== 'all' || filters.classId !== 'all' || filters.gender !== 'all') && (
        <div className="skm-btn ghost" onClick={() =>
          setFilters({ year: 'all', classId: 'all', gender: 'all', dateRange: filters.dateRange })}>
          ⟲ {t.clear}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, fixed }) {
  return (
    <div className={'skm-chip' + (fixed ? ' active' : '')} style={ fixed ? { opacity: 0.85 } : null }>
      {label}
    </div>
  );
}

function FilterChipSelect({ label, value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const active = value !== 'all';
  const cur = options.find(o => o.v === value);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className={'skm-chip' + (active ? ' active' : '')} onClick={() => setOpen(o => !o)}>
        {cur ? cur.l : label}
        <svg width="10" height="10" viewBox="0 0 10 10" style={{ marginLeft: 2 }}>
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        {active && (
          <div className="x" onClick={(e) => { e.stopPropagation(); onChange('all'); }}>×</div>
        )}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: 'var(--card)',
          border: '1px solid var(--border)', borderRadius: 2, padding: 4, minWidth: 160,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 20, maxHeight: 260, overflow: 'auto',
        }}>
          {options.map(o => (
            <div key={o.v} className="skm-btn ghost"
              style={{
                width: '100%', justifyContent: 'flex-start', padding: '6px 10px',
                background: o.v === value ? 'var(--chip-active-bg)' : 'transparent',
                color: o.v === value ? 'var(--accent)' : 'var(--text)',
                fontWeight: o.v === value ? 600 : 400,
              }}
              onClick={() => { onChange(o.v); setOpen(false); }}>{o.l}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function DateRangeChip() {
  const { filters, setFilters, lang } = useSKM();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const presets = [
    { v: 'ytd',     l: lang === 'bm' ? 'Setakat Tahun' : 'Year to date' },
    { v: '30d',     l: lang === 'bm' ? '30 Hari Lalu'  : 'Last 30 days' },
    { v: '7d',      l: lang === 'bm' ? '7 Hari Lalu'   : 'Last 7 days' },
    { v: 'session', l: lang === 'bm' ? 'Sesi 2025'     : 'Session 2025' },
  ];
  const cur = presets.find(p => p.v === filters.dateRange) || presets[0];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="skm-chip" onClick={() => setOpen(o => !o)} style={{ paddingRight: 10 }}>
        <svg width="12" height="12" viewBox="0 0 14 14" style={{ color: 'var(--muted)' }}>
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="2" y="3" width="10" height="9" rx="1"/><path d="M2 6h10M5 2v2M9 2v2"/>
          </g>
        </svg>
        {cur.l}
      </div>
      {open && (
        <div className="skm-rangepop" style={{ minWidth: 220 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase',
            letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
            {lang === 'bm' ? 'Tempoh Pratetap' : 'Preset range'}
          </div>
          {presets.map(p => (
            <div key={p.v} className="skm-btn ghost"
              style={{
                width: '100%', justifyContent: 'flex-start', padding: '6px 10px', marginBottom: 2,
                background: p.v === filters.dateRange ? 'var(--chip-active-bg)' : 'transparent',
                color: p.v === filters.dateRange ? 'var(--accent)' : 'var(--text)',
              }}
              onClick={() => { setFilters(f => ({ ...f, dateRange: p.v })); setOpen(false); }}>
              {p.l}
            </div>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 6, paddingTop: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
              {lang === 'bm' ? 'Tarikh tersuai' : 'Custom'}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="date" defaultValue="2025-01-01" style={{
                flex: 1, padding: '4px 6px', border: '1px solid var(--border)',
                borderRadius: 2, fontSize: 12, background: 'var(--card)', color: 'var(--text)',
              }}/>
              <input type="date" defaultValue="2025-05-15" style={{
                flex: 1, padding: '4px 6px', border: '1px solid var(--border)',
                borderRadius: 2, fontSize: 12, background: 'var(--card)', color: 'var(--text)',
              }}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Card wrapper ───────────────────────────────────────────
function Card({ title, sub, action, children, style, bodyStyle }) {
  return (
    <div className="skm-card" style={style}>
      {(title || action) && (
        <div className="skm-card-head">
          {title && <div className="skm-card-title">{title}</div>}
          {sub && <div className="skm-card-sub">{sub}</div>}
          <div style={{ flex: 1 }}/>
          {action || <span style={{ color: 'var(--faint)', fontSize: 14 }}>⋯</span>}
        </div>
      )}
      <div className="skm-card-body" style={bodyStyle}>{children}</div>
    </div>
  );
}

window.Card = Card;
window.TopBar = TopBar;
window.TabBar = TabBar;
window.FilterBar = FilterBar;
window.Tooltip = Tooltip;
