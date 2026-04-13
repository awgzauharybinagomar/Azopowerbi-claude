# Continuing Work on an Existing Dashboard

When you return to a dashboard in a new Claude Code session, all prior context is lost. This guide covers how to resume cleanly.

---

## What persists between sessions

| What | Where | Notes |
|---|---|---|
| Semantic model | `DashboardName.Dataset/model.bim` | Exported by MCP — fully readable |
| Report visuals | `DashboardName.Report/definition/pages/*/visuals/*/visual.json` | Plain JSON — editable without MCP |
| Visual map | `output/visual_registry.md` | The key navigation file — read this first |
| Measures | Inside `model.bim` → `"measures"` array | Readable; requires MCP reconnect to modify |
| Column names | Inside `model.bim` → `"columns"` array | Readable; requires MCP reconnect to modify |

---

## First step in every continuation session

Read `output/visual_registry.md` before doing anything else. It contains:
- Every hex ID mapped to a human name and visual type
- Every measure name, DAX expression, and format string
- The full page and layout structure
- The table names and their source CSV paths

This file replaces session memory. Without it, every hex folder is opaque.

---

## What you can do without reconnecting to MCP

These operations only touch the PBIP JSON files — no MCP needed:

- Add, edit, or delete visual.json files
- Add a new page (new hex folder + page.json)
- Change visual positions or sizes
- Change visual titles (textbox visuals)
- Apply or swap a custom theme
- Change slicer style (Basic/Dropdown) in the `objects` block
- Fix visual JSON errors

Reconnect to MCP only when you need to:
- Add or modify a table
- Add, rename, or edit a measure
- Rename a column
- Re-export model.bim after any model change

---

## Reconnecting to MCP on an existing file

1. Ensure Power BI Desktop is open with the `.pbip` file loaded
2. Verify MCP is running: check MCP output log for `Skip Confirmation: Enabled`
3. Reconnect:
   ```
   connection_operations → ListLocalInstances
   connection_operations → Connect
     connectionString: "Data Source=localhost:<port>;Application Name=MCP-PBIModeling"
   ```
4. The semantic model is already loaded — you do NOT need to recreate tables or measures
5. Make your changes (new measures, column renames, etc.)
6. Re-export model.bim when done:
   ```
   database_operations → ExportToBimFile
     bimFilePath: "C:\\absolute\\path\\to\\DashboardName.Dataset\\model.bim"
   ```

> If `ListLocalInstances` returns empty: Power BI Desktop must be open with the file. Open the `.pbip` first, then try again.

---

## Adding a new page

1. Generate a new 20-character lowercase hex string for the page folder name
2. Create:
   ```
   pages/<newHex>/page.json
   pages/<newHex>/visuals/    ← empty folder (create at least one visual)
   ```
3. `page.json` minimal content:
   ```json
   {
     "$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definition/page/2.1.0/schema.json",
     "name": "<newHex>",
     "displayName": "New Page Title",
     "displayOption": "FitToPage",
     "height": 720,
     "width": 1280
   }
   ```
4. Write visuals into the new page's `visuals/` folder
5. Close and reopen the `.pbip` in Power BI Desktop — or use File → Refresh to pick up the new page
6. Update `visual_registry.md` with the new page and all new visuals

---

## Adding a visual to an existing page

1. Get the page hex from `visual_registry.md`
2. Generate a new 20-character hex for the visual folder
3. Write `pages/<pageHex>/visuals/<newVisualHex>/visual.json`
4. Add it to `visual_registry.md`
5. Close and reopen the `.pbip` in Power BI Desktop to see the change

---

## Modifying an existing visual

1. Look up the hex ID in `visual_registry.md`
2. Read the current file: `pages/<pageHex>/visuals/<visualHex>/visual.json`
3. Edit only the fields that need to change
4. Close and reopen the `.pbip` (or save and refresh in Desktop)

Common modifications:
- **Move/resize**: change `position.x`, `position.y`, `position.width`, `position.height`
- **Change measure**: update `Property`, `queryRef`, `nativeQueryRef` in the projections
- **Change chart type**: change `visualType` — also verify roles are correct for the new type (see WORKING_PATTERNS.md Section 10)
- **Change slicer field**: update `Entity` and `Property` in the query, and `field` in `filterConfig`

---

## Adding a new measure in a continuation session

1. Reconnect to MCP (see above)
2. The `_Measures` table already exists — do not recreate it
3. Create only the new measure:
   ```
   measure_operations → Create
     definitions: [
       { "name": "New Measure", "tableName": "_Measures", "expression": "...", "formatString": "..." }
     ]
   ```
4. Validate:
   ```
   dax_query_operations → Execute
     query: "EVALUATE ROW(\"Result\", [New Measure])"
     maxRows: 1
   ```
5. Export model.bim
6. Write the visual that uses it
7. Add the measure to `visual_registry.md`

---

## What happens when Power BI Desktop prompts to upgrade

On first open of a PBIP created by this agent, Power BI Desktop may show:

> "This file uses an older format. Upgrade to the latest PBIR/TMDL format?"

**It is safe to accept both upgrades.** Power BI Desktop will:
- Convert report JSON to the latest PBIR schema version (in place)
- Optionally convert `model.bim` to TMDL folder format

If you accept TMDL conversion: `model.bim` is replaced by a `definition/` folder. The agent cannot use `ExportToBimFile` after this — MCP will export to TMDL instead. All patterns in WORKING_PATTERNS.md still apply for measures and tables via MCP.

If you decline: the file continues to work as-is. No features are lost.

**Recommendation:** Accept the PBIR upgrade (report JSON), decline the TMDL upgrade (model) unless you specifically want TMDL. This keeps `ExportToBimFile` working as documented.

---

## Quick reconnect checklist

Before starting any continuation session:

- [ ] Read `output/visual_registry.md` to restore context
- [ ] Open Power BI Desktop with the `.pbip` file
- [ ] Confirm MCP log shows `Skip Confirmation: Enabled`
- [ ] Run `ListLocalInstances` to confirm connection
- [ ] Identify whether the task needs MCP (model changes) or just JSON edits (visual changes)
