# Power BI Dashboard Builder — Proven Working Patterns

Every pattern in this file is confirmed working through actual testing.
When building a new dashboard, follow this file exactly. Do not guess.

---

## 1. MCP Server Setup

### `.mcp.json` (project root)
```json
{
  "mcpServers": {
    "powerbi-modeling": {
      "command": "npx",
      "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start", "--skipconfirmation"]
    }
  }
}
```

- `--skipconfirmation` is **required** — without it every write fails with "user declined"
- After any change to `.mcp.json`: `Ctrl+Shift+P` → **Developer: Reload Window**
- Restarting from VS Code MCP panel only restarts Copilot's server, NOT Claude Code's
- Verify in MCP output log: `Skip Confirmation: Enabled`

---

## 2. Connecting to Power BI Desktop

Power BI Desktop must be open with the file loaded before connecting.

```
connection_operations → ListLocalInstances
connection_operations → Connect
  connectionString: "Data Source=localhost:<port>;Application Name=MCP-PBIModeling"
```

---

## 3. Loading CSV Data

```
table_operations → Create
  name: "TableName"
  mExpression: |
    let
        Source = Csv.Document(
            File.Contents("C:\\absolute\\path\\to\\file.csv"),
            [Delimiter=",", Columns=N, Encoding=65001, QuoteStyle=QuoteStyle.Csv]
        ),
        PromotedHeaders = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
        ChangedTypes = Table.TransformColumnTypes(PromotedHeaders, {
            {"IdCol", Int64.Type},
            {"TextCol", type text},
            {"DecimalCol", type number},
            {"DateCol", type date}
        })
    in
        ChangedTypes
  columns: [
    { "name": "IdCol", "dataType": "int64", "sourceColumn": "IdCol", "summarizeBy": "none" },
    { "name": "TextCol", "dataType": "string", "sourceColumn": "TextCol" },
    { "name": "DecimalCol", "dataType": "double", "sourceColumn": "DecimalCol", "formatString": "#,##0.00" },
    { "name": "DateCol", "dataType": "dateTime", "sourceColumn": "DateCol", "formatString": "dd/MM/yyyy" }
  ]
```

- Use `QuoteStyle.Csv` — handles quoted fields containing commas correctly
- Use `Encoding=65001` for UTF-8
- Always use absolute Windows paths with escaped backslashes
- `Columns=N` must match exact column count in CSV

Then immediately refresh:
```
partition_operations → RefreshWithXMLA
  refreshDefinitions: [{ "tableName": "TableName", "refreshType": "Full" }]
```

Table is empty until refreshed. Always refresh before running DAX.

---

## 4. Creating Measures

### Create `_Measures` calculated table
```
table_operations → Create
  name: "_Measures"
  daxExpression: "ROW(\"placeholder\", BLANK())"
```
**No `columns` array** — columns are derived from the DAX expression. Passing `columns` fails.

### Create measures in batch
```
measure_operations → Create
  definitions: [
    { "name": "Total Records", "tableName": "_Measures", "expression": "COUNTROWS(TableName)", "formatString": "#,##0" },
    { "name": "Rate %", "tableName": "_Measures", "expression": "DIVIDE([Numerator], [Denominator])", "formatString": "0.0%" }
  ]
```

Always use `DIVIDE()` for ratios — never `/`.

### Validate
```
dax_query_operations → Execute
  query: "EVALUATE ROW(\"M1\", [Measure1], \"M2\", [Measure2])"
  maxRows: 1
```

---

## 5. Renaming columns

```
column_operations → Rename
  renameDefinitions: [
    { "tableName": "TableName", "currentName": "OldName", "newName": "Friendly Name" }
  ]
```

After renaming, update all `visual.json` files that reference the old name (`Property`, `queryRef`, `nativeQueryRef`), then re-export `model.bim`.

---

## 6. Exporting model.bim

**Always export after all model changes.** Never write `model.bim` manually.

```
database_operations → ExportToBimFile
  bimFilePath: "C:\\absolute\\path\\to\\DashboardName.Dataset\\model.bim"
```

---

## 7. PBIP Folder Structure

**Each dashboard lives in its own subfolder inside `output/`.** Never place dashboard files directly in `output/` root.

```
output/
  DashboardName/
    DashboardName.pbip
    DashboardName.Dataset/
      .platform
      definition.pbidataset
      model.bim                   ← exported by MCP, never written manually
    DashboardName.Report/
      .platform
      definition.pbir             ← NOT definition.pbireport
      StaticResources/
        RegisteredResources/
          ThemeName.json          ← custom theme file (name must match theme's "name" field)
      definition/
        report.json
        pages/
          pages.json              ← REQUIRED: lists page order and active page
          <20-char-hex>/
            page.json
            visuals/
              <20-char-hex>/
                visual.json
    visual_registry.md            ← maps hex IDs to human names
```

---

## 8. Exact File Contents

### `DashboardName.pbip`
```json
{ "version": "1.0", "artifacts": [{ "report": { "path": "DashboardName.Report" } }], "settings": {} }
```

### `DashboardName.Dataset/.platform`
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
  "metadata": { "type": "SemanticModel", "displayName": "DashboardName" },
  "config": { "version": "2.0", "logicalId": "<generate-uuid>" }
}
```

### `DashboardName.Dataset/definition.pbidataset`
```json
{ "version": "1.0", "settings": {} }
```

### `DashboardName.Report/.platform`
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json",
  "metadata": { "type": "Report", "displayName": "DashboardName" },
  "config": { "version": "2.0", "logicalId": "<generate-uuid>" }
}
```

### `DashboardName.Report/definition.pbir`
```json
{ "version": "1.0", "datasetReference": { "byPath": { "path": "../DashboardName.Dataset" } } }
```

### `DashboardName.Report/definition/report.json`
Leave minimal — Power BI Desktop upgrades it on first open:
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

### `pages/<hex>/page.json`
```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json",
  "name": "<20-char-hex>",
  "displayName": "Page Title",
  "displayOption": "FitToPage",
  "height": 720,
  "width": 1280
}
```

---

## 9. Custom Theme

### File placement
- File: `DashboardName.Report/StaticResources/RegisteredResources/<ThemeName>.json`
- The filename must match the `"name"` field inside the JSON (e.g. `Accessible Orchid.json` for `"name": "Accessible Orchid"`)

### report.json additions
```json
"themeCollection": {
  "baseTheme": { ... },
  "customTheme": {
    "name": "Accessible Orchid",
    "reportVersionAtImport": { "visual": "2.6.0", "report": "3.1.0", "page": "2.3.0" },
    "type": "RegisteredResources"
  }
},
"resourcePackages": [
  { "name": "SharedResources", ... },
  {
    "name": "RegisteredResources",
    "type": "RegisteredResources",
    "items": [{ "name": "Accessible Orchid", "path": "Accessible Orchid", "type": "CustomTheme" }]
  }
]
```

**Critical:** The `"path"` value is the theme name **without** `.json` extension. Power BI Desktop appends `.json` when resolving. The file on disk must be named `<ThemeName>.json`.

---

## 10. PBIR Visual Format (Confirmed Working)

Schema: `https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.7.0/schema.json`

Page and visual folder names are 20-character lowercase hex strings.

### KPI Card
```json
{
  "$schema": "...",
  "name": "<20-char-hex>",
  "position": { "x": 20, "y": 70, "z": 0, "width": 228, "height": 110, "tabOrder": 0 },
  "visual": {
    "visualType": "card",
    "query": { "queryState": { "Values": { "projections": [{
      "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Measure Name" } },
      "queryRef": "_Measures.Measure Name", "nativeQueryRef": "Measure Name"
    }] } } },
    "drillFilterOtherVisuals": true
  }
}
```

### Column / Bar Chart
```json
{
  "visual": {
    "visualType": "clusteredColumnChart",
    "query": { "queryState": {
      "Category": { "projections": [{
        "field": { "Column": { "Expression": { "SourceRef": { "Entity": "TableName" } }, "Property": "ColumnName" } },
        "queryRef": "TableName.ColumnName", "nativeQueryRef": "ColumnName", "active": true
      }]},
      "Y": { "projections": [{
        "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Measure Name" } },
        "queryRef": "_Measures.Measure Name", "nativeQueryRef": "Measure Name"
      }]}
    }},
    "drillFilterOtherVisuals": true
  }
}
```
Use `clusteredBarChart` for horizontal bars. NOT `barChart` / `columnChart`.

### Slicer — List style (default)
```json
{
  "visual": {
    "visualType": "slicer",
    "query": { "queryState": { "Values": { "projections": [{
      "field": { "Column": { "Expression": { "SourceRef": { "Entity": "TableName" } }, "Property": "ColumnName" } },
      "queryRef": "TableName.ColumnName", "nativeQueryRef": "ColumnName", "active": true
    }] } } },
    "objects": {
      "data": [{ "properties": { "mode": { "expr": { "Literal": { "Value": "'Basic'" } } } } }],
      "general": [{ "properties": {} }]
    },
    "drillFilterOtherVisuals": true
  },
  "filterConfig": { "filters": [{
    "name": "<20-char-hex>",
    "field": { "Column": { "Expression": { "SourceRef": { "Entity": "TableName" } }, "Property": "ColumnName" } },
    "type": "Categorical"
  }] }
}
```

### Slicer — Dropdown style (Suspenso)
Same as above but change `objects`:
```json
"objects": {
  "data": [{ "properties": { "mode": { "expr": { "Literal": { "Value": "'Dropdown'" } } } } }],
  "general": [{ "properties": { "orientation": { "expr": { "Literal": { "Value": "1D" } } } } }]
}
```
Note: `"1D"` has NO single quotes — it is not a string literal, unlike `'Dropdown'` and `'Basic'`.

### Textbox (title)
```json
{
  "visual": {
    "visualType": "textbox",
    "objects": { "general": [{ "properties": { "paragraphs": [{
      "textRuns": [{ "value": "Title Text", "textStyle": { "fontWeight": "bold", "fontSize": "20pt" } }],
      "horizontalTextAlignment": "center"
    }] } }] }
  }
}
```

### Role names by visual type

| Visual type | Roles |
|---|---|
| `card` | `Values` |
| `clusteredColumnChart` | `Category`, `Y` |
| `clusteredBarChart` | `Category`, `Y` |
| `lineChart` | `Category`, `Y` |
| `donutChart` | `Category`, `Y` |
| `slicer` | `Values` + `objects` + `filterConfig` |
| `tableEx` | `Values` |
| `matrix` | `Rows`, `Columns`, `Values` |
| `textbox` | (no query — static content in `objects`) |

---

## 11. Discovering Unknown Visual Formats

When a visual format is unknown or broken, do NOT guess repeatedly. Use this process:

1. Ask the user to add the visual manually in Power BI Desktop (drag the field onto the canvas)
2. Ask the user to set any specific formatting they want (style, orientation, etc.) in the Format pane
3. Ask the user to hit `Ctrl+S`
4. Glob for new visual folders: `output/.../pages/<pageHex>/visuals/*/visual.json`
5. Read the newly generated file — it will have an unfamiliar hex name
6. Extract the exact working format from it
7. Apply to the target visual(s)
8. Delete the test visual folder to keep the canvas clean
9. **Document the confirmed format in Section 10 of this file immediately**

This is how every confirmed pattern in Section 10 was discovered. Never trust documentation over a PBI Desktop-generated file.

---

## 12. Layout Reference (1280×720 canvas)

```
[y=0,   h=60 ] Title textbox — full width (x=0, w=1280)
[y=70,  h=110] KPI Cards — divide 1240px width by number of cards (x starts at 20)
[y=200, h=490] Left charts (x=20 to x=799, w≈380 each)
               Right column (x=820, w=440):
                 Slicers stacked at top (h=90 each, 5px gap)
                 Additional visual below slicers
```

Standard card widths for 5 cards: x=20, 268, 516, 764, 1012 (w=228 each, last w=248)

---

## 13. visual_registry.md

After writing all visuals, always create `output/visual_registry.md` mapping every hex ID to its human name, visual type, data binding, and position. This file allows future sessions to identify and edit any visual without session context.

Minimum content per visual:
```markdown
| `<hex>` | Descriptive Name | visualType | Data bound (table/measure) |
```

Also include a page map and measure table.

---

## 14. Build Order (complete sequence)

1. Open Power BI Desktop with a blank file
2. Write PBIP folder structure (all files except `model.bim`)
3. Connect via MCP (`ListLocalInstances` → `Connect`)
4. Create tables via `table_operations` with M expression
5. Refresh tables via `partition_operations → RefreshWithXMLA`
6. Create `_Measures` calculated table (no `columns` array)
7. Create all measures via `measure_operations`
8. Create relationships via `relationship_operations`
9. Validate with `dax_query_operations`
10. Export `model.bim` via `database_operations → ExportToBimFile`
11. Write all `visual.json` files
12. Write `visual_registry.md`
13. Close and reopen `.pbip` in Power BI Desktop

---

## 15. Complete Error Reference

| Error | Root cause | Fix |
|---|---|---|
| "user declined to confirm" on writes | Missing `--skipconfirmation` | Add to `.mcp.json`, reload VS Code window |
| VS Code MCP panel restart doesn't fix it | Claude Code's process is separate from VS Code extension | Full window reload (`Developer: Reload Window`) |
| "Columns cannot be specified for calculated tables" | Passed `columns` to DAX table Create | Remove `columns` array |
| "Required artifact missing definition.pbir" | File named `definition.pbireport` | Rename to `definition.pbir` |
| "Expected $schema property" | `.platform` missing `$schema` | Add full `$schema` URL |
| "Property version not defined" | `version` at top level of `.platform` | Move inside `config: { version, logicalId }` |
| "Missing required artifact model.bim" | Used TMDL folder instead of BIM | Use `ExportToBimFile` |
| Only 1 page shown, all visuals blank | Missing `pages.json` in `pages/` folder | Create `pages/pages.json` with `pageOrder` array and `activePageName` |
| PBI Desktop regenerates page folders with new hex IDs, wiping visuals | PBI Desktop opened before `pages.json` existed | Always write `pages.json` before the first open. If PBI is already open for MCP work, write all visual files only after closing PBI Desktop |
| Visuals blank on canvas | Old visual format (`projections`/`prototypeQuery`) | Use `query.queryState` format (Section 10) |
| `CustomVisualNotFound` on slicer | Used `"slicerVisual"` as visualType | Use `"slicer"` + `objects` + `filterConfig` |
| Slicer shows label only, no items | `orientation: 'Horizontal'` property used | Use `"1D"` (no quotes) for dropdown, or omit for list |
| Measures return blank | Table not refreshed | Run `RefreshWithXMLA` after every `Create` |
| CSV quoted fields break | Used `QuoteStyle.None` | Use `QuoteStyle.Csv` |
| Theme not applied, visuals revert to blue | Theme file named `Theme.json` but path is theme name | Name file `<ThemeName>.json` — path in report.json omits `.json` extension |
| `reportVersionAtImport` missing error | `customTheme` block missing `reportVersionAtImport` | Add `"reportVersionAtImport": { "visual": "2.6.0", "report": "3.1.0", "page": "2.3.0" }` |

---

## 16. Multi-Table / Relational Data

When the source data spans multiple CSV files, follow this order:

### Design the model first
Before creating any tables, identify:
- **Fact tables** — transactions, events, observations (many rows, numeric columns)
- **Dimension tables** — descriptive lookup tables (fewer rows, categorical columns)
- **Relationships** — which column in the fact table is a foreign key to which dimension

Standard star schema: one fact table in the center, dimension tables connected by single-direction relationships.

### Create all tables before creating relationships
MCP requires both sides of a relationship to exist before creating the relationship.

```
table_operations → Create  (for each table)
partition_operations → RefreshWithXMLA  (immediately after each create)
```

### Relationship creation order
Dimension → Fact (dimension is the "one" side):
```
relationship_operations → Create
  fromTable: "DimProduct"      ← "one" side
  toTable: "FactSales"         ← "many" side
  fromColumn: "ProductId"
  toColumn: "ProductId"
  cardinality: "OneToMany"
  crossFilteringBehavior: "Single"
```

Use `"Both"` for `crossFilteringBehavior` only when slicers on the fact table side need to filter dimensions. Default to `"Single"`.

### Column counts per CSV
Count columns carefully — Csv.Document requires an exact count:
```
Source = Csv.Document(File.Contents("..."), [Delimiter=",", Columns=7, ...])
```
Mismatched column count is a silent load error (table loads empty or truncated).

### DAX measures in multi-table models
Always qualify table references:
```dax
Total Sales = SUM(FactSales[Amount])
Distinct Customers = DISTINCTCOUNT(FactSales[CustomerId])
Top Category = CALCULATE([Total Sales], TOPN(1, DimProduct, [Total Sales]))
```

Cross-table filtering works automatically through relationships — CALCULATE respects the model's filter context.

---

## 17. Extended DAX Patterns

All measures go in the `_Measures` calculated table. Use `DIVIDE()` for all ratios.

### Counting and filtering
```dax
-- Count rows with a condition
Filtered Count = CALCULATE(COUNTROWS(Table), Table[Status] = "Active")

-- Count distinct values
Unique Customers = DISTINCTCOUNT(FactSales[CustomerId])

-- Count non-blank
Non-Blank Count = COUNTROWS(FILTER(Table, NOT ISBLANK(Table[Column])))

-- % of total
Share % = DIVIDE(COUNTROWS(Table), CALCULATE(COUNTROWS(Table), ALL(Table)))
```

### Time intelligence (requires a Date/Calendar table)
```dax
-- Year to date
Sales YTD = TOTALYTD([Total Sales], Calendar[Date])

-- Month over month change
MoM Change = [Total Sales] - CALCULATE([Total Sales], DATEADD(Calendar[Date], -1, MONTH))

-- MoM % change
MoM % = DIVIDE([MoM Change], CALCULATE([Total Sales], DATEADD(Calendar[Date], -1, MONTH)))

-- Same period last year
Sales SPLY = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))
```

To create a Calendar table via MCP:
```
calendar_operations → Create
  startYear: 2020
  endYear: 2025
```
Then create a relationship from Calendar[Date] to the fact table's date column.

### Ranking and Top N
```dax
-- Rank (1 = highest)
Category Rank = RANKX(ALL(DimProduct[Category]), [Total Sales], , DESC, DENSE)

-- Top N flag
Is Top 5 = IF(RANKX(ALL(Table[Name]), [Measure], , DESC, DENSE) <= 5, "Top 5", "Other")
```

### Conditional and lookup
```dax
-- Conditional value
Risk Label = IF([Rate %] >= 0.5, "High", IF([Rate %] >= 0.2, "Medium", "Low"))

-- Related table lookup
Product Name = RELATED(DimProduct[Name])   -- use in calculated column, not measure
```

### Format strings reference
| Type | formatString |
|---|---|
| Integer | `"#,##0"` |
| Decimal 2dp | `"#,##0.00"` |
| Currency USD | `"$ #,##0.00"` |
| Percentage 1dp | `"0.0%"` |
| Percentage 0dp | `"0%"` |
| Date | `"dd/MM/yyyy"` |
| Date + time | `"dd/MM/yyyy HH:mm"` |

---

## 18. Additional Visual Types

### Line Chart (time series)
```json
{
  "visual": {
    "visualType": "lineChart",
    "query": { "queryState": {
      "Category": { "projections": [{
        "field": { "Column": { "Expression": { "SourceRef": { "Entity": "Calendar" } }, "Property": "Date" } },
        "queryRef": "Calendar.Date", "nativeQueryRef": "Date", "active": true
      }]},
      "Y": { "projections": [{
        "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Total Sales" } },
        "queryRef": "_Measures.Total Sales", "nativeQueryRef": "Total Sales"
      }]}
    }},
    "drillFilterOtherVisuals": true
  }
}
```

### Table Visual
Displays raw rows. Use `tableEx` (not `table`).
```json
{
  "visual": {
    "visualType": "tableEx",
    "query": { "queryState": {
      "Values": { "projections": [
        {
          "field": { "Column": { "Expression": { "SourceRef": { "Entity": "TableName" } }, "Property": "Col1" } },
          "queryRef": "TableName.Col1", "nativeQueryRef": "Col1", "active": true
        },
        {
          "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Measure1" } },
          "queryRef": "_Measures.Measure1", "nativeQueryRef": "Measure1"
        }
      ]}
    }},
    "drillFilterOtherVisuals": true
  }
}
```

### Matrix Visual
Rows, columns, and values — like a pivot table.
```json
{
  "visual": {
    "visualType": "matrix",
    "query": { "queryState": {
      "Rows": { "projections": [{
        "field": { "Column": { "Expression": { "SourceRef": { "Entity": "DimProduct" } }, "Property": "Category" } },
        "queryRef": "DimProduct.Category", "nativeQueryRef": "Category", "active": true
      }]},
      "Columns": { "projections": [{
        "field": { "Column": { "Expression": { "SourceRef": { "Entity": "Calendar" } }, "Property": "Year" } },
        "queryRef": "Calendar.Year", "nativeQueryRef": "Year", "active": true
      }]},
      "Values": { "projections": [{
        "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Total Sales" } },
        "queryRef": "_Measures.Total Sales", "nativeQueryRef": "Total Sales"
      }]}
    }},
    "drillFilterOtherVisuals": true
  }
}
```

### Multi-row Card (several KPIs stacked)
```json
{
  "visual": {
    "visualType": "multiRowCard",
    "query": { "queryState": {
      "Values": { "projections": [
        {
          "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Measure1" } },
          "queryRef": "_Measures.Measure1", "nativeQueryRef": "Measure1"
        },
        {
          "field": { "Measure": { "Expression": { "SourceRef": { "Entity": "_Measures" } }, "Property": "Measure2" } },
          "queryRef": "_Measures.Measure2", "nativeQueryRef": "Measure2"
        }
      ]}
    }},
    "drillFilterOtherVisuals": true
  }
}
```

Note: `multiRowCard` is confirmed working as a visual type string. If it renders blank, discover the format via the manual add process (Section 11).

---

## 19. Diagnosing Blank or Wrong Visuals

Use this decision tree when a visual is blank or shows an error after opening the `.pbip`.

```
Visual blank on canvas
│
├── Check: is model.bim present and non-empty?
│   └── No → ExportToBimFile first
│
├── Check: did you refresh the table after creating it?
│   └── No → RefreshWithXMLA, re-export model.bim
│
├── Check: does the visual reference the correct Entity name?
│   └── Entity name must match the table name exactly (case-sensitive)
│
├── Check: does the visual reference the correct Property name?
│   └── Property must match the column or measure name after any renames
│
├── Check: are you using query.queryState format (not prototypeQuery)?
│   └── prototypeQuery format renders blank — use queryState
│
└── Still blank → use Section 11 discovery process
    (add manually in Desktop, read the generated file)
```

When a visual shows data but wrong data:
- Verify the measure DAX with `dax_query_operations → Execute`
- Check that all tables referenced in the DAX have been refreshed
- Check relationship direction — `crossFilteringBehavior: "Single"` filters only from "one" to "many"

---

## 20. Publishing to Power BI Service (optional)

This agent produces local `.pbip` files only. To share or schedule refresh:

1. Open the `.pbip` in Power BI Desktop
2. Sign in to your Power BI account (top right)
3. **Home → Publish**
4. Choose a workspace
5. Power BI Service will host the report and semantic model in the cloud

**Limitations after publishing:**
- CSV files on your local disk are not accessible from the cloud
- To enable scheduled refresh: replace CSV sources with SharePoint, OneDrive, or a database connection in Power Query (via the Power BI Desktop Transform Data editor)
- The `.pbix` single-file export (**File → Save As → Power BI Desktop file**) can also be uploaded directly to the Service via the web UI

This agent does not automate the publishing step — it requires Desktop.
