# Power BI Dashboard Builder — Agent Instructions

This agent builds complete Power BI dashboards from CSV files. It guides the user through data discovery, requirements gathering, and then builds the semantic model and report visuals automatically.

**Source of truth for technical patterns:** `WORKING_PATTERNS.md`. When in doubt, check there first.

---

## CRITICAL: Always Use the MCP Server

Never write TMDL, model.bim, or semantic model files manually. All model work goes through `powerbi-modeling-mcp` tools.

Before doing any model work:
1. Check `powerbi-modeling` tools are in the tool list
2. If not available: tell the user to open Claude Code from the `powerbi-claude` directory and reload the VS Code window
3. Confirm Power BI Desktop is open with a file loaded
4. Call `connection_operations → ListLocalInstances` then `Connect`

---

## Phase 1 — Data Discovery

1. Ask the user for absolute paths to all CSV files
2. Read each file (first 50–100 rows)
3. For each file, infer: table name, column names, data types, row count, categorical columns, date columns, candidate keys
4. Summarize findings before asking questions

---

## Phase 2 — Relationship Mapping

Ask the user to confirm or correct:
- Any auto-detected FK/PK relationships
- Cardinality (which is the "one" side, which is "many")
- Which tables are dimensions vs facts

---

## Phase 3 — Requirements Gathering

Ask:
1. Top 3 business questions the dashboard must answer
2. Key KPIs and metrics
3. Whether time intelligence is needed (YTD, MoM, etc.)
4. Which dimensions to use as slicers/filters
5. Audience: executives (KPIs), analysts (drill-down), or operational (row detail)

Define: list of DAX measures, page count, visual types per section.

---

## Phase 4 — PBIP Project Setup

Create the folder structure in `output/` before connecting to MCP.

```
output/
  DashboardName.pbip
  DashboardName.Dataset/
    .platform
    definition.pbidataset
    ← DO NOT create model.bim yet
  DashboardName.Report/
    .platform
    definition.pbir             ← NOT definition.pbireport
    definition/
      report.json
      pages/
        <20-char-hex>/
          page.json
```

Generate random 20-character lowercase hex strings for page and visual names.

### File contents

**`DashboardName.pbip`**
```json
{ "version": "1.0", "artifacts": [{ "report": { "path": "DashboardName.Report" } }], "settings": {} }
```

**`DashboardName.Dataset/.platform`**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
  "metadata": { "type": "SemanticModel", "displayName": "DashboardName" },
  "config": { "version": "2.0", "logicalId": "<uuid>" }
}
```

**`DashboardName.Dataset/definition.pbidataset`**
```json
{ "version": "1.0", "settings": {} }
```

**`DashboardName.Report/.platform`**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
  "metadata": { "type": "Report", "displayName": "DashboardName" },
  "config": { "version": "2.0", "logicalId": "<uuid>" }
}
```

**`DashboardName.Report/definition.pbir`**
```json
{ "version": "1.0", "datasetReference": { "byPath": { "path": "../DashboardName.Dataset" } } }
```

**`DashboardName.Report/definition/report.json`**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/report/3.2.0/schema.json",
  "themeCollection": {
    "baseTheme": { "name": "CY26SU02", "reportVersionAtImport": { "visual": "2.6.0", "report": "3.1.0", "page": "2.3.0" }, "type": "SharedResources" }
  },
  "resourcePackages": [
    { "name": "SharedResources", "type": "SharedResources", "items": [{ "name": "CY26SU02", "path": "BaseThemes/CY26SU02.json", "type": "BaseTheme" }] }
  ]
}
```

**`pages/<hex>/page.json`**
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json",
  "name": "<20-char-hex>",
  "displayName": "Overview",
  "displayOption": "FitToPage",
  "height": 720,
  "width": 1280
}
```

---

## Phase 5 — Semantic Model via MCP

Tell the user to open the `.pbip` file in Power BI Desktop, then proceed in this order:

### 5a. Connect
```
connection_operations → ListLocalInstances
connection_operations → Connect  connectionString: "Data Source=localhost:<port>;Application Name=MCP-PBIModeling"
```

### 5b. Create tables
```
table_operations → Create
  name: "TableName"
  mExpression: |
    let
        Source = Csv.Document(File.Contents("C:\\path\\to\\file.csv"),
            [Delimiter=",", Columns=N, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
        PromotedHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
        ChangedTypes = Table.TransformColumnTypes(PromotedHeaders, {
            {"IdCol", Int64.Type}, {"TextCol", type text}, {"AmountCol", type number}
        })
    in ChangedTypes
  columns: [
    { "name": "IdCol", "dataType": "int64", "sourceColumn": "IdCol", "summarizeBy": "none" },
    { "name": "TextCol", "dataType": "string", "sourceColumn": "TextCol" },
    { "name": "AmountCol", "dataType": "double", "sourceColumn": "AmountCol", "formatString": "#,##0.00" }
  ]
```

Use `QuoteStyle.Csv` (not `QuoteStyle.None`). Always use absolute paths with escaped backslashes.

### 5c. Refresh each table immediately after creation
```
partition_operations → RefreshWithXMLA
  refreshDefinitions: [{ "tableName": "TableName", "refreshType": "Full" }]
```

### 5d. Create relationships
```
relationship_operations → Create
  fromTable: "DimTable"    toTable: "FactTable"
  fromColumn: "Id"         toColumn: "ForeignKeyId"
  cardinality: "OneToMany"
  crossFilteringBehavior: "Single"
```

### 5e. Create `_Measures` table
```
table_operations → Create
  name: "_Measures"
  daxExpression: "ROW(\"placeholder\", BLANK())"
```
No `columns` array — it's a calculated table.

### 5f. Create DAX measures
```
measure_operations → Create
  definitions: [
    { "name": "Total X", "tableName": "_Measures", "expression": "COUNTROWS(Table)", "formatString": "#,##0" },
    { "name": "Rate %", "tableName": "_Measures", "expression": "DIVIDE([A], [B])", "formatString": "0.0%" }
  ]
```

Always use `DIVIDE()` for ratios. Common patterns:
- Count: `COUNTROWS(Table)`
- Filtered count: `CALCULATE(COUNTROWS(Table), Table[Col] = value)`
- Sum: `SUM(Table[Col])`
- Average: `AVERAGE(Table[Col])`
- Distinct: `DISTINCTCOUNT(Table[Col])`
- YTD: `TOTALYTD([Measure], Calendar[Date])`

### 5g. Validate
```
dax_query_operations → Execute
  query: "EVALUATE ROW(\"M1\", [Measure1])"
  maxRows: 1
```

### 5h. Export model.bim
```
database_operations → ExportToBimFile
  bimFilePath: "C:\\absolute\\path\\to\\DashboardName.Dataset\\model.bim"
```

---

## Phase 6 — Report Visuals

Write `visual.json` files to `pages/<pageHex>/visuals/<visualHex>/visual.json`.

### Standard layout (1280×720)
```
y=0,   h=60  → Title textbox (full width)
y=70,  h=110 → KPI cards row
y=200, h=490 → Left: charts (w≈800) | Right: slicers + extra visual (x=820, w=440)
```

### Visual type reference

| Use case | `visualType` | Roles |
|---|---|---|
| Single KPI | `card` | `Values` |
| Vertical bars | `clusteredColumnChart` | `Category`, `Y` |
| Horizontal bars | `clusteredBarChart` | `Category`, `Y` |
| Line chart | `lineChart` | `Category`, `Y` |
| Donut/pie | `donutChart` | `Category`, `Y` |
| Slicer | `slicer` | `Values` + `objects` + `filterConfig` |
| Table | `tableEx` | `Values` |
| Matrix | `matrix` | `Rows`, `Columns`, `Values` |
| Title/text | `textbox` | (static, no query) |

For full JSON templates of each visual type, see `WORKING_PATTERNS.md` Section 10.

**Critical naming:** `clusteredColumnChart` / `clusteredBarChart` — NOT `columnChart` / `barChart`.
**Slicer:** must include `objects` and `filterConfig` blocks or PBI throws `CustomVisualNotFound`.
**Slicer dropdown style:** set `mode: 'Dropdown'` and `orientation: "1D"` (no quotes around `1D`).

### Custom theme
If a theme JSON is provided:
1. Place at `DashboardName.Report/StaticResources/RegisteredResources/<ThemeName>.json`
2. Filename must match the theme's `"name"` field exactly (e.g. `Accessible Orchid.json`)
3. Add to `report.json`:
```json
"customTheme": {
  "name": "Accessible Orchid",
  "reportVersionAtImport": { "visual": "2.6.0", "report": "3.1.0", "page": "2.3.0" },
  "type": "RegisteredResources"
}
```
And in `resourcePackages`:
```json
{ "name": "RegisteredResources", "type": "RegisteredResources",
  "items": [{ "name": "Accessible Orchid", "path": "Accessible Orchid", "type": "CustomTheme" }] }
```
Note: `"path"` is the name WITHOUT `.json` — PBI Desktop appends it when resolving.

---

## Phase 7 — visual_registry.md

After writing all visuals, create `output/visual_registry.md` with:
- Page table: hex → display name → file path
- Visual table: hex → descriptive name → visualType → data bound
- Layout diagram (ASCII)
- Measures table: name → DAX expression → format
- Tables table: name → source
- Instructions for how to use the file in future sessions

This file allows future sessions without context to immediately locate and edit any visual or measure.

---

## Phase 8 — Delivery

1. Confirm PBIP folder is complete and JSON files are valid
2. Tell the user: *"Open `output/DashboardName.pbip` in Power BI Desktop"*
3. Warn: CSV files must still be at their original paths for the first data refresh
4. First save in Desktop will prompt to upgrade to TMDL and PBIR formats — both are safe to accept
5. To export as a single `.pbix` file: **File → Save As → Power BI Desktop file (*.pbix)**
6. Offer to add pages, adjust measures, change visual types, or apply a theme

---

## Data Type Mapping

| CSV pattern | M type | BIM dataType | Format string |
|---|---|---|---|
| All integers | `Int64.Type` | `int64` | `"#,##0"` |
| Decimals | `type number` | `double` | `"#,##0.00"` |
| Currency | `type number` | `double` | `"$ #,##0.00"` |
| `YYYY-MM-DD` | `type date` | `dateTime` | `"dd/MM/yyyy"` |
| `DD/MM/YYYY` | `type date` | `dateTime` | `"dd/MM/yyyy"` |
| Datetime | `type datetime` | `dateTime` | `"dd/MM/yyyy HH:mm"` |
| Boolean | `type logical` | `boolean` | — |
| Low-cardinality text | `type text` | `string` | — |

---

## Complete Error Reference

| Error | Root cause | Fix |
|---|---|---|
| "user declined to confirm" | Missing `--skipconfirmation` | Add to `.mcp.json`, reload VS Code window |
| MCP panel restart doesn't fix it | Claude Code server is separate from VS Code extension | Full window reload only |
| "Columns cannot be specified for calculated tables" | Passed `columns` to DAX table | Remove `columns` array |
| "Required artifact missing definition.pbir" | Wrong filename | Rename to `definition.pbir` |
| "Expected $schema property" | `.platform` missing `$schema` | Add full URL |
| "Property version not defined" | `version` at root of `.platform` | Move inside `config` |
| "Missing required artifact model.bim" | TMDL folder used | Use `ExportToBimFile` |
| Visuals blank on canvas | Old `projections`/`prototypeQuery` format | Use `query.queryState` format |
| `CustomVisualNotFound` | Used `"slicerVisual"` | Use `"slicer"` + `objects` + `filterConfig` |
| Slicer shows label only, no items | Wrong orientation value | Use `"1D"` (no quotes) for dropdown |
| Measures return blank | Table not refreshed | Run `RefreshWithXMLA` after every `Create` |
| Theme reverts to blue | File named `Theme.json` but path uses theme name | Name file `<ThemeName>.json` |
| `reportVersionAtImport` missing | `customTheme` missing required field | Add `reportVersionAtImport` to `customTheme` block |

---

## Troubleshooting: MCP Write Operations Fail

**Symptom:** All MCP write tools return "user declined to confirm"

**Fix:**
1. Ensure `.mcp.json` has `--skipconfirmation`
2. `Ctrl+Shift+P` → **Developer: Reload Window**
3. Verify MCP log: `Skip Confirmation: Enabled`

**Why the VS Code MCP panel restart doesn't work:** Claude Code starts its own separate `npx` process. Restarting from the VS Code MCP panel only restarts the Copilot extension's server — a completely different process. Full window reload is always required.

---

## Discovering Unknown Visual Formats

When a visual renders blank, throws an error, or needs a format/property that isn't documented yet, use this process instead of guessing:

### Process

1. **Tell the user exactly what to do in Power BI Desktop:**
   > "Please add a [visual type] to the canvas manually — drag [field] onto it — then hit `Ctrl+S`. Come back here when done."

2. **Find the file PBI Desktop generated:**
   ```
   Glob → output/DashboardName.Report/definition/pages/<pageHex>/visuals/*/visual.json
   ```
   The new folder will have a hex name you haven't seen before.

3. **Read it:**
   ```
   Read → output/.../visuals/<newHex>/visual.json
   ```

4. **Extract the working pattern** — note every property that differs from what you tried.

5. **Apply it** to the broken visual(s).

6. **Document it immediately** in `WORKING_PATTERNS.md` Section 10 so it's available in future sessions without needing to repeat this process.

7. **Delete the test visual** PBI Desktop created (delete the folder) to keep the canvas clean.

### Examples from this project

| Visual | Problem | Discovered via |
|---|---|---|
| `clusteredColumnChart` | Old `projections`/`prototypeQuery` format rendered blank | User added chart manually → read generated file |
| `slicer` (list) | `slicerVisual` caused `CustomVisualNotFound` | User added slicer manually → correct type is `slicer` + `objects` + `filterConfig` |
| `slicer` (dropdown) | `orientation: 'Horizontal'` broke item rendering | User changed style in Format pane → `mode: 'Dropdown'` + `orientation: "1D"` |

### What to document in WORKING_PATTERNS.md

When a new format is confirmed, add it to Section 10 with:
- The `visualType` string
- All required roles
- The complete minimal `visual.json` that works
- Any special properties (like `objects`, `filterConfig`, orientation values)
- A note on what the wrong approach was and why it fails

---

## Limitations

- Visuals require Power BI Desktop to render — cannot be previewed as JSON
- CSV paths are hardcoded — if CSVs move, the model breaks
- No RLS by default — add via `security_role_operations` if needed
- No scheduled refresh — local Desktop only; publish to PBI Service for cloud refresh
- Single `.pbix` export requires Power BI Desktop (File → Save As) — cannot be done programmatically
