# Power BI Dashboard Builder — Agent Instructions

Builds PBIP dashboards from CSV files using `powerbi-modeling-mcp` tools.

**Technical patterns & full templates:** read `WORKING_PATTERNS.md` before writing any model or visual code.
**Resuming a session:** read `CONTINUING_SESSIONS.md` + dashboard's `visual_registry.md` first.

---

## Rules

- Never write TMDL, model.bim, or semantic model files manually — use MCP only
- Each dashboard lives in its own subfolder: `output/DashboardName/` — never in `output/` root
- Write `pages.json` before Power BI Desktop ever opens the file — PBI regenerates page structure if it's missing on first open
- Always `RefreshWithXMLA` immediately after every `table_operations → Create`
- Always use `DIVIDE()` for ratios, never `/`
- Use `QuoteStyle.Csv` in M expressions; absolute Windows paths with escaped backslashes
- No `columns` array on calculated (`daxExpression`) tables

---

## MCP Setup

Before model work: verify `powerbi-modeling` tools are listed → open a blank `.pbip` in PBI Desktop → `ListLocalInstances` → `Connect`.
If tools missing: open Claude Code from `powerbi-claude` dir and reload VS Code (`Ctrl+Shift+P → Developer: Reload Window`).

---

## Build Phases

**1 · Data Discovery** — read CSVs (50–100 rows), infer table names, types, keys, relationships. Summarize before asking.

**2 · Relationship Mapping** — confirm FK/PK, cardinality, fact vs dimension with user.

**3 · Requirements** — ask: business questions, KPIs, time intelligence, slicer dimensions, audience.

**4 · PBIP Structure** — create all files in `output/DashboardName/` including `pages.json` before first PBI Desktop open. Templates → `WORKING_PATTERNS.md §8`.

**5 · Semantic Model (MCP)** — Connect → Create tables + RefreshWithXMLA each → Create relationships → Create `_Measures` table (no `columns`) → Create measures → Validate DAX → ExportToBimFile. Full syntax → `WORKING_PATTERNS.md §3–6`.

**6 · Report Visuals** — write `visual.json` to `pages/<pageHex>/visuals/<visualHex>/visual.json`. Templates → `WORKING_PATTERNS.md §10`. Canvas: 1280×720, title y=0 h=60, KPIs y=70 h=110, content y=200 h=490. Card widths for 5: x=20,268,516,764,1012 (w=228, last w=248).

**7 · visual_registry.md** — create `output/DashboardName/visual_registry.md` mapping hex IDs → names, types, positions, measures, tables, relationships.

**8 · Delivery** — tell user to open `.pbip`. Warn CSVs must stay at original paths. Accept PBIR upgrade on first open; decline TMDL upgrade.

---

## Visual Types

| Use case | `visualType` | Roles |
|---|---|---|
| KPI card | `card` | `Values` |
| Vertical bars | `clusteredColumnChart` | `Category`, `Y` |
| Horizontal bars | `clusteredBarChart` | `Category`, `Y` |
| Line | `lineChart` | `Category`, `Y` |
| Donut | `donutChart` | `Category`, `Y` |
| Slicer | `slicer` | `Values` + `objects` + `filterConfig` |
| Table | `tableEx` | `Values` |
| Matrix | `matrix` | `Rows`, `Columns`, `Values` |
| Title | `textbox` | (no query) |

Slicer dropdown: `mode: 'Dropdown'` + `orientation: "1D"` (no quotes on `1D`).

---

## Data Types

| CSV pattern | M type | BIM | Format |
|---|---|---|---|
| Integer | `Int64.Type` | `int64` | `"#,##0"` |
| Decimal | `type number` | `double` | `"#,##0.00"` |
| Currency | `type number` | `double` | `"$ #,##0.00"` |
| Date (any format) | `type date` | `dateTime` | `"dd/MM/yyyy"` |
| Text | `type text` | `string` | — |

---

## Key Errors

| Error | Fix |
|---|---|
| "user declined to confirm" | Add `--skipconfirmation` to `.mcp.json`, reload window |
| "Columns cannot be specified for calculated tables" | Remove `columns` array from DAX table |
| "Missing required artifact model.bim" | Use `ExportToBimFile` |
| Visuals blank | Use `query.queryState` format — see `WORKING_PATTERNS.md §19` |
| `CustomVisualNotFound` on slicer | Use `"slicer"` + `objects` + `filterConfig` |
| Measures return blank | `RefreshWithXMLA` after every table Create |
| Only 1 page shown, all blank | Missing `pages.json` — create before first PBI open |
| PBI regenerates page folders, wipes visuals | PBI opened before `pages.json` — write it first, then open |

---

## Unknown Visual Formats

Ask user to add the visual manually in PBI Desktop → `Ctrl+S` → Glob for new visual folder → Read the file → Extract pattern → Apply → Delete test folder → Document in `WORKING_PATTERNS.md §10`.
